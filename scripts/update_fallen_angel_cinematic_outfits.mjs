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

// 墮天使電影級服裝結構（8層結構）
const fallenAngelOutfitStructure = {
  // 1. 主服裝輪廓
  silhouettes: [
    'dark gothic fallen angel gown',
    'royal black feathered ceremonial dress',
    'dark fantasy cathedral queen gown',
    'black divine armor dress',
    'corrupted holy warrior gown',
    'fallen seraph ceremonial attire'
  ],

  // 2. 布料結構（電影感核心）
  fabrics: [
    'layered translucent silk fabric',
    'tattered feather-like chiffon layers',
    'flowing dark mesh fabric',
    'heavy cinematic fabric movement',
    'torn divine silk layers',
    'weathered ceremonial fabric'
  ],

  // 3. 金屬工藝
  metalwork: [
    'ornate black silver filigree armor',
    'gothic cathedral-style metal engravings',
    'dark metallic corset structure',
    'intricate chain jewelry details',
    'spine-like ornamental armor',
    'corrupted holy metal decorations'
  ],

  // 4. 羽毛元素（墮天使靈魂）
  feathers: [
    'feather-textured shoulder structure',
    'layered raven feather details',
    'black feather embroidery integrated into the gown',
    'fallen angel feather ornamentation',
    'corrupted white-to-black gradient feathers',
    'weathered divine feather textures'
  ],

  // 5. 宗教神性元素
  divinity: [
    'corrupted divine ceremonial attire',
    'dark cathedral queen aesthetics',
    'holy yet corrupted angelic ornamentation',
    'fallen sacred symbols',
    'tainted divine jewelry',
    'corrupted celestial patterns'
  ],

  // 6. 破損感
  destruction: [
    'elegantly torn fabric edges',
    'weathered feather textures',
    'aged dark fantasy fabric detailing',
    'battle-worn divine armor',
    'gracefully deteriorating holy fabric',
    'controlled destruction aesthetics'
  ],

  // 7. 珠寶結構
  jewelry: [
    'black crystal jewelry details',
    'ornate gothic crown structure',
    'dangling dark gemstone ornaments',
    'luxury fantasy jewelry craftsmanship',
    'corrupted holy relics as jewelry',
    'dark diamond and onyx decorations'
  ],

  // 8. 服裝重量感
  weight: [
    'realistic heavy fabric behavior',
    'natural fabric gravity and movement',
    'physically realistic layered clothing',
    'cinematic fabric weight and draping',
    'authentic material physics',
    'natural wind-affected fabric flow'
  ]
};

// 為每個墮天使角色卡設計專屬電影級服飾
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
let fallenAngelIndex = 0;

// 遍歷所有角色卡
cats.forEach(cat => {
  cat.entries.forEach(entry => {
    // 檢查是否為墮天使系列
    if (entry.sub === '墮天使系列' || entry.series === '墮天使系列') {
      const outfit = generateFallenAngelOutfit(fallenAngelIndex);

      // 組合完整電影級服飾描述（8層結構）
      entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.metalwork}, ${outfit.feather}, ${outfit.divinity}, ${outfit.destruction}, ${outfit.jewelry}, ${outfit.weight}`;

      updateCount++;
      console.log(`✓ 更新: ${entry.name}`);
      console.log(`  1.輪廓: ${outfit.silhouette}`);
      console.log(`  2.布料: ${outfit.fabric}`);
      console.log(`  3.金屬: ${outfit.metalwork}`);
      console.log(`  4.羽毛: ${outfit.feather}`);
      console.log(`  5.神性: ${outfit.divinity}`);
      console.log(`  6.破損: ${outfit.destruction}`);
      console.log(`  7.珠寶: ${outfit.jewelry}`);
      console.log(`  8.重量: ${outfit.weight}`);
      console.log('');

      fallenAngelIndex++;
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

console.log(`\n✅ 完成！共更新了 ${updateCount} 個墮天使角色卡`);
console.log('\n電影級服裝8層結構：');
console.log('  1. 主服裝輪廓 - 定義大輪廓');
console.log('  2. 布料結構 - 電影感核心');
console.log('  3. 金屬工藝 - 超重要');
console.log('  4. 羽毛元素 - 墮天使靈魂');
console.log('  5. 宗教神性元素 - 電影感來源');
console.log('  6. 破損感 - 真人電影感');
console.log('  7. 珠寶結構 - 高級感');
console.log('  8. 服裝重量感 - 物理真實感');
console.log('\n效果：Netflix 黑暗奇幻電影服裝層級');
