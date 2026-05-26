import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 為古裝系列添加中國古典電影級服飾與動作 ===\n');

// 古裝關鍵字
const ancientKeywords = ['漢', '唐', '宋', '明', '清', '古裝', '宮廷', '朝代', '仕女', '歌伎', '武俠', '仙俠', '劍仙', '俠女'];

// 中國古典電影級服飾6層結構
const ancientOutfitStructure = {
  // 1. 朝代輪廓
  silhouettes: {
    '漢': ['flowing Han dynasty curved-train robe', 'elegant Han style cross-collar layered gown', 'traditional Han dynasty wide-sleeve ceremonial dress'],
    '唐': ['luxurious Tang dynasty high-waist flowing dress', 'elegant Tang style chest-high ruqun ensemble', 'ornate Tang dynasty palace ceremonial gown'],
    '宋': ['refined Song dynasty minimalist layered robe', 'elegant Song style narrow-sleeve dress', 'sophisticated Song dynasty scholar gown'],
    '明': ['structured Ming dynasty horse-face skirt ensemble', 'elegant Ming style embroidered jacket and skirt', 'ornate Ming dynasty court ceremonial dress'],
    '清': ['elegant Qing dynasty flag gown qipao', 'refined Qing style Manchu robe', 'ornate Qing dynasty palace formal dress'],
    '武俠': ['flowing martial arts robe with wide sleeves', 'elegant warrior scholar gown', 'traditional swordsman layered dress'],
    '仙俠': ['ethereal immortal cultivator flowing robe', 'elegant celestial sect ceremonial dress', 'mystical cultivation master gown'],
    'default': ['elegant traditional Chinese layered robe', 'refined classical hanfu dress', 'sophisticated period costume gown']
  },

  // 2. 布料質感
  fabrics: [
    'flowing silk fabric with natural draping weight',
    'layered translucent gauze with subtle transparency',
    'heavy brocade with realistic texture and sheen',
    'delicate embroidered satin with fine craftsmanship',
    'natural linen with authentic period texture',
    'luxurious damask with intricate woven patterns'
  ],

  // 3. 刺繡工藝
  embroidery: [
    'intricate hand-embroidered floral patterns',
    'traditional cloud and dragon motifs',
    'delicate phoenix and peony embroidery',
    'fine gold-thread decorative borders',
    'authentic period embroidery techniques',
    'subtle geometric pattern details'
  ],

  // 4. 配飾細節
  accessories: [
    'elegant jade pendant jewelry',
    'traditional hairpin and ornaments',
    'delicate pearl decorations',
    'authentic period belt and sash',
    'refined metal accessories',
    'traditional embroidered shoes'
  ],

  // 5. 色彩搭配
  colors: [
    'elegant celadon green and ivory white',
    'refined vermilion red and gold accents',
    'sophisticated ink blue and silver',
    'luxurious plum purple and jade green',
    'traditional indigo and cream tones',
    'imperial yellow and crimson combination'
  ],

  // 6. 電影級質感
  realism: [
    'realistic fabric weight and natural draping',
    'authentic period costume construction',
    'natural fabric movement with air flow',
    'historically accurate tailoring details',
    'cinematic lighting on traditional textiles',
    'natural wear and aging for period authenticity'
  ]
};

