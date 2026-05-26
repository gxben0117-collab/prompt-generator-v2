import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 為奇幻、婚紗、現代系列添加電影級服飾與動作 ===\n');

// ============================================
// 奇幻系列 - 7層結構
// ============================================

const fantasyKeywords = ['奇幻', '魔法', '精靈', '仙子', '神話', '龍', '鳳凰'];

const fantasyOutfitLayers = {
  // 1. 奇幻輪廓
  silhouettes: {
    '精靈': ['elegant elven flowing gown with ethereal silhouette', 'graceful woodland elf dress with nature-inspired lines', 'mystical high elf ceremonial robe with refined elegance'],
    '仙子': ['delicate fairy dress with gossamer wings and flowing layers', 'enchanted forest fairy gown with organic flowing design', 'celestial fairy ceremonial dress with ethereal grace'],
    '魔法': ['mystical wizard robe with arcane symbols and flowing cape', 'elegant sorceress gown with magical embellishments', 'enchanted mage dress with spell-woven patterns'],
    '龍': ['fantasy dragon-scale armor dress with elegant protection', 'mystical dragon knight gown with ornate scales', 'enchanted dragon rider outfit with magical elements'],
    'default': ['elegant fantasy gown with mystical flowing silhouette', 'enchanted dress with magical design elements', 'mystical ceremonial robe with fantasy elegance']
  },

  // 2. 魔法布料
  fabrics: [
    'flowing enchanted silk with subtle magical shimmer',
    'translucent fairy gossamer with ethereal lightness',
    'mystical velvet with deep rich texture and magical sheen',
    'nature-woven fabric with organic texture and forest essence',
    'spell-infused satin with arcane glow',
    'celestial chiffon with starlight transparency'
  ],

  // 3. 魔法裝飾
  embellishments: [
    'intricate arcane symbols and spell patterns',
    'delicate nature motifs with leaves and vines',
    'mystical runes and ancient magical inscriptions',
    'enchanted crystal and gemstone decorations',
    'ethereal light-weaving patterns',
    'celestial star and moon embroidery'
  ],

  // 4. 奇幻配飾
  accessories: [
    'elegant elven circlet with natural gemstones, leaf-shaped earrings',
    'gossamer fairy wings with iridescent shimmer, flower crown',
    'mystical amulet with glowing crystals, magical ring',
    'enchanted staff accessory, arcane jewelry',
    'nature-inspired jewelry with living vines',
    'celestial accessories with starlight gems'
  ],

  // 5. 魔法色彩
  colors: [
    'ethereal silver and moonlight white',
    'mystical forest green with gold accents',
    'celestial blue with starlight shimmer',
    'enchanted purple with arcane glow',
    'nature-inspired earth tones with magical highlights',
    'iridescent colors with rainbow shimmer'
  ],

  // 6. 奇幻生物特徵
  creatureFeatures: [
    'pointed elf ears visible, ethereal grace',
    'delicate fairy presence with nature integration',
    'arcane symbols and magical aura surrounding',
    'mystical energy effects and spell glow',
    'nature-connected elements and organic features',
    'celestial grace with cosmic energy'
  ],

  // 7. 電影級魔法質感
  realism: [
    'realistic fabric movement with magical enhancement',
    'subtle magical glow and shimmer effects',
    'authentic fantasy world atmosphere',
    'natural integration of magical elements',
    'cinematic lighting creating mystical ambiance',
    'believable fantasy costume construction'
  ]
};

const fantasyActions = [
  'standing gracefully in mystical pose, face fully visible, one hand gently gesturing with magical energy, serene enchanted expression, elegant ethereal posture, fabric flowing with magical breeze, cinematic medium shot, 50mm lens, soft magical lighting, shallow depth of field, authentic fantasy atmosphere',

  'walking slowly through enchanted space, face fully visible throughout, magical elements floating around naturally, calm mystical expression, graceful flowing movement, fabric and accessories moving naturally, cinematic tracking shot, 50mm lens, soft diffused magical lighting, authentic fantasy world aesthetic',

  'sitting elegantly in fantasy setting, face fully visible, one hand touching magical prop naturally, serene otherworldly expression, refined posture, fabric draping with magical grace, cinematic medium shot, 50mm lens, soft ambient magical lighting, shallow depth of field, authentic fantasy elegance',

  'standing among magical elements, face fully visible and stable, hands positioned in mystical gesture, calm powerful expression, upright ethereal posture, magical effects surrounding but not obscuring face, cinematic portrait, 50mm lens, dramatic magical lighting, authentic fantasy atmosphere',

  'slowly turning with magical grace, face becoming fully visible, fabric and magical elements flowing with motion, enchanted expression, natural elegant movement, cinematic reveal shot, 50mm lens, soft magical lighting transition, authentic fantasy aesthetic'
];

