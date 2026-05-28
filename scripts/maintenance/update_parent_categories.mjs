#!/usr/bin/env node
/**
 * 更新 PARENT_CATEGORIES 以匹配 9 個角色卡
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 更新 PARENT_CATEGORIES...\n');

// 讀取角色卡數據
const charactersPath = path.join(rootDir, 'data', 'characters_sample.json');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf-8'));

// 建立父分類映射
const parentCategoriesMap = {};
characters.forEach((char, index) => {
  const themeId = `theme_${String(index + 1).padStart(3, '0')}`;
  if (!parentCategoriesMap[char.category]) {
    parentCategoriesMap[char.category] = {
      name: char.category,
      themes: []
    };
  }
  parentCategoriesMap[char.category].themes.push(themeId);
});

// 生成新的 PARENT_CATEGORIES
const newParentCategories = Object.entries(parentCategoriesMap).map(([category, data], index) => {
  return {
    id: `pc_${String(index + 1).padStart(3, '0')}`,
    name: data.name,
    icon: '🎭',
    description: data.name,
    themes: data.themes
  };
});

console.log('新的父分類:');
newParentCategories.forEach(pc => {
  console.log(`  ${pc.name}: ${pc.themes.join(', ')}`);
});

// 讀取 index.html
const indexPath = path.join(rootDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 找到 PARENT_CATEGORIES 的位置
const pcStart = html.indexOf('const PARENT_CATEGORIES = [');
if (pcStart === -1) {
  console.error('❌ 找不到 const PARENT_CATEGORIES = [');
  process.exit(1);
}

// 找到結束位置
const searchFrom = pcStart + 'const PARENT_CATEGORIES = ['.length;
let pcEnd = html.indexOf('\n];', searchFrom);
if (pcEnd === -1) {
  console.error('❌ 找不到 PARENT_CATEGORIES 陣列的結束位置');
  process.exit(1);
}
pcEnd += 3; // 包含 \n];

console.log(`\n找到 PARENT_CATEGORIES 位置: ${pcStart} - ${pcEnd}`);

// 替換
const before = html.substring(0, pcStart);
const after = html.substring(pcEnd);
const newData = `const PARENT_CATEGORIES = ${JSON.stringify(newParentCategories, null, 2)}`;
const newHtml = before + newData + after;

// 保存
fs.writeFileSync(indexPath, newHtml, 'utf-8');

console.log('\n✅ 已更新 PARENT_CATEGORIES');
console.log(`✅ 共 ${newParentCategories.length} 個父分類`);
