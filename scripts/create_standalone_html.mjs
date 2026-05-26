#!/usr/bin/env node
/**
 * 創建完全獨立的單一 HTML 文件
 * 將 core.js 和 prompt_governance.js 內嵌到 index.html 中
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 創建獨立的單一 HTML 文件...\n');

// 讀取文件
const indexPath = path.join(rootDir, 'index.html');
const coreJsPath = path.join(rootDir, 'core.js');
const governanceJsPath = path.join(rootDir, 'prompt_governance.js');

let html = fs.readFileSync(indexPath, 'utf-8');
const coreJs = fs.readFileSync(coreJsPath, 'utf-8');
const governanceJs = fs.readFileSync(governanceJsPath, 'utf-8');

console.log('✅ 已讀取所有文件');
console.log(`   index.html: ${html.length} 字元`);
console.log(`   core.js: ${coreJs.length} 字元`);
console.log(`   prompt_governance.js: ${governanceJs.length} 字元\n`);

// 找到外部 script 標籤並替換為內嵌
const scriptPattern = /<script src="prompt_governance\.js"><\/script>\s*<script src="core\.js"><\/script>/;

if (!scriptPattern.test(html)) {
  console.error('❌ 找不到外部 script 標籤');
  process.exit(1);
}

// 替換為內嵌 script
const inlineScripts = `<script>
// ═══════════════════════════════════════════
// prompt_governance.js (內嵌)
// ═══════════════════════════════════════════
${governanceJs}

// ═══════════════════════════════════════════
// core.js (內嵌)
// ═══════════════════════════════════════════
${coreJs}
</script>`;

html = html.replace(scriptPattern, inlineScripts);

// 保存
const outputPath = path.join(rootDir, 'index.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('✅ 已創建獨立的單一 HTML 文件');
console.log(`✅ 文件大小: ${(html.length / 1024).toFixed(2)} KB`);
console.log(`✅ 已保存到: ${outputPath}`);
