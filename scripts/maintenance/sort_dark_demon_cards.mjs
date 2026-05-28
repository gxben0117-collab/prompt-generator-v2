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

console.log('=== 暗黑魔族角色卡排序 ===\n');

// 定義4大系列的優先級
const seriesPriority = {
  '魅魔系列': 1,
  '女王系列': 2,
  '魔王系列': 3,
  '暗黑系列': 4
};

// 定義每個系列包含的分類
const seriesCategories = {
  '魅魔系列': ['魅魔系列', '莉莉絲', '魅魔魔王', '暗黑魅魔', '魅魔暗殿', '魅魔王座'],
  '女王系列': ['女王系列', '夜之女王', '魔冕女皇', '冥界女王', '吸血鬼女王', '亡靈女王', '冰雪女王', '龍族女王'],
  '魔王系列': ['女魔王', '滅世魔女', '魔女', '女巫', '暗夜魔女', '暗魔女巫', '預言女巫'],
  '暗黑系列': ['墮天使系列', '奇幻魔法｜墮天使系列', '墮天使', '暗黑哥德 v0.27', '暗黑哥德', '魔界系列', '冥界系列', '火獄系列', '暗黑史詩', '冥界魔后', '暗黑古風', '暗黑東方', '暗黑戰甲', '武俠江湖（暗黑變體）', '世界地標旅拍（暗黑幻想）', '世界民族服飾（暗黑變體）']
};

// 獲取分類所屬的系列
function getSeriesForCategory(categoryName) {
  for (const [seriesName, categories] of Object.entries(seriesCategories)) {
    if (categories.includes(categoryName)) {
      return seriesName;
    }
  }
  return null;
}

let totalSorted = 0;

// 遍歷所有分類，對屬於4大系列的分類進行排序
cats.forEach(cat => {
  if (!cat.name || !cat.entries) return;

  const seriesName = getSeriesForCategory(cat.name);
  if (!seriesName) return; // 不屬於4大系列，跳過

  console.log(`\n處理分類: ${cat.name} (屬於 ${seriesName})`);
  console.log(`  排序前: ${cat.entries.length} 個角色卡`);

  // 為每個角色卡添加系列信息
  cat.entries.forEach(entry => {
    entry._series = seriesName;
    entry._seriesPriority = seriesPriority[seriesName];
  });

  // 排序：先按系列優先級，再按ID
  cat.entries.sort((a, b) => {
    // 第一層：按系列優先級排序
    if (a._seriesPriority !== b._seriesPriority) {
      return a._seriesPriority - b._seriesPriority;
    }

    // 第二層：按ID排序
    const idA = a.id || '';
    const idB = b.id || '';

    // 處理 undefined ID（放在最後）
    if (idA === 'undefined' && idB !== 'undefined') return 1;
    if (idA !== 'undefined' && idB === 'undefined') return -1;
    if (idA === 'undefined' && idB === 'undefined') return 0;

    return idA.localeCompare(idB);
  });

  console.log(`  排序後: ${cat.entries.length} 個角色卡`);
  console.log(`  前3個: ${cat.entries.slice(0, 3).map(e => e.name).join(', ')}`);

  totalSorted += cat.entries.length;
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

console.log('\n' + '='.repeat(60));
console.log(`✅ 完成！共排序了 ${totalSorted} 個角色卡`);
console.log('\n排序規則：');
console.log('  1. 魅魔系列 (優先級 1)');
console.log('  2. 女王系列 (優先級 2)');
console.log('  3. 魔王系列 (優先級 3)');
console.log('  4. 暗黑系列 (優先級 4)');
console.log('  5. 同系列內按 ID 排序');
