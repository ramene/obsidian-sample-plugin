importScripts('https://cdn.jsdelivr.net/gh/golang/go@go1.22.1/misc/wasm/wasm_exec.js');

self.onmessage = async function(e) {
  if (e.data.type === 'start') {
    const go = new Go();
    const result = await WebAssembly.instantiate(e.data.wasmBytes, go.importObject);
    go.run(result.instance);
    self.postMessage({ type: 'started' });
  }
};
