const fs = require('fs');
const path = require('path');

const wasmPath = path.join(__dirname, './src/wasm', 'main.wasm');
const outputPath = path.join(__dirname, './src', 'wasmBase64.ts');

console.log('outputPath', outputPath);
console.log('wasmPath', wasmPath);  

const wasmBuffer = fs.readFileSync(wasmPath);
const base64 = wasmBuffer.toString('base64');

const tsContent = `export const wasmBase64 = "${base64}";`;

fs.writeFileSync(outputPath, tsContent);

console.log('WASM file converted to base64 and saved as TypeScript constant.');