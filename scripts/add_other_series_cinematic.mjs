import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 為其他系列添加電影級服飾與動作 ===\n');

// 已處理的關鍵字
const processedKeywords = [
  '漢', '唐', '宋', '明', '清', '古裝', '宮廷', '朝代', '仕女', '歌伎', '武俠', '仙俠', '劍仙', '俠女',
  '奇幻', '魔法', '精靈', '仙子', '神話', '龍', '鳳凰',
  '婚紗', '新娘',
  '都市', '現代', '時尚', '街頭', '賽博', '科幻',
  '魅魔', '莉莉絲', '魔王', '女王', '女巫', '魔女', '墮天使', '暗黑', '哥德', '魔界', '冥界', '火獄', '吸血鬼', '亡靈'
];

// ============================================
// 主題分類函數
// ============================================

function getThemeType(categoryName) {
  // 地標旅拍
  if (categoryName.includes('地標') || categoryName.includes('旅拍')) return 'travel';

  // 影視角色
  if (categoryName.includes('陸劇') || categoryName.includes('長相思') || categoryName.includes('小夭') ||
      categoryName.includes('青丘') || categoryName.includes('阿念') || categoryName.includes('皓翎') ||
      categoryName.includes('聶小倩') || categoryName.includes('甄嬛') || categoryName.includes('三國') ||
      categoryName.includes('紅樓') || categoryName.includes('水滸') || categoryName.includes('歷史人物')) return 'character';

  // 動漫遊戲
  if (categoryName.includes('動漫') || categoryName.includes('遊戲')) return 'anime';

  // 水下系列
  if (categoryName.includes('水下') || categoryName.includes('人魚')) return 'underwater';

  // 民族服飾
  if (categoryName.includes('民族服飾')) return 'ethnic';

  // 機械科技
  if (categoryName.includes('機械') || categoryName.includes('虛擬')) return 'tech';

  // 節日主題
  if (categoryName.includes('節日')) return 'festival';

  // 神話宗教
  if (categoryName.includes('聖女') || categoryName.includes('神女')) return 'divine';

  // 默認：通用時尚
  return 'general';
}

// ============================================
// 各主題服飾結構
// ============================================

const outfitStructures = {
  // 地標旅拍（5層）
  travel: {
    layers: [
      'elegant travel-ready dress with flowing silhouette perfect for movement',
      'lightweight breathable fabric with natural drape and wrinkle resistance',
      'subtle local cultural motifs and color palette inspired by destination',
      'practical yet stylish accessories including sunglasses and travel bag',
      'natural golden hour lighting creating authentic travel photography atmosphere'
    ]
  },

  // 影視角色（6層）
  character: {
    layers: [
      'elegant period drama costume with character-specific silhouette',
      'authentic historical fabric with rich texture appropriate to era',
      'signature character elements including iconic accessories or patterns',
      'character-defining jewelry and props that tell story',
      'character signature color palette with symbolic meaning',
      'cinematic costume quality with authentic period construction'
    ]
  },

  // 動漫遊戲（7層）
  anime: {
    layers: [
      'anime-inspired costume with character-accurate silhouette and design',
      'high-quality cosplay fabric with appropriate texture for character',
      'signature character elements including iconic symbols and patterns',
      'character-defining props and accessories including weapons or items',
      'character exact color scheme with vibrant anime-accurate palette',
      'character-specific features including hairstyle and distinctive traits',
      'cinematic cosplay photography quality with realistic yet anime-faithful aesthetic'
    ]
  },

  // 水下系列（7層）
  underwater: {
    layers: [
      'flowing underwater gown with ethereal weightless silhouette',
      'translucent lightweight fabric that moves gracefully in water',
      'delicate shell and pearl embellishments with ocean-inspired patterns',
      'coral and seaweed-inspired accessories with aquatic theme',
      'oceanic blue-green gradient with pearl shimmer highlights',
      'elegant mermaid tail with iridescent scales (if applicable)',
      'realistic underwater lighting with bubbles and light rays filtering through water'
    ]
  },

  // 民族服飾（6層）
  ethnic: {
    layers: [
      'traditional ethnic costume with authentic cultural silhouette',
      'handwoven traditional fabric with characteristic texture and pattern',
      'intricate traditional embroidery and cultural symbols',
      'authentic ethnic jewelry and traditional headdress',
      'traditional color palette with cultural significance',
      'cinematic lighting creating authentic cultural atmosphere'
    ]
  },

  // 機械科技（6層）
  tech: {
    layers: [
      'futuristic mechanical outfit with sleek technological silhouette',
      'high-tech materials including metallic panels and LED-integrated fabric',
      'intricate circuit patterns and mechanical design elements',
      'cybernetic accessories and technological props',
      'metallic color scheme with neon accent lighting',
      'cinematic sci-fi quality with realistic mechanical construction'
    ]
  },

  // 節日主題（5層）
  festival: {
    layers: [
      'festive celebration dress with holiday-themed elegant silhouette',
      'luxurious celebratory fabric with festive sheen and texture',
      'holiday-specific decorative elements and seasonal motifs',
      'festive accessories including seasonal jewelry and props',
      'cinematic holiday lighting creating authentic celebration atmosphere'
    ]
  },

  // 神話宗教（6層）
  divine: {
    layers: [
      'sacred ceremonial gown with divine elegant silhouette',
      'flowing ethereal fabric with heavenly sheen and lightness',
      'intricate religious symbols and sacred decorative patterns',
      'holy accessories including ceremonial jewelry and divine props',
      'pure celestial color palette with golden divine accents',
      'cinematic sacred lighting creating authentic spiritual atmosphere'
    ]
  },

  // 通用時尚（5層）
  general: {
    layers: [
      'elegant fashion dress with contemporary sophisticated silhouette',
      'high-quality modern fabric with refined texture and natural drape',
      'stylish design details with current fashion trends',
      'contemporary accessories with elegant modern aesthetic',
      'cinematic fashion photography lighting with professional quality'
    ]
  }
};

