export const WASM_BASE64 = "YOUR_BASE64_STRING_HERE";

export async function loadWasmModule() {
  const binaryString = atob(WASM_BASE64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const wasmModule = await WebAssembly.instantiate(uint8Array, {
    env: {
      // Add any necessary imports here
    }
  });
  return wasmModule.instance;
}