// ============================================
// 婚紗系列 - 6層結構
// ============================================

const weddingKeywords = ['婚紗', '新娘'];

const weddingOutfitLayers = {
  // 1. 婚紗輪廓
  silhouettes: [
    'elegant A-line wedding gown with classic bridal silhouette',
    'luxurious ball gown wedding dress with dramatic volume',
    'sophisticated mermaid wedding gown with fitted elegance',
    'romantic princess wedding dress with fairytale silhouette',
    'modern minimalist wedding gown with clean lines',
    'vintage-inspired wedding dress with timeless elegance'
  ],

  // 2. 奢華布料
  fabrics: [
    'luxurious silk satin with smooth bridal sheen',
    'delicate French lace with intricate patterns',
    'flowing tulle layers with ethereal lightness',
    'rich duchess satin with structured weight',
    'romantic chiffon with soft draping movement',
    'elegant organza with crisp texture and volume'
  ],

  // 3. 精緻工藝
  craftsmanship: [
    'intricate hand-beaded embellishments with pearls and crystals',
    'delicate lace appliqués with floral patterns',
    'elegant embroidery with silver thread details',
    'luxurious crystal and rhinestone decorations',
    'romantic floral embellishments with 3D petals',
    'sophisticated sequin patterns with subtle sparkle'
  ],

  // 4. 新娘配飾
  accessories: [
    'elegant bridal veil with delicate lace trim, pearl jewelry',
    'romantic flower crown with fresh blooms, diamond earrings',
    'classic tiara with crystals, elegant necklace',
    'delicate hair accessories with pearls, bridal bracelet',
    'sophisticated headpiece with jewels, drop earrings',
    'vintage-inspired hair comb, pearl strand necklace'
  ],

  // 5. 新娘色彩
  colors: [
    'pure ivory white with pearl shimmer',
    'classic bridal white with silver accents',
    'romantic champagne with gold highlights',
    'elegant off-white with cream undertones',
    'soft blush pink with ivory base',
    'sophisticated white with platinum details'
  ],

  // 6. 電影級新娘質感
  realism: [
    'realistic fabric draping with natural bridal elegance',
    'authentic wedding gown construction and tailoring',
    'natural movement of veil and train',
    'cinematic bridal lighting creating romantic glow',
    'high-fashion wedding photography aesthetic',
    'authentic couture bridal craftsmanship'
  ]
};

const weddingActions = [
  'standing gracefully in classic bridal pose, face fully visible, hands naturally holding bouquet at waist, serene radiant expression, elegant upright posture, veil and fabric draping naturally, cinematic bridal portrait, 50mm lens, soft romantic lighting, shallow depth of field, authentic wedding photography aesthetic',

  'walking slowly down aisle with bridal grace, face fully visible throughout, one hand lightly holding dress, calm joyful expression, elegant flowing movement, train and veil moving naturally, cinematic tracking shot, 50mm lens, soft diffused natural lighting, authentic wedding atmosphere',

  'sitting elegantly in bridal pose, face fully visible, hands resting gracefully with bouquet, serene happy expression, refined posture, dress arranged beautifully, cinematic medium shot, 50mm lens, soft window lighting, shallow depth of field, high-fashion bridal aesthetic',

  'standing by window in natural light, face fully visible and glowing, one hand adjusting veil naturally, radiant peaceful expression, elegant posture, fabric catching soft light, cinematic bridal portrait, 50mm lens, natural window lighting, authentic wedding day atmosphere',

  'slowly turning to reveal dress, face becoming fully visible, veil and train flowing with motion, joyful expression, graceful natural movement, cinematic reveal shot, 50mm lens, soft romantic lighting, authentic bridal elegance'
];

// ============================================
// 現代系列 - 5層結構
// ============================================

const modernKeywords = ['都市', '現代', '時尚', '街頭', '賽博', '科幻'];

