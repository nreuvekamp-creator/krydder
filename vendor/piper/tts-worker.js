// Krydder AI voice (Piper "nvcc", speaker KON) in a Web Worker, so the page never stutters.
// The page sends {base, cache, files, speaker}. "download" streams every file into Cache Storage;
// "speak" loads everything from that cache (works offline) and returns a WAV.
let opts, ort, session, cfg, makePhon, phon, phonCalls = 0, loading;

const post = (id, m, transfer) => self.postMessage(Object.assign({ id: id }, m), transfer || []);

async function cached(name) {
  const r = await (await caches.open(opts.cache)).match(opts.base + name);
  if (!r) throw new Error("not downloaded: " + name);
  return r;
}
const jsUrl = async name => URL.createObjectURL(new Blob([await (await cached(name)).arrayBuffer()], { type: "text/javascript" }));

async function download(id) {
  const c = await caches.open(opts.cache), names = Object.keys(opts.files);
  const total = names.reduce((s, n) => s + opts.files[n], 0);
  let done = 0, last = 0;
  for (const name of names) {
    if (await c.match(opts.base + name)) { done += opts.files[name]; continue; } // resume after an interrupted download
    const res = await fetch(opts.base + name, { cache: "no-store" });
    if (!res.ok) throw new Error(name + ": HTTP " + res.status);
    let got = 0;
    const count = new TransformStream({ transform(chunk, ctl) {
      got += chunk.byteLength; ctl.enqueue(chunk);
      const now = Date.now(); if (now - last > 150) { last = now; post(id, { type: "progress", loaded: done + got, total: total }); }
    } });
    const blob = await new Response(res.body.pipeThrough(count)).blob();
    if (blob.size !== opts.files[name]) throw new Error(name + ": got " + blob.size + " bytes, expected " + opts.files[name]);
    await c.put(opts.base + name, new Response(blob, { headers: { "Content-Type": res.headers.get("Content-Type") || "application/octet-stream" } }));
    done += opts.files[name];
    post(id, { type: "progress", loaded: done, total: total });
  }
}

function load() {
  return loading || (loading = (async () => {
    ort = await import(await jsUrl("ort.wasm.bundle.min.mjs"));
    ort.env.wasm.numThreads = 1; // GitHub Pages sends no COOP/COEP headers, so no threads
    ort.env.wasm.wasmBinary = await (await cached("ort-wasm-simd-threaded.wasm")).arrayBuffer();
    cfg = await (await cached("no_NO-nvcc-medium.onnx.json")).json();
    session = await ort.InferenceSession.create(new Uint8Array(await (await cached("no_NO-nvcc-medium.onnx")).arrayBuffer()), { executionProviders: ["wasm"] });
    const { createPiperPhonemize } = await import(await jsUrl("piper_phonemize.mjs"));
    const wasm = await (await cached("piper_phonemize.wasm")).arrayBuffer();
    const data = URL.createObjectURL(await (await cached("piper_phonemize.data")).blob());
    makePhon = async () => {
      let out;
      const mod = await createPiperPhonemize({ wasmBinary: wasm, locateFile: () => data, print: d => (out = d), printErr: () => {} });
      phon = text => { out = null; mod.callMain(["-l", cfg.espeak.voice, "--input", JSON.stringify([{ text: text }]), "--espeak_data", "/espeak-ng-data"]); return JSON.parse(out).phoneme_ids; };
      phonCalls = 0;
    };
    await makePhon();
  })().catch(e => { loading = null; throw e; }));
}

// callMain leaks memory: the module aborts after ~80 calls, so start a fresh one (about 15 ms) every 25 calls or after a crash
async function phonemes(text) {
  if (++phonCalls > 25) await makePhon();
  try { return phon(text); } catch (e) { await makePhon(); return phon(text); }
}

async function synth(text) {
  await load();
  const ids = await phonemes(text), s = cfg.inference;
  const feeds = {
    input: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor("float32", Float32Array.from([s.noise_scale, s.length_scale, s.noise_w]), [3]),
    sid: new ort.Tensor("int64", BigInt64Array.from([BigInt(opts.speaker)]), [1])
  };
  return wav((await session.run(feeds)).output.data, cfg.audio.sample_rate);
}

function wav(pcm, rate) {
  const v = new DataView(new ArrayBuffer(44 + pcm.length * 2));
  const s = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  s(0, "RIFF"); v.setUint32(4, 36 + pcm.length * 2, true); s(8, "WAVEfmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  s(36, "data"); v.setUint32(40, pcm.length * 2, true);
  for (let i = 0; i < pcm.length; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, pcm[i])) * 32767, true);
  return { buf: v.buffer, seconds: pcm.length / rate };
}

self.onmessage = async e => {
  const m = e.data;
  try {
    if (m.opts) opts = m.opts;
    if (m.type === "download") { await download(m.id); post(m.id, { type: "done" }); }
    else if (m.type === "load") { await load(); post(m.id, { type: "done" }); }
    else if (m.type === "speak") { const t = performance.now(), r = await synth(m.text); post(m.id, { type: "audio", wav: r.buf, seconds: r.seconds, ms: performance.now() - t }, [r.buf]); }
  } catch (err) { post(m.id, { type: "error", message: String(err && err.message || err) }); }
};
