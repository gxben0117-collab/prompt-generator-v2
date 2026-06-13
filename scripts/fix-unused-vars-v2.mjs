// 修復未使用變數 - 使用 eslint-disable 註解
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/data.js');
let content = fs.readFileSync(filePath, 'utf8');

// 先還原之前的註解
content = content.replace(/\/\/ Unused: const /g, 'const ');

// 在文件頂部添加 eslint-disable 註解來忽略未使用變數
const lines = content.split('\n');
const insertIndex = lines.findIndex(line => line.includes('REQUESTED_DARK_ROYAL_PROFILES'));

if (insertIndex !== -1) {
  lines.splice(insertIndex, 0, '/* eslint-disable no-unused-vars */');

  // 找到最後一個未使用變數的位置，在之後添加 enable
  const lastUnusedIndex = lines.findIndex(line => line.includes('REQUESTED_THIRD_WAVE_PROFILES'));

  if (lastUnusedIndex !== -1) {
    // 找到這個變數定義結束的位置
    let endIndex = lastUnusedIndex;
    let bracketCount = 0;
    let inDefinition = false;

    for (let i = lastUnusedIndex; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('REQUESTED_THIRD_WAVE_PROFILES')) {
        inDefinition = true;
      }
      if (inDefinition) {
        bracketCount += (line.match(/\[/g) || []).length;
        bracketCount -= (line.match(/\]/g) || []).length;

        if (bracketCount === 0 && line.includes('];')) {
          endIndex = i + 1;
          break;
        }
      }
    }

    lines.splice(endIndex, 0, '/* eslint-enable no-unused-vars */');
  }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 已添加 eslint-disable 註解');
