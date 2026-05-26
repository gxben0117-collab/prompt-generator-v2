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

// 基礎服飾描述（保留高級訂製質感）
const baseOutfit = 'high-end couture structure, cinematic fabric weight, realistic tailoring construction, natural fabric draping, realistic transparent layering, luxury embroidery craftsmanship, realistic gold-thread details, realistic jewelry craftsmanship, realistic metal ornaments, high-end cinematic costume silhouette, natural air flow sensation, realistic fabric translucency, multi-layer garment structure';

// 為每個魅魔角色卡設計專屬服飾（加入蕾絲內衣、透明薄紗、適合的翅膀或惡魔角）
const succubusOutfits = {
  '地獄降臨': {
    prefix: 'deep crimson and obsidian black',
    details: 'delicate black lace lingerie visible beneath sheer crimson fabric, transparent flowing layers, volcanic ember-inspired metallic accents, molten gold details, dark ruby jewelry, black metal ornaments with flame motifs',
    demonFeature: 'elegant curved obsidian demon horns with flame patterns'
  },
  '深淵凝視': {
    prefix: 'midnight black and deep purple',
    details: 'intricate purple lace bodysuit beneath transparent dark veils, sheer layered fabric, violet luminescent accents, silver mystical patterns, amethyst jewelry, dark metal ornaments with abyss motifs',
    demonFeature: 'ethereal translucent purple butterfly wings with glowing vein patterns'
  },
  '血色召喚': {
    prefix: 'dark burgundy and black',
    details: 'blood-red lace corset visible through sheer ritual robes, transparent crimson layers, crimson arcane accents, blood-red gold ritual patterns, ruby jewelry, ancient metal ornaments with ritual symbols',
    demonFeature: 'elegant dark crimson demon horns with ritual engravings'
  },
  '至高王座': {
    prefix: 'obsidian black and dark silver',
    details: 'luxurious black lace lingerie beneath transparent silver fabric, sheer metallic layers, metallic royal accents, platinum sovereign patterns, black diamond jewelry, dark metal crown and ornaments',
    demonFeature: 'majestic silver-black crystalline demon horns'
  },
  '暗夜巡視': {
    prefix: 'midnight black and deep navy',
    details: 'elegant navy lace bodysuit under sheer black fabric, transparent gothic layers, gothic accents, silver torch-light patterns, sapphire jewelry, dark metal gothic ornaments',
    demonFeature: 'sleek black bat wings with navy membrane, gothic architecture-inspired'
  },
  '極致誘惑': {
    prefix: 'deep violet and black',
    details: 'seductive violet lace lingerie visible beneath transparent black veils, sheer sensual layers, purple-toned accents, gold candlelight patterns, dark amethyst jewelry, black metal ornaments with rose motifs',
    demonFeature: 'elegant curved violet-black demon horns with rose patterns'
  },
  '危險沉思': {
    prefix: 'dark violet and midnight blue',
    details: 'mysterious blue lace bodysuit under sheer violet fabric, transparent twilight layers, blue-hour accents, silver moonlight patterns, dark sapphire jewelry, metal ornaments with window motifs',
    demonFeature: 'graceful dark blue crystalline demon horns'
  },
  '盛裝出席': {
    prefix: 'refined black and golden-dark',
    details: 'luxurious golden-black lace corset beneath sheer gala fabric, transparent shimmering layers, shimmering accents, gold crystal patterns, dark diamond jewelry, black metal ornaments with chandelier motifs',
    demonFeature: 'ornate golden-black demon horns with jeweled decorations'
  },
  '華麗轉身': {
    prefix: 'dramatic black and silver',
    details: 'elegant silver lace lingerie visible through flowing black chiffon, transparent dramatic layers, rim-light accents, silver smoke patterns, dark crystal jewelry, metal ornaments with staircase motifs',
    demonFeature: 'elegant silver crystalline demon horns'
  },
  '禁忌領域': {
    prefix: 'avant-garde black and dark rose',
    details: 'forbidden rose-pattern lace bodysuit beneath thorn-decorated sheer fabric, transparent dark layers, thorn-pattern accents, dark gold rose patterns, black rose jewelry, dark metal ornaments with thorn motifs',
    demonFeature: 'sharp black crystalline demon horns with rose-thorn texture'
  },
  '純血始祖魅魔': {
    prefix: 'ancient crimson and obsidian black',
    details: 'primordial crimson lace lingerie beneath ancient ceremonial veils, transparent ancestral layers, primordial accents, blood-red gold ancient patterns, ancient ruby jewelry, primordial metal ornaments',
    demonFeature: 'massive ancient curved demon horns with battle scars'
  },
  '賽博網路魅魔': {
    prefix: 'cyber black and neon purple',
    details: 'holographic lace bodysuit with LED circuits beneath transparent tech fabric, sheer digital layers, holographic accents, neon circuit patterns, dark crystal jewelry with LED accents, metallic cyber ornaments',
    demonFeature: 'sleek metallic demon horns with glowing neon circuit patterns'
  },
  '偽聖墮落魅魔': {
    prefix: 'corrupted white and black gradient',
    details: 'corrupted white lace lingerie stained with darkness beneath torn holy fabric, transparent corrupted layers, tainted holy accents, corrupted gold sacred patterns, dark pearl jewelry, fallen angel metal ornaments',
    demonFeature: 'corrupted white-to-black gradient fallen angel wings, half-feathered half-membrane'
  },
  '巴洛克王權魅魔': {
    prefix: 'baroque gold and deep crimson',
    details: 'ornate gold lace corset beneath baroque sheer fabric, transparent rococo layers, ornate baroque accents, gold rococo patterns, baroque pearl jewelry, golden metal ornaments with royal motifs',
    demonFeature: 'elaborate baroque golden demon horns with ornate carvings'
  },
  '病嬌傀儡魅魔': {
    prefix: 'porcelain white and blood-red',
    details: 'cracked porcelain-pattern lace bodysuit with blood stains beneath doll fabric, transparent puppet layers, puppet-string accents, silver marionette patterns, cracked porcelain jewelry, metal ornaments with puppet motifs',
    demonFeature: 'delicate porcelain-white demon horns with crack patterns'
  },
  '幽冥黃泉魅魔': {
    prefix: 'ghostly pale green and black',
    details: 'ethereal pale green lace lingerie beneath ghostly transparent fabric, sheer spectral layers, soul-fire accents, pale gold spirit patterns, jade jewelry, dark metal ornaments with soul motifs',
    demonFeature: 'translucent ghostly demon horns with soul-fire glow'
  },
  '現代支配魅魔': {
    prefix: 'modern black and deep red',
    details: 'dominant red-black lace bodysuit beneath modern structured fabric, transparent power layers, contemporary accents, metallic power patterns, black diamond jewelry, modern metal ornaments with chain motifs',
    demonFeature: 'sleek modern black demon horns with sharp geometric edges'
  },
  '戰裝殺戮魅魔': {
    prefix: 'armored black and blood-red',
    details: 'battle-scarred red lace armor beneath war-torn fabric, transparent combat layers, war accents, dark metal combat patterns, blood ruby jewelry, battle metal ornaments with blade motifs',
    demonFeature: 'sharp armored demon horns with metal-plated edges'
  },
  '異域秘術魅魔': {
    prefix: 'exotic deep purple and gold',
    details: 'exotic gold-purple lace lingerie beneath mystical sheer fabric, transparent arcane layers, foreign arcane accents, gold exotic patterns, exotic gemstone jewelry, ornate metal ornaments with mystical symbols',
    demonFeature: 'mystical iridescent demon horns with shifting color patterns'
  },
  '深淵海妖魅魔': {
    prefix: 'deep ocean blue and black',
    details: 'aquatic blue lace bodysuit with pearl details beneath flowing underwater fabric, transparent oceanic layers, underwater accents, pearl wave patterns, deep sea pearl jewelry, dark metal ornaments with sea motifs',
    demonFeature: 'elegant dark blue crystalline demon horns with pearl inlays'
  }
};

