import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Toolbar } from './Toolbar.js';
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
    const container = this.containerEl.children[1];
    container.empty();


    // Create toolbar container
    const toolbarContainer = container.createEl('div');
    ReactDOM.render(
      React.createElement(Toolbar, { app: this.app }),
      toolbarContainer
    );
  
    const contentDiv = container.createEl('div');
    contentDiv.innerHTML = '<h1>WebAssembly Test</h1><div id="result"></div>';
  
    // const go = new Go();
    // const wasmPath = this.app.vault.adapter.getResourcePath('src/wasm/main.wasm');
    // const response = await fetch(wasmPath);
    // const bytes = await response.arrayBuffer();
    // const { instance } = await WebAssembly.instantiate(bytes, go.importObject);

    const go = new Go();
    const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;
    const response = await fetch(wasmDataUrl);
    const bytes = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    go.run(instance);
  
    if (typeof (window as any).add === 'function') {
      const result = (window as any).add(5, 4);
      const resultElement = contentDiv.querySelector('#result');
      if (resultElement) {
        resultElement.textContent = `5 + 3 = ${result}`;
      }
    } else {
      const resultElement = contentDiv.querySelector('#result');
      if (resultElement) {
        resultElement.textContent = 'WebAssembly function not available';
      }
    }
  }  
  async onClose() {
    console.log('WebViewLeaf onClose method called');
    if (this.wasmInstance && typeof this.wasmInstance.exports.free === 'function') {
      this.wasmInstance.exports.free();
    }
  }
} 


  // async onOpen() {
  //   console.log('WebViewLeaf onOpen method called');
  //   const container = this.containerEl.children[1];
  //   container.empty();

  //   // Create toolbar container
  //   const toolbarContainer = container.createEl('div');
  //   ReactDOM.render(
  //     React.createElement(Toolbar, { app: this.app }),
  //     toolbarContainer
  //   );

    // Create webview
    // const webview = document.createElement('webview') as any;

    //   const htmlContent = `
    //     <!DOCTYPE html>
    //     <html>
    //       <head>
    //         <script src="${this.app.vault.adapter.getResourcePath('src/wasm/wasm_exec.js')}"></script>
    //       </head>
    //      <body>
    //           <h1>WebAssembly Example in WebView</h1>
    //           <button onclick="testAdd()">Test Add Function</button>
    //           <script>
    //               function testAdd() {
    //                   if (window.add) {
    //                       const result = window.add(5, 3);
    //                       console.log('Result of 5 + 3:', result);
    //                       alert('Result of 5 + 3: ' + result);
    //                   } else {
    //                       console.error('Add function not available');
    //                       alert('Add function not available');
    //                   }
    //               }
    //           </script>
    //       </body>
    //     </html>
    //   `;
    //   webview.srcdoc = htmlContent;
      // const webview = document.createElement('webview') as any;
      // const htmlPath = this.app.vault.adapter.getResourcePath('index.html');
      // webview.setAttribute('src', htmlPath);
      // webview.style.width = '100%';
      // webview.style.height = 'calc(100% - 40px)'; // Adjust height for toolbar
      // container.appendChild(webview);

      // const webview = document.createElement('webview') as any;
      // webview.srcdoc = '<h1>Hello, WebView!</h1>';
      // webview.style.width = '100%';
      // webview.style.height = '100%';
      // container.appendChild(webview);

      // const contentDiv = container.createEl('div');
      // contentDiv.innerHTML = '<h1>Hello, WebView!</h1>';
      // contentDiv.style.padding = '20px';
      

     // Load WebAssembly
    //  webview.addEventListener('dom-ready', async () => {
    //   const go = new Go();
    //   const wasmPath = this.app.vault.adapter.getResourcePath('src/wasm/main.wasm');
    //   const response = await fetch(wasmPath);
    //   const bytes = await response.arrayBuffer();
    //   const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    //   go.run(instance);

    //   webview.executeJavaScript(`
    //     window.add = ${instance.exports.add};
    //     console.log('WebAssembly module loaded');
    //   `);
    // });
 // }
