import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 升級所有場景至電影級空間層次 ===\n');

// ============================================
// 電影級場景元素庫
// ============================================

// 前景元素（Foreground）- 製造空間感和鏡頭感
const foregroundElements = {
  // 暗黑奇幻
  dark: [
    'foreground drifting black feathers and soft floating dark particles',
    'foreground wisps of dark smoke and floating embers',
    'foreground falling ash particles and drifting shadows',
    'foreground floating dark petals and atmospheric particles',
    'foreground soft bokeh lights and drifting mist'
  ],

  // 古裝宮廷
  palace: [
    'foreground soft silk curtain edge and floating incense smoke',
    'foreground drifting flower petals and soft atmospheric haze',
    'foreground gentle fabric movement and floating dust particles in sunlight',
    'foreground soft candlelight glow and drifting smoke wisps',
    'foreground falling cherry blossoms and soft bokeh'
  ],

  // 神話仙俠
  myth: [
    'foreground floating celestial particles and soft divine light rays',
    'foreground drifting immortal mist and glowing spiritual energy',
    'foreground soft cloud wisps and floating magical particles',
    'foreground gentle divine glow and drifting sacred petals',
    'foreground floating starlight and soft ethereal haze'
  ],

  // 自然戶外
  nature: [
    'foreground soft bokeh from leaves and natural light filtering',
    'foreground drifting mist and atmospheric depth particles',
    'foreground gentle breeze moving grass and floating seeds',
    'foreground soft rain drops and atmospheric moisture',
    'foreground natural depth blur and environmental particles'
  ],

  // 現代都市
  urban: [
    'foreground soft city lights bokeh and atmospheric haze',
    'foreground drifting urban particles and soft depth blur',
    'foreground gentle lens flare and modern atmospheric effects',
    'foreground soft neon glow and floating city dust',
    'foreground natural street depth and soft focus elements'
  ],

  // 水下
  underwater: [
    'foreground floating bubbles and soft water particles',
    'foreground drifting seaweed strands and gentle water movement',
    'foreground soft underwater light rays and floating plankton',
    'foreground gentle water distortion and floating particles',
    'foreground soft aquatic depth and drifting marine particles'
  ]
};

// 遠景元素（Background）- 建立世界觀和史詩感
const backgroundElements = {
  dark: [
    'massive ruined gothic cathedral fading into atmospheric darkness in distant background',
    'epic dark fantasy castle silhouette against stormy sky in far background',
    'ancient demonic architecture disappearing into volumetric fog in background',
    'colossal dark throne room extending into shadowy depths in background',
    'vast underworld landscape fading into atmospheric haze in distant background'
  ],

  palace: [
    'grand imperial palace architecture extending into atmospheric depth in background',
    'majestic palace halls fading into soft golden haze in distant background',
    'vast palace gardens and pavilions disappearing into misty distance in background',
    'towering palace pillars and courtyards extending into depth in background',
    'imperial city rooftops fading into atmospheric perspective in far background'
  ],

  myth: [
    'massive celestial palace floating in clouds in distant background',
    'epic heavenly mountains rising into divine mist in far background',
    'vast immortal realm architecture fading into ethereal haze in background',
    'colossal sacred temples disappearing into celestial clouds in background',
    'infinite divine landscape extending into atmospheric depth in background'
  ],

  nature: [
    'distant mountains fading into atmospheric haze in far background',
    'vast forest landscape disappearing into misty depth in background',
    'rolling hills extending into natural atmospheric perspective in background',
    'distant waterfalls and cliffs fading into environmental haze in background',
    'expansive natural vista disappearing into soft atmospheric depth in background'
  ],

  urban: [
    'towering city skyline fading into atmospheric haze in distant background',
    'vast urban landscape disappearing into depth in far background',
    'massive skyscrapers extending into atmospheric perspective in background',
    'sprawling cityscape fading into environmental haze in background',
    'distant city lights and buildings disappearing into depth in background'
  ],

  underwater: [
    'vast underwater abyss fading into deep blue darkness in background',
    'distant coral reefs disappearing into aquatic haze in far background',
    'massive underwater ruins extending into murky depth in background',
    'endless ocean floor fading into atmospheric water in background',
    'distant underwater landscape disappearing into blue depth in background'
  ]
};

// 深度和氛圍元素
const depthAtmosphere = [
  'volumetric atmospheric lighting creating strong depth separation',
  'cinematic depth of field with natural focus falloff',
  'atmospheric perspective with realistic distance haze',
  'strong spatial depth through layered composition',
  'natural environmental depth with volumetric effects',
  'cinematic three-dimensional space with clear foreground-midground-background separation'
];

