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

// 基礎服飾描述
const baseOutfit = 'high-end couture gown structure, cinematic fabric weight, realistic tailoring construction, natural fabric draping, realistic transparent layering, luxury embroidery craftsmanship, realistic gold-thread details, realistic jewelry craftsmanship, realistic metal ornaments, high-end cinematic costume silhouette, natural air flow sensation, realistic fabric translucency, multi-layer garment structure';

// 為每個魅魔角色卡設計專屬顏色和配備
const succubusCustomizations = {
  '地獄降臨': {
    prefix: 'deep crimson and obsidian black',
    accessories: 'volcanic ember-inspired metallic accents, molten gold details, dark ruby jewelry, black metal ornaments with flame motifs, elegant small black bat-like demon wings positioning behind shoulders'
  },
  '深淵凝視': {
    prefix: 'midnight black and deep purple',
    accessories: 'violet luminescent accents, silver mystical patterns, amethyst jewelry, dark metal ornaments with abyss motifs, elegant small black demon wings hidden behind shoulders'
  },
  '血色召喚': {
    prefix: 'dark burgundy and black',
    accessories: 'crimson arcane accents, blood-red gold ritual patterns, ruby jewelry, ancient metal ornaments with ritual symbols, elegant small black bat wings layered behind back'
  },
  '至高王座': {
    prefix: 'obsidian black and dark silver',
    accessories: 'metallic royal accents, platinum sovereign patterns, black diamond jewelry, dark metal crown and ornaments, delicate black bat-like wings attached behind upper back'
  },
  '暗夜巡視': {
    prefix: 'midnight black and deep navy',
    accessories: 'gothic accents, silver torch-light patterns, sapphire jewelry, dark metal gothic ornaments, small dark wings placed perfectly behind shoulders'
  },
  '極致誘惑': {
    prefix: 'deep violet and black',
    accessories: 'purple-toned accents, gold candlelight patterns, dark amethyst jewelry, black metal ornaments with rose motifs, elegant small black bat-like wings subtly visible behind upper back'
  },
  '危險沉思': {
    prefix: 'dark violet and midnight blue',
    accessories: 'blue-hour accents, silver moonlight patterns, dark sapphire jewelry, metal ornaments with window motifs, small bat wings layered behind shoulders'
  },
  '盛裝出席': {
    prefix: 'refined black and golden-dark',
    accessories: 'shimmering accents, gold crystal patterns, dark diamond jewelry, black metal ornaments with chandelier motifs, small bat wings hidden behind back'
  },
  '華麗轉身': {
    prefix: 'dramatic black and silver',
    accessories: 'rim-light accents, silver smoke patterns, dark crystal jewelry, metal ornaments with staircase motifs, small bat wings aligned behind shoulders'
  },
  '禁忌領域': {
    prefix: 'avant-garde black and dark rose',
    accessories: 'thorn-pattern accents, dark gold rose patterns, black rose jewelry, dark metal ornaments with thorn motifs, small black demon wings behind upper back'
  },
  '純血始祖魅魔': {
    prefix: 'ancient crimson and obsidian black',
    accessories: 'primordial accents, blood-red gold ancient patterns, ancient ruby jewelry, primordial metal ornaments, elegant small black demon wings',
    scene: 'ancient primordial palace with blood-red moon, floating crimson mist, timeless dark architecture'
  },
  '賽博網路魅魔': {
    prefix: 'cyber black and neon purple',
    accessories: 'holographic accents, neon circuit patterns, dark crystal jewelry with LED accents, metallic cyber ornaments, elegant small black demon wings with neon accents',
    scene: 'cyberpunk underworld server room, neon purple holographic displays, floating digital particles, dark tech architecture'
  },
  '偽聖墮落魅魔': {
    prefix: 'corrupted white and black gradient',
    accessories: 'tainted holy accents, corrupted gold sacred patterns, dark pearl jewelry, fallen angel metal ornaments, elegant small black demon wings mixed with white feathers',
    scene: 'corrupted cathedral with broken stained glass, dim holy light mixing with darkness, floating corrupted particles'
  },
  '巴洛克王權魅魔': {
    prefix: 'baroque gold and deep crimson',
    accessories: 'ornate baroque accents, gold rococo patterns, baroque pearl jewelry, golden metal ornaments with royal motifs, elegant small black demon wings',
    scene: 'baroque palace throne room, golden ornate decorations, crystal chandeliers, luxurious baroque architecture'
  },
  '病嬌傀儡魅魔': {
    prefix: 'porcelain white and blood-red',
    accessories: 'puppet-string accents, silver marionette patterns, cracked porcelain jewelry, metal ornaments with puppet motifs, elegant small black demon wings',
    scene: 'dark puppet theater stage, hanging marionette strings, dim spotlight, eerie doll atmosphere'
  },
  '幽冥黃泉魅魔': {
    prefix: 'ghostly pale green and black',
    accessories: 'soul-fire accents, pale gold spirit patterns, jade jewelry, dark metal ornaments with soul motifs, elegant small black demon wings',
    scene: 'underworld river of souls, pale green ghostly mist, floating soul orbs, dark afterlife architecture'
  },
  '現代支配魅魔': {
    prefix: 'modern black and deep red',
    accessories: 'contemporary accents, metallic power patterns, black diamond jewelry, modern metal ornaments with chain motifs, elegant small black demon wings',
    scene: 'modern luxury penthouse at night, city lights below, floor-to-ceiling windows, contemporary dark elegance'
  },
  '戰裝殺戮魅魔': {
    prefix: 'armored black and blood-red',
    accessories: 'war accents, dark metal combat patterns, blood ruby jewelry, battle metal ornaments with blade motifs, elegant small black demon wings with armor plates',
    scene: 'dark battlefield with crimson sky, floating embers, scattered weapons, war-torn architecture'
  },
  '異域秘術魅魔': {
    prefix: 'exotic deep purple and gold',
    accessories: 'foreign arcane accents, gold exotic patterns, exotic gemstone jewelry, ornate metal ornaments with mystical symbols, elegant small black demon wings',
    scene: 'exotic mystical temple, floating arcane symbols, incense smoke, mysterious foreign architecture'
  },
  '深淵海妖魅魔': {
    prefix: 'deep ocean blue and black',
    accessories: 'underwater accents, pearl wave patterns, deep sea pearl jewelry, dark metal ornaments with sea motifs, elegant small black demon wings with fin-like details',
    scene: 'deep ocean abyss, bioluminescent creatures, floating underwater particles, dark aquatic atmosphere'
  }
};

let updateCount = 0;

// 遍歷所有角色卡
cats.forEach(cat => {
  cat.entries.forEach(entry => {
    // 檢查是否為魅魔系列
    if ((entry.sub === '魅魔系列' || entry.series === '魅魔系列') && succubusCustomizations[entry.name]) {
      const custom = succubusCustomizations[entry.name];

      // 組合完整服飾描述：顏色前綴 + 基礎描述 + 配備
      entry.outfit = `${custom.prefix} ${baseOutfit}, ${custom.accessories}`;

      // 如果場景為空且有自定義場景，更新場景
      if (custom.scene && (!entry.scene || entry.scene.trim() === '')) {
        entry.scene = custom.scene;
      }

      updateCount++;
      console.log(`✓ 更新: ${entry.name}`);
      console.log(`  顏色: ${custom.prefix}`);
      console.log(`  配備: ${custom.accessories.substring(0, 60)}...`);
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
console.log('\n基礎服飾描述：');
console.log(baseOutfit);
