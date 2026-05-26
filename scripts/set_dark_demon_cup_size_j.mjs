import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 為暗黑魔族設定罩杯J ===\n');

const darkDemonCategories = [
  '魅魔系列', '莉莉絲', '魅魔魔王', '暗黑魅魔', '魅魔暗殿', '魅魔王座',
  '女王系列', '夜之女王', '魔冕女皇', '冥界女王', '吸血鬼女王', '亡靈女王', '冰雪女王', '龍族女王',
  '女魔王', '滅世魔女', '魔女', '女巫', '暗夜魔女', '暗魔女巫', '預言女巫',
  '墮天使系列', '奇幻魔法｜墮天使系列', '墮天使', '暗黑哥德 v0.27', '暗黑哥德',
  '魔界系列', '冥界系列', '火獄系列', '暗黑史詩', '冥界魔后', '暗黑古風',
  '暗黑東方', '暗黑戰甲', '武俠江湖（暗黑變體）', '世界地標旅拍（暗黑幻想）',
  '世界民族服飾（暗黑變體）'
];

let updateCount = 0;

cats.forEach(cat => {
  if (!darkDemonCategories.includes(cat.name)) return;

  cat.entries.forEach(entry => {
    entry.cupSize = 'J';
    updateCount++;
  });
});

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！共為 ${updateCount} 個暗黑魔族角色卡設定罩杯J`);
