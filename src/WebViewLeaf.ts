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
  
    // const contentDiv = container.createEl('div');
    // contentDiv.innerHTML = '<h1>WebAssembly Test</h1><div id="result"></div>';

    // const go = new Go();
    // const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;
    // const response = await fetch(wasmDataUrl);
    // const bytes = await response.arrayBuffer();
    // const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    // go.run(instance);

    // // Start the Go server
    // (window as any).startGoServer();
  
    // if (typeof (window as any).add === 'function') {
    //   const result = (window as any).add(5, 4);
    //   const resultElement = contentDiv.querySelector('#result');
    //   if (resultElement) {
    //     resultElement.textContent = `5 + 3 = ${result}`;
    //   }
    // } else {
    //   const resultElement = contentDiv.querySelector('#result');
    //   if (resultElement) {
    //     resultElement.textContent = 'WebAssembly function not available';
    //   }
    // }

    const webview = container.createEl('div');
    webview.setAttribute('src', 'https://example.com');
    webview.style.width = '100%';
    webview.style.height = '100%';
    container.appendChild(webview);
  }  
  async onClose() {
    console.log('WebViewLeaf onClose method called');
    if (this.wasmInstance && typeof this.wasmInstance.exports.free === 'function') {
      this.wasmInstance.exports.free();
    }
  }
} 
