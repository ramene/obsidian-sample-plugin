import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Toolbar } from './Toolbar.js';
export class WebViewLeaf extends ItemView {
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

    // Create webview
    const webview = document.createElement('webview') as any;
    webview.setAttribute('src', 'https://example.com');
    webview.style.width = '100%';
    webview.style.height = 'calc(100% - 40px)'; // Adjust height for toolbar
    container.appendChild(webview);
  }
}