// ============================================
// 各主題動作模板
// ============================================

const actionTemplates = {
  travel: [
    'standing naturally at landmark location, face fully visible, one hand shading eyes or adjusting sunglasses, relaxed joyful expression, casual travel posture, fabric moving in natural breeze, cinematic travel shot, 50mm lens, natural golden hour lighting, shallow depth of field, authentic travel photography atmosphere',

    'walking casually through destination, face fully visible throughout, natural exploring movement, happy curious expression, relaxed travel stride, fabric flowing naturally, cinematic tracking shot, 50mm lens, soft natural lighting, authentic travel adventure aesthetic',

    'sitting on landmark structure naturally, face fully visible, hands resting casually, serene content expression, relaxed travel posture, fabric draping naturally, cinematic medium shot, 50mm lens, natural outdoor lighting, authentic travel moment atmosphere'
  ],

  character: [
    'standing in character-appropriate pose, face fully visible, hands positioned as character would naturally, character-specific expression, authentic character posture, costume details visible, cinematic character portrait, 50mm lens, period-appropriate lighting, authentic character atmosphere',

    'performing signature character gesture, face fully visible throughout, natural character movement, character-defining expression, authentic character stance, costume moving naturally, cinematic medium shot, 50mm lens, dramatic period lighting, authentic character aesthetic',

    'sitting in character-typical position, face fully visible, hands holding character prop naturally, character-appropriate expression, authentic character composure, costume arranged beautifully, cinematic portrait, 50mm lens, soft period lighting, authentic character atmosphere'
  ],

  anime: [
    'standing in anime-inspired pose, face fully visible, hands positioned in character-accurate gesture, character-specific expression, dynamic anime posture, costume details sharp, cinematic cosplay shot, 50mm lens, vibrant anime-style lighting, authentic cosplay photography aesthetic',

    'performing character signature move, face fully visible throughout, dynamic anime movement, character-defining expression, energetic anime stance, costume flowing dramatically, cinematic action shot, 50mm lens, dramatic anime lighting, authentic character aesthetic',

    'sitting in character-typical pose, face fully visible, hands holding character prop, character-appropriate expression, authentic anime posture, costume styled perfectly, cinematic portrait, 50mm lens, soft anime lighting, authentic cosplay atmosphere'
  ],

  underwater: [
    'floating gracefully underwater, face fully visible, arms extended naturally as if swimming, serene peaceful expression, weightless elegant posture, fabric and hair flowing in water, cinematic underwater shot, 50mm lens, soft filtered underwater lighting with bubbles, authentic underwater photography aesthetic',

    'swimming slowly through water, face fully visible throughout, natural underwater movement, calm mystical expression, graceful aquatic motion, fabric billowing beautifully, cinematic tracking shot, 50mm lens, soft blue-green underwater lighting, authentic underwater atmosphere',

    'resting on underwater surface, face fully visible, hands touching coral or shells naturally, serene otherworldly expression, elegant underwater posture, fabric floating around, cinematic medium shot, 50mm lens, soft underwater lighting with light rays, authentic aquatic aesthetic'
  ],

  ethnic: [
    'standing in traditional cultural pose, face fully visible, hands positioned in cultural gesture, serene dignified expression, authentic traditional posture, ethnic costume details visible, cinematic cultural portrait, 50mm lens, natural cultural lighting, authentic ethnic atmosphere',

    'performing traditional cultural movement, face fully visible throughout, graceful cultural motion, respectful expression, authentic traditional stance, costume moving naturally, cinematic medium shot, 50mm lens, soft cultural lighting, authentic ethnic aesthetic',

    'sitting in traditional manner, face fully visible, hands resting in cultural position, calm dignified expression, authentic traditional composure, costume arranged traditionally, cinematic portrait, 50mm lens, natural lighting, authentic cultural atmosphere'
  ],

  tech: [
    'standing in futuristic pose, face fully visible, one hand interacting with holographic interface, confident tech expression, strong cyberpunk posture, LED lights glowing, cinematic sci-fi shot, 50mm lens, neon lighting with tech glow, authentic cyberpunk atmosphere',

    'walking through tech environment, face fully visible throughout, confident futuristic movement, determined expression, strong tech stride, mechanical elements moving, cinematic tracking shot, 50mm lens, dramatic neon lighting, authentic sci-fi aesthetic',

    'sitting in tech chair, face fully visible, hands on armrests naturally, calm powerful expression, strong futuristic posture, tech elements glowing, cinematic portrait, 50mm lens, dramatic tech lighting, authentic cyberpunk atmosphere'
  ],

  festival: [
    'standing in festive celebration pose, face fully visible, hands holding seasonal prop naturally, joyful radiant expression, elegant festive posture, holiday decorations visible, cinematic celebration shot, 50mm lens, warm festive lighting, authentic holiday atmosphere',

    'dancing or celebrating naturally, face fully visible throughout, joyful festive movement, happy expression, graceful celebration motion, festive elements moving, cinematic medium shot, 50mm lens, warm holiday lighting, authentic celebration aesthetic',

    'sitting in festive setting, face fully visible, hands with holiday item, serene happy expression, elegant festive posture, decorations arranged beautifully, cinematic portrait, 50mm lens, soft festive lighting, authentic holiday atmosphere'
  ],

  divine: [
    'standing in sacred ceremonial pose, face fully visible, hands positioned in prayer or blessing gesture, serene divine expression, graceful spiritual posture, sacred elements visible, cinematic sacred portrait, 50mm lens, soft heavenly lighting, authentic spiritual atmosphere',

    'performing sacred ritual movement, face fully visible throughout, graceful divine motion, peaceful expression, elegant spiritual stance, ceremonial elements flowing, cinematic medium shot, 50mm lens, soft golden lighting, authentic sacred aesthetic',

    'kneeling in prayer position, face fully visible, hands clasped naturally, serene blessed expression, humble spiritual posture, sacred costume arranged, cinematic portrait, 50mm lens, soft divine lighting, authentic spiritual atmosphere'
  ],

  general: [
    'standing confidently in modern pose, face fully visible, one hand on hip naturally, self-assured expression, strong contemporary posture, fabric draping elegantly, cinematic fashion shot, 50mm lens, professional lighting, shallow depth of field, authentic fashion photography aesthetic',

    'walking with contemporary confidence, face fully visible throughout, natural modern movement, calm stylish expression, elegant stride, fabric moving naturally, cinematic tracking shot, 50mm lens, natural lighting, authentic modern fashion atmosphere',

    'sitting elegantly in modern pose, face fully visible, legs crossed naturally, sophisticated expression, refined contemporary posture, outfit styled perfectly, cinematic medium shot, 50mm lens, studio lighting, authentic fashion editorial aesthetic'
  ]
};

