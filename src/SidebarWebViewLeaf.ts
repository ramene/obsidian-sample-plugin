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

  // async onOpen() {
  //   const container = this.containerEl.children[1] as HTMLElement;
  //   container.empty();

  //   const contentDiv = container.createEl('div', { cls: 'nextjs-content' });
  //   contentDiv.style.width = '100%';
  //   contentDiv.style.height = '100%';
  //   contentDiv.style.overflow = 'auto';

  //   // Fetch and inject content from Next.js app
  //   try {
  //     const baseUrl = 'https://example.com';
  //     const response = await fetch(baseUrl, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'text/html',
  //       },
  //     });
  //     const html = await response.text();
  //     contentDiv.innerHTML = html.replace(/src="\//g, `src="${baseUrl}/`);
  //   } catch (error) {
  //     contentDiv.innerHTML = '<p>Error loading Next.js content</p>';
  //     console.error('Failed to load Next.js content:', error);
  //   }
  // }


  // const webview = document.createElement('webview') as any;
  //   webview.setAttribute('src', 'https://example.com');
  //   webview.style.width = '100%';
  //   webview.style.height = '100%';
  //   container.appendChild(webview);


  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();

    //const webview2 = document.createElement('webview') as HTMLElement;
    const webview = document.createElement('webview') as HTMLElement;

    // webview.style.width = '100%';
    // webview.style.height = '100%';
    container.appendChild(webview);

    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    // webview.setAttribute('src', 'https://example.com');
    // webview.style.width = '100%';
    // webview.style.height = '100%';
    // container.appendChild(webview);




    for (let i = 0; i < maxRetries; i++) {
      try {
        // webview.src = 'http://localhost:3000';
        webview.setAttribute('src', 'http://localhost:3000');
        await new Promise((resolve, reject) => {
          webview.addEventListener('dom-ready', resolve);
          webview.addEventListener('did-fail-load', reject);
          webview.style.width = '100%';
          webview.style.height = '100%';
    
        });
        break; // Success, exit the loop
      } catch (error) {
        if (i === maxRetries - 1) {
          console.error('Failed to load Next.js content:', error);
          webview.setAttribute('src', 'https://example.com');
          webview.style.width = '100%';
          webview.style.height = '100%';
    
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }
  }
}
