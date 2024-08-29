import { ItemView, WorkspaceLeaf } from 'obsidian';

export class SidebarWebViewLeaf extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return "sidebar-webview";
  }

  getDisplayText() {
    return "Sidebar WebView";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    const webview = document.createElement('webview') as any;
    webview.setAttribute('src', 'https://example.com');
    webview.style.width = '100%';
    webview.style.height = '100%';
    container.appendChild(webview);
  }
}
