import { ItemView, WorkspaceLeaf } from 'obsidian';
import { WASI } from '@wasmer/wasi';
import { wasmBase64 } from './wasmBase64';


export class WebViewLeaf extends ItemView {
  private wasmInstance: WebAssembly.Instance | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return "custom-webview";
  }

  getDisplayText() {
    return "Custom WebView";
  }

  async onOpen() {
    this.containerEl.children[1].empty();
    
    const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;
    console.log('WASM Data URL created');

    try {
        console.log('Fetching WASM module...');
        const response = await fetch(wasmDataUrl);
        console.log('WASM module fetched, converting to ArrayBuffer...');
        const buffer = await response.arrayBuffer();
        console.log('ArrayBuffer created, size:', buffer.byteLength);

        console.log('Creating WASI instance...');
        const wasi = new WASI({
            args: [],
            env: {},
            preopens: {
                '/': '/'
            }
        });
        console.log('WASI instance created');

        console.log('Preparing import object...');
        const importObject = {
            // wasi_snapshot_preview1: wasi.wasiImport,
            env: {
                memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
                // Add any other required env properties here
            }
        };
        console.log('Import object prepared');

        console.log('Instantiating WebAssembly module...');
        const result = await WebAssembly.instantiate(buffer, importObject);
        console.log('WebAssembly module instantiated');

        this.wasmInstance = result.instance;
        console.log('Starting WASI...');
        wasi.start(this.wasmInstance);
        console.log('WASM module loaded and started successfully');

        // Use your WASM instance here
    } catch (error) {
        console.error('Failed to load WASM module:', error);
        console.error('Error stack:', error.stack);
    }
}
}