const modernOutfitLayers = {
  // 1. 時尚輪廓
  silhouettes: {
    '都市': ['sophisticated urban chic dress with modern silhouette', 'elegant city fashion outfit with contemporary lines', 'stylish metropolitan dress with refined design'],
    '賽博': ['futuristic cyberpunk outfit with tech-inspired design', 'sleek cyber fashion dress with neon accents', 'modern sci-fi ensemble with digital aesthetics'],
    '科幻': ['futuristic sci-fi suit with sleek technological design', 'advanced space-age outfit with modern elegance', 'contemporary tech fashion with innovative silhouette'],
    'default': ['modern fashion dress with contemporary elegance', 'stylish urban outfit with current trends', 'sophisticated modern ensemble with clean lines']
  },

  // 2. 現代布料
  fabrics: [
    'sleek modern fabric with contemporary texture',
    'high-tech material with futuristic sheen',
    'luxurious contemporary silk with refined drape',
    'structured modern textile with clean finish',
    'innovative fabric with technological feel',
    'sophisticated urban material with stylish texture'
  ],

  // 3. 時尚細節
  details: [
    'minimalist modern design with clean lines',
    'contemporary fashion details with current trends',
    'sleek technological accents and modern hardware',
    'sophisticated urban styling with refined touches',
    'futuristic design elements with innovative features',
    'stylish modern embellishments with subtle elegance'
  ],

  // 4. 現代配飾
  accessories: [
    'contemporary jewelry with modern design',
    'sleek tech accessories with futuristic style',
    'minimalist fashion accessories with clean aesthetic',
    'urban chic jewelry with sophisticated look',
    'modern statement pieces with current trends',
    'stylish contemporary accessories with refined elegance'
  ],

  // 5. 電影級現代質感
  realism: [
    'realistic modern fabric movement and draping',
    'authentic contemporary fashion photography aesthetic',
    'natural urban lighting and atmosphere',
    'cinematic fashion editorial styling',
    'high-fashion modern photography quality',
    'authentic current fashion trends and construction'
  ]
};

const modernActions = [
  'standing confidently in modern urban pose, face fully visible, one hand on hip naturally, self-assured expression, strong contemporary posture, fabric draping with modern elegance, cinematic fashion shot, 50mm lens, urban lighting, shallow depth of field, authentic fashion photography aesthetic',

  'walking with contemporary confidence, face fully visible throughout, natural modern movement, calm stylish expression, elegant urban stride, fabric moving naturally, cinematic tracking shot, 50mm lens, city lighting, authentic modern fashion atmosphere',

  'sitting elegantly in modern pose, face fully visible, legs crossed naturally, sophisticated expression, refined contemporary posture, outfit styled perfectly, cinematic medium shot, 50mm lens, studio lighting, high-fashion editorial aesthetic',

  'leaning casually against urban element, face fully visible, one hand in pocket naturally, relaxed confident expression, modern casual posture, fabric falling naturally, cinematic portrait, 50mm lens, natural city lighting, authentic urban fashion atmosphere',

  'standing in dynamic modern pose, face fully visible and sharp, hands positioned stylishly, strong fashion expression, contemporary model posture, cinematic fashion editorial shot, 50mm lens, dramatic lighting, authentic high-fashion aesthetic'
];

// ============================================
// 處理函數
// ============================================

function getFantasyType(categoryName) {
  if (categoryName.includes('精靈')) return '精靈';
  if (categoryName.includes('仙子')) return '仙子';
  if (categoryName.includes('魔法') || categoryName.includes('魔女') || categoryName.includes('女巫')) return '魔法';
  if (categoryName.includes('龍')) return '龍';
  return 'default';
}

function getModernType(categoryName) {
  if (categoryName.includes('賽博')) return '賽博';
  if (categoryName.includes('科幻')) return '科幻';
  if (categoryName.includes('都市')) return '都市';
  return 'default';
}

function generateFantasyOutfit(categoryName, index) {
  const type = getFantasyType(categoryName);
  const silhouettes = fantasyOutfitLayers.silhouettes[type];

  return {
    silhouette: silhouettes[index % silhouettes.length],
    fabric: fantasyOutfitLayers.fabrics[index % fantasyOutfitLayers.fabrics.length],
    embellishment: fantasyOutfitLayers.embellishments[index % fantasyOutfitLayers.embellishments.length],
    accessories: fantasyOutfitLayers.accessories[index % fantasyOutfitLayers.accessories.length],
    colors: fantasyOutfitLayers.colors[index % fantasyOutfitLayers.colors.length],
    creature: fantasyOutfitLayers.creatureFeatures[index % fantasyOutfitLayers.creatureFeatures.length],
    realism: fantasyOutfitLayers.realism[index % fantasyOutfitLayers.realism.length]
  };
}