// ============================================
// 生成服飾函數
// ============================================

function generateOutfit(categoryName, index) {
  const theme = getThemeType(categoryName);
  const structure = outfitStructures[theme];

  // 將所有層組合成完整服飾
  return structure.layers.join(', ');
}

// ============================================
// 生成動作函數
// ============================================

function generateAction(categoryName, index) {
  const theme = getThemeType(categoryName);
  const templates = actionTemplates[theme];

  return templates[index % templates.length];
}

// ============================================
// 主處理邏輯
// ============================================

let processedCount = 0;
let outfitCount = 0;
let actionCount = 0;
let categoryIndex = {};

cats.forEach(cat => {
  if (!cat.name || !cat.entries) return;

  // 檢查是否已處理
  const isProcessed = processedKeywords.some(k => cat.name.includes(k));
  if (isProcessed) return;

  // 初始化分類索引
  if (!categoryIndex[cat.name]) {
    categoryIndex[cat.name] = 0;
  }

  cat.entries.forEach(entry => {
    const hasOutfit = entry.outfit && entry.outfit.trim() !== '';
    const hasAction = entry.action && entry.action.trim() !== '';

    // 檢查服飾質量（層數）
    const outfitLayers = hasOutfit ? entry.outfit.split(',').length : 0;
    const needsOutfitUpgrade = !hasOutfit || outfitLayers < 4;

    // 升級服飾（如果缺失或太簡單）
    if (needsOutfitUpgrade) {
      entry.outfit = generateOutfit(cat.name, categoryIndex[cat.name]);
      outfitCount++;
    }

    // 添加動作
    if (!hasAction) {
      entry.action = generateAction(cat.name, categoryIndex[cat.name]);
      actionCount++;
    }

    if (needsOutfitUpgrade || !hasAction) {
      processedCount++;
    }

    categoryIndex[cat.name]++;
  });
});

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！`);
console.log(`   添加服飾: ${outfitCount} 個角色卡`);
console.log(`   添加動作: ${actionCount} 個角色卡`);
console.log(`   總計處理: ${processedCount} 個角色卡`);
