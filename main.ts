import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { WebViewLeaf } from './src/WebViewLeaf';
import { SidebarWebViewLeaf } from './src/SidebarWebViewLeaf';
import { exec } from 'child_process';
import './styles.css';
import { wasmBase64 } from './src/wasmBase64';

// Remember to rename these classes and interfaces!
(window as any).confirmServerRunning = function(port: string) {
    console.log(`Go server confirmed running on port ${port}`);
};

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	private serverProcess: any;

	// private serverStarted = false;

	private async loadWasmExec() {
		return new Promise<void>((resolve) => {
		  const script = document.createElement('script');
		  script.src = 'https://cdn.jsdelivr.net/gh/golang/go@go1.22.1/misc/wasm/wasm_exec.js';
		  script.onload = () => resolve();
		  document.head.appendChild(script);
		});
	  }

	private async startGoServer() {
		try {
			const go = new (window as any).Go();
			const wasmBytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
			WebAssembly.instantiate(wasmBytes, go.importObject).then((result) => {
				go.run(result.instance);
				console.log("Go server started successfully");
			}).catch((error) => {
				console.error("Failed to start Go server:", error);
			});
		
			const instantiatePromise = WebAssembly.instantiate(wasmBytes, go.importObject);
			const timeoutPromise = new Promise((_, reject) => 
			  setTimeout(() => reject(new Error('WebAssembly instantiation timed out')), 5000)
			);
		
			const result = await Promise.race([instantiatePromise, timeoutPromise]);
			const instance = (result as WebAssembly.WebAssemblyInstantiatedSource).instance;
			console.log('WebAssembly instantiated successfully');
		
			go.run(instance);
			console.log('Go server started successfully');
		  } catch (error) {
			console.error('Failed to start Go server:', error);
		  }
	  }

	// private async startGoServer() {
	// 	try {
	// 	  const go = new (window as any).Go();
	// 	  const wasmBytes = Uint8Array.from(atob(wasmBase64), c => c.charCodeAt(0));
		  
	// 	  const instantiatePromise = WebAssembly.instantiate(wasmBytes, go.importObject);
	// 	  const timeoutPromise = new Promise((_, reject) => 
	// 		setTimeout(() => reject(new Error('WebAssembly instantiation timed out')), 5000)
	// 	  );
	  
	// 	  const result = await Promise.race([instantiatePromise, timeoutPromise]);
	// 	  const instance = (result as WebAssembly.WebAssemblyInstantiatedSource).instance;
	// 	  console.log('WebAssembly instantiated successfully');
	  
	// 	  go.run(instance);
	// 	  console.log('Go server started successfully');
	// 	} catch (error) {
	// 	  console.error('Failed to start Go server:', error);
	// 	}
	//   }

	//   private startGoServer() {
	// 	const workerPath = this.app.vault.adapter.getResourcePath('src/goWorker.js');
	// 	const worker = new Worker(workerPath);
	// 	worker.onmessage = (e) => {
	// 	  if (e.data.type === 'started') {
	// 		console.log('Go server started successfully in background');
	// 	  }
	// 	};
	// 	worker.postMessage({ type: 'start', wasmBytes: wasmBase64 });
	//   }
	  

	async onload() {
		await this.loadSettings();
		//await this.loadWasmExec();
    	//await this.startGoServer();

		// const script = document.createElement('script');
		// script.src = this.app.vault.adapter.getResourcePath('src/wasm/wasm_exec.js');

		// console.log(script.src)

		// document.head.appendChild(script);

		// await new Promise((resolve) => script.onload = resolve);

		// const go = new Go();
		// const wasmDataUrl = `data:application/wasm;base64,${wasmBase64}`;
		// const response = await fetch(wasmDataUrl);
		// const bytes = await response.arrayBuffer();
		// const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
		// go.run(instance);

		// await this.startGoServer();

		// Start the Go server if not already started
		// if (!this.serverStarted) {
		// 	(window as any).startGoServer = function() {
		// 		console.log('Starting Go server...');
		// 		exec('go run server.go', (error, stdout, stderr) => {
		// 		  if (error) {
		// 			console.error(`Error: ${error.message}`);
		// 			return;
		// 		  }
		// 		  if (stderr) {
		// 			console.error(`Stderr: ${stderr}`);
		// 			return;
		// 		  }
		// 		  console.log(`Server output: ${stdout}`);
		// 		});
		// 	};
		// this.serverStarted = true;
		// 	console.log("Go server initialization triggered");
		// }


		this.registerView('custom-webview', (leaf) => new WebViewLeaf(leaf));

		this.registerView(
			"sidebar-webview",
			(leaf) => new SidebarWebViewLeaf(leaf)
		);
	
		this.addRibbonIcon('globe', 'Activate WebView', () => {
		  this.activateView();
		});

		this.registerEvent(
			this.app.workspace.on('layout-change', () => {
			  const meta = document.createElement('meta');
			  meta.httpEquiv = 'Content-Security-Policy';
			  meta.content = "default-src 'self' http://localhost:3000; worker-src blob: 'self' app:; script-src 'unsafe-inline' 'unsafe-eval' 'self' http://localhost:3000 blob: app:; connect-src http://localhost:3000 data: app:;";
			  document.head.appendChild(meta);
			})
		  );

			this.app.workspace.onLayoutReady(() => {
				const meta = document.createElement('meta');
				meta.httpEquiv = 'Content-Security-Policy';
				meta.content = "default-src 'self' http://localhost:3000; worker-src blob: 'self' app:; script-src 'unsafe-inline' 'unsafe-eval' 'self' http://localhost:3000 blob: app:; connect-src http://localhost:3000 data: app:;";
				console.log('meta.content', meta.content);
				document.head.appendChild(meta);
				console.log('meta', meta);
			});
		  

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	
		// Start Go server
		// exec('go run server.go', (error, stdout, stderr) => {
		//   if (error) {
		// 	console.error(`Error: ${error.message}`);
		// 	return;
		//   }
		//   if (stderr) {
		// 	console.error(`Stderr: ${stderr}`);
		// 	return;
		//   }
		//   console.log(`Server output: ${stdout}`);
		// });
	  }



	//async onload_d() {
		// await this.loadSettings();

		 // Load wasm_exec.js
		//  const script = document.createElement('script');
		//  script.src = this.app.vault.adapter.getResourcePath('src/wasm/wasm_exec.js');
		//  document.head.appendChild(script);
	 
		 // Wait for the script to load
		// await new Promise((resolve) => script.onload = resolve);

		// const script = document.createElement('script');
		// script.src = this.app.vault.adapter.getResourcePath('src/wasm/wasm_exec.js');
		// document.head.appendChild(script);
		// await new Promise((resolve) => script.onload = resolve);

		// this.registerView(
		// 	"custom-webview",
		// 	(leaf) => new WebViewLeaf(leaf)
		// );

		// this.registerView('custom-webview', (leaf) => {
		// 	console.log('Creating new WebViewLeaf');
		// 	return new WebViewLeaf(leaf);
		//   });


		// this.registerView(
		// 	"sidebar-webview",
		// 	(leaf) => new SidebarWebViewLeaf(leaf)
		// );

		// // Add button to ribbon
		// this.addRibbonIcon('globe', 'Open WebView', () => {
		// 	this.activateView();
		// });
		

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// Perform additional things with the ribbon
		//ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	//}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
	

	async activateView() {
		const { workspace } = this.app;
		
		let leaf = workspace.getLeavesOfType("custom-webview")[0];
		if (!leaf) {
			leaf = workspace.getLeaf(false);
			await leaf.setViewState({ type: "custom-webview" });
		}
		workspace.revealLeaf(leaf);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
