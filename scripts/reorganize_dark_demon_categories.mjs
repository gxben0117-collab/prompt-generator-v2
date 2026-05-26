import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 提取 CATS 數組
const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 暗黑魔族分類重組 ===\n');

// 定義4大分類的分類名稱
const categoryGroups = {
  '魅魔系列': [
    '魅魔系列',
    '莉莉絲',
    '魅魔魔王',
    '暗黑魅魔',
    '魅魔暗殿',
    '魅魔王座'
  ],
  '女王系列': [
    '女王系列',
    '夜之女王',
    '魔冕女皇',
    '冥界女王',
    '吸血鬼女王',
    '亡靈女王',
    '冰雪女王',
    '龍族女王'
  ],
  '魔王系列': [
    '女魔王',
    '滅世魔女',
    '魔女',
    '女巫',
    '暗夜魔女',
    '暗魔女巫',
    '預言女巫'
  ],
  '暗黑系列': [
    '墮天使系列',
    '奇幻魔法｜墮天使系列',
    '墮天使',
    '暗黑哥德 v0.27',
    '暗黑哥德',
    '魔界系列',
    '冥界系列',
    '火獄系列',
    '暗黑史詩',
    '冥界魔后',
    '暗黑古風',
    '暗黑東方',
    '暗黑戰甲',
    '武俠江湖（暗黑變體）',
    '世界地標旅拍（暗黑幻想）',
    '世界民族服飾（暗黑變體）'
  ]
};

// 為每個分類添加 group 和 groupOrder 屬性
cats.forEach(cat => {
  if (!cat.name) return;

  for (const [groupName, categoryNames] of Object.entries(categoryGroups)) {
    const index = categoryNames.indexOf(cat.name);
    if (index !== -1) {
      cat.group = groupName;
      cat.groupOrder = index;
      console.log(`✓ ${cat.name} → ${groupName} (順序: ${index})`);
      break;
    }
  }
});

// 統計
console.log('\n' + '='.repeat(60));
console.log('【統計】');
Object.entries(categoryGroups).forEach(([groupName, categoryNames]) => {
  const count = cats.filter(cat => cat.group === groupName).length;
  console.log(`  ${groupName}: ${count} 個分類`);
});

// 將更新後的數據轉換回 JSON
const newCatsJson = JSON.stringify(cats, null, 2);

// 替換原有的 CATS 數組
html = html.replace(
  /const CATS = \[[\s\S]*?\n\];/,
  `const CATS = ${newCatsJson};`
);

// 寫回文件
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('\n✅ 完成！已為暗黑魔族相關分類添加分組信息');
console.log('   - 魅魔系列');
console.log('   - 女王系列');
console.log('   - 魔王系列');
console.log('   - 暗黑系列');
