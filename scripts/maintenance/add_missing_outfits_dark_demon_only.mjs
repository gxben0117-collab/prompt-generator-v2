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

console.log('=== 為暗黑魔族缺失服飾的角色卡添加墮天使電影級8層結構 ===\n');

// 定義暗黑魔族4大系列包含的分類
const darkDemonCategories = [
  // 魅魔系列
  '魅魔系列', '莉莉絲', '魅魔魔王', '暗黑魅魔', '魅魔暗殿', '魅魔王座',
  // 女王系列
  '女王系列', '夜之女王', '魔冕女皇', '冥界女王', '吸血鬼女王', '亡靈女王', '冰雪女王', '龍族女王',
  // 魔王系列
  '女魔王', '滅世魔女', '魔女', '女巫', '暗夜魔女', '暗魔女巫', '預言女巫',
  // 暗黑系列
  '墮天使系列', '奇幻魔法｜墮天使系列', '墮天使', '暗黑哥德 v0.27', '暗黑哥德',
  '魔界系列', '冥界系列', '火獄系列', '暗黑史詩', '冥界魔后', '暗黑古風',
  '暗黑東方', '暗黑戰甲', '武俠江湖（暗黑變體）', '世界地標旅拍（暗黑幻想）',
  '世界民族服飾（暗黑變體）'
];

// 墮天使電影級8層結構
const fallenAngelOutfitStructure = {
  silhouettes: [
    'dark gothic fallen angel gown',
    'royal black feathered ceremonial dress',
    'dark fantasy cathedral queen gown',
    'black divine armor dress',
    'corrupted holy warrior gown',
    'fallen seraph ceremonial attire'
  ],
  fabrics: [
    'layered translucent silk fabric',
    'tattered feather-like chiffon layers',
    'flowing dark mesh fabric',
    'heavy cinematic fabric movement',
    'torn divine silk layers',
    'weathered ceremonial fabric'
  ],
  metalwork: [
    'ornate black silver filigree armor',
    'gothic cathedral-style metal engravings',
    'dark metallic corset structure',
    'intricate chain jewelry details',
    'spine-like ornamental armor',
    'corrupted holy metal decorations'
  ],
  feathers: [
    'feather-textured shoulder structure',
    'layered raven feather details',
    'black feather embroidery integrated into the gown',
    'fallen angel feather ornamentation',
    'corrupted white-to-black gradient feathers',
    'weathered divine feather textures'
  ],
  divinity: [
    'corrupted divine ceremonial attire',
    'dark cathedral queen aesthetics',
    'holy yet corrupted angelic ornamentation',
    'fallen sacred symbols',
    'tainted divine jewelry',
    'corrupted celestial patterns'
  ],
  destruction: [
    'elegantly torn fabric edges',
    'weathered feather textures',
    'aged dark fantasy fabric detailing',
    'battle-worn divine armor',
    'gracefully deteriorating holy fabric',
    'controlled destruction aesthetics'
  ],
  jewelry: [
    'black crystal jewelry details',
    'ornate gothic crown structure',
    'dangling dark gemstone ornaments',
    'luxury fantasy jewelry craftsmanship',
    'corrupted holy relics as jewelry',
    'dark diamond and onyx decorations'
  ],
  weight: [
    'realistic heavy fabric behavior',
    'natural fabric gravity and movement',
    'physically realistic layered clothing',
    'cinematic fabric weight and draping',
    'authentic material physics',
    'natural wind-affected fabric flow'
  ]
};

function generateFallenAngelOutfit(index) {
  const structure = fallenAngelOutfitStructure;
  return {
    silhouette: structure.silhouettes[index % structure.silhouettes.length],
    fabric: structure.fabrics[index % structure.fabrics.length],
    metalwork: structure.metalwork[index % structure.metalwork.length],
    feather: structure.feathers[index % structure.feathers.length],
    divinity: structure.divinity[index % structure.divinity.length],
    destruction: structure.destruction[index % structure.destruction.length],
    jewelry: structure.jewelry[index % structure.jewelry.length],
    weight: structure.weight[index % structure.weight.length]
  };
}

let updateCount = 0;
let outfitIndex = 0;

// 遍歷所有分類
cats.forEach(cat => {
  // 只處理暗黑魔族相關分類
  if (!darkDemonCategories.includes(cat.name)) {
    return;
  }

  cat.entries.forEach(entry => {
    // 檢查是否缺少服飾
    const hasOutfit = entry.outfit && entry.outfit.trim() !== '';

    if (!hasOutfit) {
      const outfit = generateFallenAngelOutfit(outfitIndex);

      // 組合完整電影級服飾描述（8層結構）
      entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.metalwork}, ${outfit.feather}, ${outfit.divinity}, ${outfit.destruction}, ${outfit.jewelry}, ${outfit.weight}`;

      updateCount++;
      console.log(`✓ ${entry.name}`);
      console.log(`  分類: ${cat.name}`);
      console.log(`  服飾: ${entry.outfit.substring(0, 100)}...`);
      console.log('');

      outfitIndex++;
    }
  });
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

console.log('='.repeat(60));
console.log(`✅ 完成！共為 ${updateCount} 個暗黑魔族角色卡添加了墮天使電影級8層結構服飾`);
