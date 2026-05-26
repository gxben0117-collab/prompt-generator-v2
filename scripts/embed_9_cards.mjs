#!/usr/bin/env node
/**
 * 將 9 個角色卡嵌入到 index.html 中
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 將 9 個角色卡嵌入到 index.html...\n');

// 讀取角色卡數據
const charactersPath = path.join(rootDir, 'data', 'characters_sample.json');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));

console.log(`讀取到 ${characters.length} 個角色卡\n`);

// 讀取 index.html
const indexPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 找到 const CATS = [ 的位置
const catsStart = html.indexOf('const CATS = [');
if (catsStart === -1) {
  console.error('❌ 找不到 const CATS = [');
  process.exit(1);
}

// 找到對應的結束位置（找到下一個 const 或 </script>）
const searchFrom = catsStart + 'const CATS = ['.length;
let catsEnd = html.indexOf('\nconst ', searchFrom);
if (catsEnd === -1) {
  catsEnd = html.indexOf('</script>', searchFrom);
}

if (catsEnd === -1) {
  console.error('❌ 找不到 CATS 陣列的結束位置');
  process.exit(1);
}

console.log(`找到 CATS 陣列位置: ${catsStart} - ${catsEnd}`);

// 轉換角色卡格式為 CATS 格式
const cats = characters.map((char, index) => {
  return {
    id: `theme_${String(index + 1).padStart(3, '0')}`,
    name: char.category,
    icon: '🎭',
    tpl: 'default',
    entries: [{
      id: char.id,
      name: char.theme,
      sub: char.category,
      icon: '🎭',
      scene: char.scene.raw,
      light: char.technical.lighting,
      outfit: char.outfit.raw,
      makeup: char.makeup.raw,
      prop: char.action,
      comp: char.composition || '',
      mk: char.makeup.code,
      tpl: 'default',
      ratio: char.technical.ratio,
      lens: char.technical.lens,
      ang: char.technical.angle,
      camLang: char.technical.cameraLanguage,
      atm: char.technical.atmosphere,
      series: char.category,
      ui_status: 'core',
      sort_weight: 1000,
      source_type: 'manual',
      source_batch: 'core',
      risk_flags: [],
      cupSize: char.cupSize || '',
      race: char.race || '人類'
    }]
  };
});

// 生成新的 CATS 數據
const newCatsData = JSON.stringify(cats, null, 2);

// 替換 HTML 中的數據
const before = html.substring(0, catsStart + 'const CATS = '.length);
const after = html.substring(catsEnd);
const newHtml = before + newCatsData + ';\n' + after;

// 保存
fs.writeFileSync(indexPath, newHtml, 'utf-8');

console.log('✅ 已將 9 個角色卡嵌入到 index.html');
console.log(`✅ 文件大小: ${(newHtml.length / 1024).toFixed(2)} KB`);