// ============================================
// 場景類型判斷
// ============================================

function getSceneType(scene, categoryName) {
  const sceneLower = scene.toLowerCase();
  const catLower = (categoryName || '').toLowerCase();

  // 暗黑奇幻
  if (catLower.includes('暗黑') || catLower.includes('魔') || catLower.includes('哥德') ||
      sceneLower.includes('dark') || sceneLower.includes('gothic') || sceneLower.includes('demon')) {
    return 'dark';
  }

  // 古裝宮廷
  if (catLower.includes('代') || catLower.includes('宮') || catLower.includes('古裝') ||
      sceneLower.includes('palace') || sceneLower.includes('imperial') || sceneLower.includes('dynasty')) {
    return 'palace';
  }

  // 神話仙俠
  if (catLower.includes('神話') || catLower.includes('仙') || catLower.includes('飛天') ||
      sceneLower.includes('celestial') || sceneLower.includes('divine') || sceneLower.includes('immortal')) {
    return 'myth';
  }

  // 水下
  if (catLower.includes('水下') || catLower.includes('人魚') ||
      sceneLower.includes('underwater') || sceneLower.includes('ocean') || sceneLower.includes('sea')) {
    return 'underwater';
  }

  // 現代都市
  if (catLower.includes('都市') || catLower.includes('現代') || catLower.includes('賽博') ||
      sceneLower.includes('urban') || sceneLower.includes('city') || sceneLower.includes('cyber')) {
    return 'urban';
  }

  // 自然戶外
  if (sceneLower.includes('forest') || sceneLower.includes('mountain') || sceneLower.includes('garden') ||
      sceneLower.includes('outdoor') || sceneLower.includes('nature')) {
    return 'nature';
  }

  // 默認：根據內容判斷
  if (sceneLower.includes('throne') || sceneLower.includes('hall')) return 'palace';
  if (sceneLower.includes('heaven') || sceneLower.includes('sky')) return 'myth';

  return 'nature'; // 默認自然場景
}

// ============================================
// 升級場景函數
// ============================================

function upgradeSceneToCinematic(originalScene, categoryName, index) {
  // 判斷場景類型
  const sceneType = getSceneType(originalScene, categoryName);

  // 選擇對應的前景和遠景元素
  const foreground = foregroundElements[sceneType][index % foregroundElements[sceneType].length];
  const background = backgroundElements[sceneType][index % backgroundElements[sceneType].length];
  const depth = depthAtmosphere[index % depthAtmosphere.length];

  // 保留原場景作為中景描述，但簡化
  let midground = originalScene;

  // 如果原場景太長，截取關鍵部分
  if (midground.length > 150) {
    midground = midground.substring(0, 150) + '...';
  }

  // 組合成電影級三層結構
  return `${foreground}, midground ${midground}, ${background}, ${depth}`;
}

// ============================================
// 處理所有場景
// ============================================

let upgradedCount = 0;
let categoryIndex = {};

cats.forEach(cat => {
  if (!cat.name || !cat.entries) return;

  // 初始化分類索引
  if (!categoryIndex[cat.name]) {
    categoryIndex[cat.name] = 0;
  }

  cat.entries.forEach(entry => {
    if (entry.scene && entry.scene.trim() !== '') {
      // 檢查是否已經有電影級結構
      const hasStructure = entry.scene.toLowerCase().includes('foreground') &&
                          entry.scene.toLowerCase().includes('background');

      if (!hasStructure) {
        // 升級場景
        entry.scene = upgradeSceneToCinematic(entry.scene, cat.name, categoryIndex[cat.name]);
        upgradedCount++;
      }

      categoryIndex[cat.name]++;
    }
  });
});

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！升級了 ${upgradedCount} 個場景`);
console.log(`\n升級內容：`);
console.log(`  ✅ 添加前景層（Foreground）- 製造空間感和鏡頭感`);
console.log(`  ✅ 保留中景層（Midground）- 原場景描述`);
console.log(`  ✅ 添加遠景層（Background）- 建立世界觀和史詩感`);
console.log(`  ✅ 添加深度氛圍 - 體積光、景深、空間分離`);
console.log(`\n電影級場景結構：`);
console.log(`  前景 → 中景 → 遠景 → 深度`);
console.log(`  Foreground → Midground → Background → Depth`);