function generateWeddingOutfit(index) {
  return {
    silhouette: weddingOutfitLayers.silhouettes[index % weddingOutfitLayers.silhouettes.length],
    fabric: weddingOutfitLayers.fabrics[index % weddingOutfitLayers.fabrics.length],
    craftsmanship: weddingOutfitLayers.craftsmanship[index % weddingOutfitLayers.craftsmanship.length],
    accessories: weddingOutfitLayers.accessories[index % weddingOutfitLayers.accessories.length],
    colors: weddingOutfitLayers.colors[index % weddingOutfitLayers.colors.length],
    realism: weddingOutfitLayers.realism[index % weddingOutfitLayers.realism.length]
  };
}

function generateModernOutfit(categoryName, index) {
  const type = getModernType(categoryName);
  const silhouettes = modernOutfitLayers.silhouettes[type];

  return {
    silhouette: silhouettes[index % silhouettes.length],
    fabric: modernOutfitLayers.fabrics[index % modernOutfitLayers.fabrics.length],
    details: modernOutfitLayers.details[index % modernOutfitLayers.details.length],
    accessories: modernOutfitLayers.accessories[index % modernOutfitLayers.accessories.length],
    realism: modernOutfitLayers.realism[index % modernOutfitLayers.realism.length]
  };
}

// ============================================
// 主處理邏輯
// ============================================

let fantasyCount = 0, weddingCount = 0, modernCount = 0;
let fantasyIndex = 0, weddingIndex = 0, modernIndex = 0;

cats.forEach(cat => {
  if (!cat.name || !cat.entries) return;

  const isFantasy = fantasyKeywords.some(k => cat.name.includes(k));
  const isWedding = weddingKeywords.some(k => cat.name.includes(k));
  const isModern = modernKeywords.some(k => cat.name.includes(k));

  cat.entries.forEach(entry => {
    // 奇幻系列
    if (isFantasy) {
      const hasOutfit = entry.outfit && entry.outfit.trim() !== '';
      const hasAction = entry.action && entry.action.trim() !== '';

      if (!hasOutfit) {
        const outfit = generateFantasyOutfit(cat.name, fantasyIndex);
        entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.embellishment}, ${outfit.accessories}, ${outfit.colors}, ${outfit.creature}, ${outfit.realism}`;
        fantasyCount++;
      }

      if (!hasAction) {
        entry.action = fantasyActions[fantasyIndex % fantasyActions.length];
        fantasyCount++;
      }

      fantasyIndex++;
    }

    // 婚紗系列
    if (isWedding) {
      const hasOutfit = entry.outfit && entry.outfit.trim() !== '';
      const hasAction = entry.action && entry.action.trim() !== '';

      if (!hasOutfit) {
        const outfit = generateWeddingOutfit(weddingIndex);
        entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.craftsmanship}, ${outfit.accessories}, ${outfit.colors}, ${outfit.realism}`;
        weddingCount++;
      }

      if (!hasAction) {
        entry.action = weddingActions[weddingIndex % weddingActions.length];
        weddingCount++;
      }

      weddingIndex++;
    }

    // 現代系列
    if (isModern) {
      const hasOutfit = entry.outfit && entry.outfit.trim() !== '';
      const hasAction = entry.action && entry.action.trim() !== '';

      if (!hasOutfit) {
        const outfit = generateModernOutfit(cat.name, modernIndex);
        entry.outfit = `${outfit.silhouette}, ${outfit.fabric}, ${outfit.details}, ${outfit.accessories}, ${outfit.realism}`;
        modernCount++;
      }

      if (!hasAction) {
        entry.action = modernActions[modernIndex % modernActions.length];
        modernCount++;
      }

      modernIndex++;
    }
  });
});

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！`);
console.log(`   奇幻系列: ${fantasyCount} 項更新`);
console.log(`   婚紗系列: ${weddingCount} 項更新`);
console.log(`   現代系列: ${modernCount} 項更新`);
console.log(`   總計: ${fantasyCount + weddingCount + modernCount} 項更新`);