// 古裝電影級動作鏡頭語言（參考《滿江紅》《影》）
const ancientActionTemplates = [
  // 站立系列
  'standing gracefully in traditional posture, face fully visible, hands naturally positioned in classical gesture, subtle breathing motion, elegant composure, natural fabric draping, cinematic medium shot, 50mm lens, soft natural lighting, shallow depth of field, authentic period atmosphere',

  'standing with one hand gently holding sleeve edge, face fully visible toward camera, calm serene expression, natural relaxed posture, hair ornaments visible, fabric moving softly, cinematic portrait, 50mm photography, soft side lighting, historical film aesthetic',

  // 行走系列
  'walking slowly with graceful traditional gait, face fully visible, long sleeves flowing naturally, subtle hand movement, elegant posture, natural fabric motion, cinematic tracking shot, 50mm lens, soft diffused lighting, shallow focus, period drama atmosphere',

  'walking through traditional corridor, face fully visible throughout, one hand lightly touching wooden pillar, natural elegant movement, fabric layers moving softly, cinematic composition, 50mm photography, natural window lighting, authentic historical setting',

  // 坐姿系列
  'sitting elegantly in traditional kneeling posture, face fully visible, hands resting gracefully on lap, calm dignified expression, natural fabric arrangement, low-angle cinematic shot, 50mm lens, soft ambient lighting, shallow depth of field, classical Chinese aesthetic',

  'sitting by traditional window, face fully visible in natural light, one hand holding tea cup naturally, serene expression, elegant posture, fabric draping naturally, cinematic medium shot, 50mm photography, soft window lighting, period film atmosphere',

  // 轉身系列
  'slowly turning to face camera, face becoming fully visible, long sleeves flowing with motion, hair ornaments catching light, graceful natural movement, cinematic reveal shot, 50mm lens, soft dramatic lighting, shallow focus, classical film aesthetic',

  // 低頭/抬頭系列
  'head lowered slightly in traditional modest gesture, eyes looking up toward camera, face fully visible, hands positioned naturally, elegant composure, cinematic close-up, 50mm portrait lens, soft natural lighting, shallow depth of field, period drama atmosphere',

  'slowly raising head to reveal face, face fully visible, eyes meeting camera gently, natural serene expression, hair ornaments visible, hands at sides naturally, cinematic reveal shot, 50mm lens, soft lighting transition, authentic historical aesthetic',

  // 手部動作系列
  'adjusting hair ornament with natural hand movement, face fully visible, calm focused expression, elegant finger positioning, subtle breathing motion, cinematic medium shot, 50mm lens, soft side lighting, shallow focus, classical Chinese aesthetic',

  'holding traditional fan naturally, face fully visible above, serene expression, graceful hand posture, natural fabric draping, cinematic portrait, 50mm photography, soft diffused lighting, period film atmosphere',

  // 特殊場景系列
  'standing among falling flower petals, face fully visible and stable, natural calm expression, petals moving around but not obscuring face, elegant posture, cinematic medium shot, 50mm lens, soft natural lighting, shallow depth of field, poetic Chinese aesthetic',

  'standing in traditional garden, face fully visible, one hand touching bamboo naturally, serene expression, natural elegant posture, soft fabric movement, cinematic composition, 50mm photography, natural outdoor lighting, authentic period atmosphere',

  // 靜態凝視系列
  'standing completely still with gentle gaze toward camera, face fully visible and sharp, minimal movement except subtle breathing, hands in traditional gesture, calm dignified presence, cinematic portrait, 50mm lens, soft natural lighting, shallow depth of field, classical film aesthetic'
];

function getDynasty(categoryName) {
  if (categoryName.includes('漢')) return '漢';
  if (categoryName.includes('唐')) return '唐';
  if (categoryName.includes('宋')) return '宋';
  if (categoryName.includes('明')) return '明';
  if (categoryName.includes('清')) return '清';
  if (categoryName.includes('武俠') || categoryName.includes('俠女') || categoryName.includes('劍')) return '武俠';
  if (categoryName.includes('仙俠') || categoryName.includes('仙')) return '仙俠';
  return 'default';
}

function generateAncientOutfit(categoryName, index) {
  const dynasty = getDynasty(categoryName);
  const silhouettes = ancientOutfitStructure.silhouettes[dynasty];

  return {
    silhouette: silhouettes[index % silhouettes.length],
    fabric: ancientOutfitStructure.fabrics[index % ancientOutfitStructure.fabrics.length],
    embroidery: ancientOutfitStructure.embroidery[index % ancientOutfitStructure.embroidery.length],
    accessories: ancientOutfitStructure.accessories[index % ancientOutfitStructure.accessories.length],
    colors: ancientOutfitStructure.colors[index % ancientOutfitStructure.colors.length],
    realism: ancientOutfitStructure.realism[index % ancientOutfitStructure.realism.length]
  };
}

let outfitCount = 0;
let actionCount = 0;
let outfitIndex = 0;
let actionIndex = 0;

cats.forEach(cat => {
  if (!cat.name || !cat.entries) return;

  const isAncient = ancientKeywords.some(keyword => cat.name.includes(keyword));
  if (!isAncient) return;

  cat.entries.forEach(entry => {
    // 添加服飾（如果缺失）
    const hasOutfit = entry.outfit && entry.outfit.trim() !== '';
    if (!hasOutfit) {
      const outfit = generateAncientOutfit(cat.name, outfitIndex);
      entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.embroidery}, ${outfit.accessories}, ${outfit.colors}, ${outfit.realism}`;
      outfitCount++;
      outfitIndex++;
    }

    // 添加動作（如果缺失）
    const hasAction = entry.action && entry.action.trim() !== '';
    if (!hasAction) {
      entry.action = ancientActionTemplates[actionIndex % ancientActionTemplates.length];
      actionCount++;
      actionIndex++;
    }
  });
});

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！`);
console.log(`   添加服飾: ${outfitCount} 個角色卡`);
console.log(`   添加動作: ${actionCount} 個角色卡`);
console.log(`   總計處理: ${outfitCount + actionCount} 項更新`);