let updateCount = 0;

// 遍歷所有角色卡
cats.forEach(cat => {
  cat.entries.forEach(entry => {
    // 檢查是否為魅魔系列
    if ((entry.sub === '魅魔系列' || entry.series === '魅魔系列') && succubusOutfits[entry.name]) {
      const custom = succubusOutfits[entry.name];

      // 組合完整服飾描述：顏色前綴 + 性感細節 + 基礎描述 + 惡魔特徵（翅膀或角）
      entry.outfit = `${custom.prefix} ${baseOutfit}, ${custom.details}, ${custom.demonFeature}`;

      updateCount++;
      const featureType = custom.demonFeature.includes('wings') ? '翅膀' : '惡魔角';
      console.log(`✓ 更新: ${entry.name}`);
      console.log(`  顏色: ${custom.prefix}`);
      console.log(`  性感元素: ${custom.details.substring(0, 50)}...`);
      console.log(`  惡魔特徵: ${featureType} - ${custom.demonFeature.substring(0, 50)}...`);
      console.log('');
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

console.log(`\n✅ 完成！共更新了 ${updateCount} 個魅魔角色卡`);
console.log('\n新設計特色：');
console.log('  ✓ 蕾絲內衣層次');
console.log('  ✓ 透明薄紗');
console.log('  ✓ 適合魅魔的翅膀（蝴蝶、蝙蝠、墮落天使、水晶）');
console.log('  ✓ 惡魔角（不帶翅膀的魅魔）');
console.log('  ✓ 約50%有翅膀，50%有惡魔角');
