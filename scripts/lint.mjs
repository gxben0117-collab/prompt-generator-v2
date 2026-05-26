import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

let failed = false;

function pass(message) {
  console.log(`✓ ${message}`);
}

function fail(message) {
  failed = true;
  console.error(`✗ ${message}`);
}

function read(file) {
  return readFileSync(join(rootDir, file), 'utf-8');
}

function inlineScripts(html) {
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .join('\n');
}

console.log('🔍 執行 Lint 檢查...\n');

for (const file of ['core.js', 'prompt_governance.js']) {
  try {
    new vm.Script(read(file), { filename: file });
    pass(`${file} 語法正確`);
  } catch (err) {
    fail(`${file} 語法錯誤: ${err.message}`);
  }
}

try {
  const html = read('index.html');
  new vm.Script(inlineScripts(html), { filename: 'index.html<script>' });
  pass('index.html inline script 語法正確');

  for (const required of ['id="catStrip"', 'id="presetGrid"', 'doRandomAndCopy()', 'const CATS =', 'const PARENT_CATEGORIES =']) {
    if (!html.includes(required)) {
      fail(`index.html 缺少必要內容: ${required}`);
    }
  }
} catch (err) {
  fail(`index.html 檢查失敗: ${err.message}`);
}

const validate = spawnSync(process.execPath, ['scripts/validate_data.mjs'], {
  cwd: rootDir,
  encoding: 'utf-8'
});

if (validate.stdout) process.stdout.write(validate.stdout);
if (validate.stderr) process.stderr.write(validate.stderr);
if (validate.status !== 0 || validate.stdout.includes('發現') && !validate.stdout.includes('沒有發現問題')) {
  fail('資料完整性檢查未通過');
} else {
  pass('資料完整性檢查通過');
}

console.log('\n' + '─'.repeat(60));
if (failed) {
  console.log('✗ Lint 檢查失敗');
  process.exit(1);
}

console.log('✓ Lint 檢查通過');
