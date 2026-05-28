import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 追加中國主題角色卡 ===\n');

// ============================================
// 一、500組精緻華麗朝代古裝
// ============================================

const luxuryDynastyNames = {
  '漢代': [
    '未央宮主', '長樂宮妃', '甘泉宮姬', '建章宮女', '昭陽殿妃', '椒房殿主', '桂宮貴妃', '永巷宮女', '掖庭令妃', '少府宮姬',
    '長信宮妃', '長秋宮女', '永壽宮姬', '永安宮妃', '永寧宮女', '永昌宮姬', '永平宮妃', '永康宮女', '永福宮姬', '永樂宮妃'
  ],
  '唐代': [
    '大明宮妃', '太極宮女', '興慶宮姬', '華清宮妃', '大內宮女', '東宮妃嬪', '西宮貴妃', '南宮昭儀', '北宮淑妃', '中宮皇后',
    '含元殿妃', '麟德殿女', '紫宸殿姬', '宣政殿妃', '甘露殿女', '承香殿姬', '披香殿妃', '椒房殿女', '飛霞殿姬', '凝碧殿妃'
  ],
  '宋代': [
    '福寧殿妃', '慈寧宮女', '壽康宮姬', '永壽宮妃', '景福宮女', '延福宮姬', '集慶殿妃', '會慶殿女', '崇政殿姬', '文德殿妃',
    '垂拱殿女', '紫宸殿姬', '集英殿妃', '崇德殿女', '明德殿姬', '崇文殿妃', '資善堂女', '麗正門姬', '宣德門妃', '朱雀門女'
  ],
  '明代': [
    '乾清宮妃', '坤寧宮女', '交泰殿姬', '養心殿妃', '慈寧宮女', '壽康宮姬', '景陽宮妃', '承乾宮女', '鍾粹宮姬', '景仁宮妃',
    '永壽宮女', '翊坤宮姬', '儲秀宮妃', '啟祥宮女', '長春宮姬', '太極殿妃', '中和殿女', '保和殿姬', '文華殿妃', '武英殿女'
  ],
  '清代': [
    '儲秀宮妃', '翊坤宮女', '永壽宮姬', '景仁宮妃', '承乾宮女', '鍾粹宮姬', '景陽宮妃', '咸福宮女', '延禧宮姬', '永和宮妃',
    '體和殿女', '頤和殿姬', '養性殿妃', '樂壽堂女', '仁壽殿姬', '德和園妃', '玉瀾堂女', '宜芸館姬', '樂農軒妃', '藻鑒堂女'
  ]
};

const luxuryScenes = [
  'magnificent imperial palace hall with towering golden dragon pillars reaching ceiling, countless red silk curtains flowing, crystal chandeliers casting warm glow, marble floors reflecting candlelight, grand ceremonial atmosphere',

  'opulent palace garden with rare exotic flowers in full bloom, ancient jade pavilion surrounded by lotus pond, morning golden mist rising, peacocks wandering, imperial luxury atmosphere',

  'lavish palace chamber with hand-carved rosewood furniture inlaid with mother-of-pearl, silk embroidered wall hangings depicting imperial scenes, golden incense burners releasing fragrant smoke, soft candlelight creating intimate luxury',

  'grand imperial throne room with jade steps leading to golden dragon throne, massive red pillars with gold leaf details, silk banners hanging from high ceiling, dramatic lighting from tall windows creating majestic atmosphere',

  'luxurious palace courtyard with white marble pathways, rare flowering trees, crystal-clear lotus pond with golden koi, afternoon sunlight filtering through silk canopies, serene imperial elegance',

  'royal library with floor-to-ceiling ancient scrolls, precious sandalwood furniture, jade ornaments, soft natural light from paper windows creating scholarly luxury atmosphere',

  'palace balcony overlooking vast imperial city, golden sunset casting warm glow on red palace roofs, distant mountains, silk curtains flowing in breeze, romantic imperial vista',

  'ceremonial hall with massive bronze incense burners, countless red and gold silk banners, jade ritual vessels, solemn candlelight creating sacred imperial atmosphere',

  'imperial garden pavilion by moonlit lake, cherry blossoms in full bloom creating pink canopy, silk lanterns reflecting on water, romantic night atmosphere',

  'palace bedroom with layers of embroidered silk curtains, jade and gold ornaments everywhere, soft moonlight through carved windows, intimate luxury atmosphere'
];

// 精緻華麗服飾（8層結構 - 比原來的6層更豪華）
function generateLuxuryDynastyOutfit(dynasty, index) {
  const silhouettes = {
    '漢代': 'magnificent Han dynasty imperial ceremonial robe with elaborate curved train and multiple layered collars',
    '唐代': 'opulent Tang dynasty high-waist flowing dress with chest-high ruqun ensemble and luxurious trailing sleeves',
    '宋代': 'exquisite Song dynasty multi-layered ceremonial robe with intricate narrow sleeves and elegant draping',
    '明代': 'lavish Ming dynasty horse-face skirt ensemble with heavily embroidered jacket and ceremonial accessories',
    '清代': 'sumptuous Qing dynasty imperial flag gown with elaborate Manchu styling and luxurious embellishments'
  };

  const fabrics = [
    'finest imperial silk with natural lustrous sheen and heavy luxurious draping weight',
    'multiple layers of translucent gauze with subtle iridescent shimmer and ethereal lightness',
    'premium brocade with raised embroidered patterns and rich three-dimensional texture',
    'delicate satin with mirror-smooth finish and fluid elegant movement',
    'rare tribute silk with subtle pattern weave and authentic imperial quality'
  ];

  const embroidery = [
    'elaborate hand-embroidered imperial dragon and phoenix patterns with real gold thread covering entire garment',
    'intricate cloud and wave motifs with precious gemstone inlays and traditional symbolism',
    'exquisite peony and lotus embroidery with fine silk thread in multiple colors creating realistic depth',
    'complex geometric patterns with auspicious symbols bordered by gold and silver thread',
    'detailed nature scenes embroidered with incredible craftsmanship showing birds, flowers, and landscapes'
  ];

  const metalwork = [
    'ornate gold filigree decorative panels with precious stone inlays on collar and cuffs',
    'delicate silver chain details connecting jade ornaments across bodice',
    'elaborate golden clasps and buttons shaped like dragons and phoenixes',
    'intricate metal embellishments with cloisonné enamel work in traditional patterns'
  ];

  const accessories = [
    'magnificent phoenix crown with hundreds of pearls and precious stones, elaborate jade pendant necklace, golden earrings with pearl drops, embroidered silk shoes with gold thread',
    'ornate golden hairpin with dangling jade ornaments, multi-strand pearl necklace, jade bracelet with gold accents, ceremonial belt with gemstones',
    'elaborate hair ornaments with kingfisher feathers and pearls, jade pendant on gold chain, golden arm bands, embroidered accessories',
    'imperial tiara with rubies and sapphires, jade earrings with gold settings, pearl bracelets, golden ankle ornaments'
  ];

  const colors = [
    'imperial bright vermilion red with gold embroidery, jade green accents, and pearl white highlights',
    'royal deep purple with silver thread patterns, sapphire blue details, and golden borders',
    'elegant celadon green with ivory white layers, gold embroidery, and coral pink accents',
    'luxurious plum purple with gold and silver thread, jade green highlights, and pearl decorations'
  ];

  const jewelry = [
    'elaborate jade pendant carved with imperial symbols, multi-strand pearl necklace, golden hairpins with gemstones, jade bracelets',
    'precious ruby and sapphire jewelry set, golden earrings with pearl drops, jade rings, ornate belt decorations',
    'imperial jade seal pendant, kingfisher feather hair ornaments, pearl and gold jewelry, ceremonial accessories',
    'rare gemstone collection including jade, pearls, rubies, sapphires, all set in gold with intricate craftsmanship'
  ];

  const luxuryDetails = [
    'countless tiny pearls hand-sewn onto fabric creating shimmering effect, real gold leaf applied to embroidery, precious gemstones strategically placed',
    'multiple layers of different fabrics creating depth and movement, each layer with its own embroidery and decoration',
    'hand-painted details on silk using natural pigments, gold dust mixed into paint for luminous effect',
    'three-dimensional embroidery creating raised patterns, padded areas for sculptural effect, weighted hems for perfect draping'
  ];

  const realism = [
    'realistic heavy fabric weight with natural luxurious draping, authentic imperial costume construction with multiple underlayers',
    'cinematic palace lighting reflecting off gold embroidery and gemstones creating magnificent glow',
    'natural fabric movement showing weight and quality, historically accurate imperial tailoring with perfect fit',
    'authentic period drama quality with museum-level attention to detail and craftsmanship'
  ];

  return `${silhouettes[dynasty]}, ${fabrics[index % fabrics.length]}, ${embroidery[index % embroidery.length]}, ${metalwork[index % metalwork.length]}, ${accessories[index % accessories.length]}, ${colors[index % colors.length]}, ${jewelry[index % jewelry.length]}, ${luxuryDetails[index % luxuryDetails.length]}, ${realism[index % realism.length]}`;
}

const luxuryActions = [
  'standing in regal imperial posture, face fully visible, hands positioned in ceremonial gesture holding jade tablet, dignified majestic expression, perfectly upright empress posture, heavy ceremonial robes remaining structured and still, cinematic low-angle shot emphasizing grandeur, 50mm lens, dramatic palace lighting with golden glow, shallow depth of field, authentic imperial court ceremony atmosphere',

  'sitting on ornate throne in formal imperial position, face fully visible, hands resting on armrests naturally, calm powerful expression, perfect royal composure, luxurious robes arranged magnificently, cinematic medium shot, 50mm lens, dramatic lighting from above creating divine glow, authentic imperial majesty atmosphere',

  'walking slowly through palace hall with imperial grace, face fully visible throughout, long trailing robes flowing behind naturally, serene dignified expression, majestic movement, attendants holding train, cinematic tracking shot, 50mm lens, soft palace lighting, authentic imperial procession atmosphere',

  'standing by palace window in natural light, face fully visible and glowing, one hand adjusting elaborate hair ornament, calm noble expression, elegant imperial posture, luxurious fabric catching soft light, cinematic portrait, 50mm lens, natural window lighting creating soft glow, authentic palace atmosphere',

  'performing ceremonial gesture with jade ritual vessel, face fully visible, concentrated noble expression, graceful imperial movement, heavy robes moving naturally, cinematic medium shot, 50mm lens, dramatic ceremonial lighting, authentic imperial ritual atmosphere'
];

// ============================================
// 二、長相思補充（35組）
// ============================================

const changxiangsiNames = [
  '塗山璟', '塗山氏族女', '軒轅族姬', '神農族女', '高辛族姬', '青丘九尾', '玉山仙子', '清水鎮女', '五神山姬', '回玉山女',
  '神農山姬', '軒轅山女', '高辛山姬', '青丘山女', '玉山仙姬', '清水仙女', '五神仙姬', '回玉仙女', '神農仙姬', '軒轅仙女',
  '高辛仙姬', '青丘仙女', '玉山神女', '清水神姬', '五神神女', '回玉神姬', '神農神女', '軒轅神姬', '高辛神女', '青丘神姬',
  '玉山聖女', '清水聖姬', '五神聖女', '回玉聖姬', '神農聖女'
];

const changxiangsiScenes = [
  'ancient mythological palace floating in clouds, red silk curtains flowing in divine wind, golden light filtering through, celestial atmosphere with floating petals',
  'sacred mountain peak above sea of clouds, ancient trees with glowing leaves, mystical fog, divine radiance creating ethereal atmosphere',
  'jade pool in celestial realm, crystal clear water reflecting moonlight, lotus flowers glowing, magical butterflies dancing',
  'divine garden with immortal peach trees, red silk ribbons hanging from branches, golden fruits glowing, mystical atmosphere',
  'ancient cultivation sect hall, red ceremonial banners, jade pillars, soft divine lighting creating sacred atmosphere'
];

const changxiangsiOutfit = (index) => {
  const base = [
    'elegant ancient Chinese mythological dress with flowing red and white silk layers',
    'luxurious cultivation sect ceremonial robe with intricate embroidery and flowing sleeves',
    'exquisite immortal realm gown with translucent outer layer and rich inner robes',
    'magnificent deity costume with elaborate gold embroidery and jade ornaments'
  ];

  return `${base[index % base.length]}, flowing silk fabric with subtle divine shimmer and natural draping, intricate hand-embroidered mythological patterns with gold and silver thread, elegant jade jewelry with red tassels, divine hair ornaments with pearls, traditional color palette of red, white, and gold with jade green accents, realistic fabric movement with ethereal grace, cinematic mythological drama quality with authentic ancient Chinese aesthetic`;
};

const changxiangsiAction = [
  'standing gracefully in ancient mythological pose, face fully visible, hands positioned in elegant gesture, serene divine expression, ethereal posture, red silk flowing naturally, cinematic medium shot, 50mm lens, soft divine lighting, shallow depth of field, authentic mythological atmosphere',

  'walking slowly through celestial realm, face fully visible throughout, long sleeves and red silk flowing with movement, calm immortal expression, graceful divine motion, cinematic tracking shot, 50mm lens, soft golden lighting, authentic ancient mythology aesthetic',

  'sitting in meditation position on jade platform, face fully visible, hands in cultivation seal, peaceful expression, refined posture, fabric draping naturally, cinematic portrait, 50mm lens, soft sacred lighting, authentic cultivation atmosphere'
];

// ============================================
// 三、大唐飛天補充（40組）- 參考敦煌壁畫
// ============================================

const feitianNames = [
  '敦煌飛天', '莫高窟仙女', '千佛洞飛天', '西域飛天', '絲路飛天', '大唐飛仙', '天宮飛舞', '雲端飛天', '赤霞飛天', '金光飛天',
  '彩雲飛天', '瑞雪飛天', '春風飛天', '夏雨飛天', '秋月飛天', '冬雪飛天', '朝霞飛天', '晚霞飛天', '星辰飛天', '月光飛天',
  '日光飛天', '虹光飛天', '霞光飛天', '佛光飛天', '神光飛天', '仙光飛天', '靈光飛天', '寶光飛天', '瑞光飛天', '祥光飛天',
  '紫霞飛天', '青霞飛天', '碧霞飛天', '赤霞飛天', '金霞飛天', '銀霞飛天', '彩霞飛天', '瑞霞飛天', '祥霞飛天', '福霞飛天'
];

const feitianScenes = [
  'magnificent Tang dynasty celestial palace hall, countless red silk ribbons flowing from ceiling to floor creating waterfall effect, golden Buddha statues, incense smoke rising, divine atmosphere with floating lotus petals and golden light',

  'vast sky realm with endless clouds below, massive red silk ribbons flowing through air like rivers, golden sunset creating dramatic backlight, divine wind making ribbons dance, epic celestial atmosphere',

  'grand Buddhist temple interior, towering pillars wrapped in red silk, hundreds of red ribbons hanging from ceiling creating forest effect, golden candlelight, sacred atmosphere with floating flower petals',

  'heavenly palace courtyard, giant red silk curtains billowing in divine wind, golden architecture, lotus pond reflecting red ribbons, sunset golden hour creating warm glow, majestic atmosphere',

  'celestial celebration hall, thousands of red silk ribbons flowing in all directions, golden decorations everywhere, divine light beams cutting through, festive sacred atmosphere with floating lanterns'
];

// 大唐飛天服飾（參考敦煌壁畫 - 重點是紅色飄帶的氣勢）
const feitianOutfit = (index) => {
  const bases = [
    'magnificent Tang dynasty flying apsara costume with countless flowing red silk ribbons',
    'elaborate Dunhuang mural-inspired celestial dress with multiple layers of red gauze ribbons',
    'opulent Buddhist deity gown with dramatic red silk sashes flowing in all directions',
    'exquisite heavenly maiden outfit with spectacular red ribbon waterfall effect'
  ];

  const ribbons = [
    'dozens of long red silk ribbons attached to shoulders and waist flowing dramatically behind and around body creating dynamic movement',
    'massive red silk sashes wrapping around body and extending far into air with natural flowing motion',
    'countless thin red silk strips creating ribbon cloud effect surrounding figure',
    'wide red silk ribbons flowing from arms creating wing-like effect with majestic presence'
  ];

  return `${bases[index % bases.length]}, ${ribbons[index % ribbons.length]}, translucent red and gold silk fabric with divine shimmer, intricate Buddhist motifs embroidered with gold thread, elaborate celestial jewelry with jade and pearls, divine hair ornaments with golden phoenix, traditional Tang dynasty color palette dominated by vermilion red and gold, realistic fabric physics with ribbons flowing naturally in divine wind, cinematic epic scale with dramatic ribbon movement, authentic Dunhuang mural aesthetic with museum-quality detail`;
};

const feitianActions = [
  'floating gracefully in mid-air with arms extended, face fully visible, countless red silk ribbons flowing dramatically around and behind body creating spectacular effect, serene divine expression, elegant flying posture, ribbons moving naturally in divine wind, cinematic wide shot capturing full ribbon flow, 50mm lens, dramatic golden backlight, epic celestial atmosphere',

  'dancing in sky with red ribbons swirling around, face fully visible throughout, arms moving gracefully creating ribbon patterns, joyful celestial expression, dynamic flying motion, ribbons creating spiral effect, cinematic medium shot, 50mm lens, warm golden lighting, authentic flying apsara aesthetic',

  'hovering serenely with red ribbons flowing downward like waterfall, face fully visible, hands in blessing gesture, peaceful divine expression, stable floating posture, ribbons cascading naturally, cinematic portrait, 50mm lens, soft divine lighting from above, authentic Dunhuang mural atmosphere',

  'spinning slowly in air with ribbons creating circular pattern, face fully visible, arms extended naturally, graceful expression, elegant rotating motion, ribbons forming beautiful shapes, cinematic tracking shot, 50mm lens, dramatic lighting, epic flying apsara atmosphere',

  'ascending toward sky with ribbons trailing behind, face fully visible, one arm reaching upward, determined divine expression, powerful flying motion, ribbons streaming dramatically, cinematic low-angle shot, 50mm lens, golden sunlight, majestic celestial atmosphere'
];

// ============================================
// 創建角色卡
// ============================================

const newCategories = [];
let totalCreated = 0;

// 1. 創建500組精緻華麗朝代古裝
console.log('創建精緻華麗朝代古裝...');
const dynasties = Object.keys(luxuryDynastyNames);
const cardsPerDynasty = 100; // 每個朝代100張

dynasties.forEach((dynasty, dIndex) => {
  const entries = [];
  const names = luxuryDynastyNames[dynasty];

  for (let i = 0; i < cardsPerDynasty; i++) {
    const nameIndex = i % names.length;
    const sceneIndex = i % luxuryScenes.length;
    const actionIndex = i % luxuryActions.length;

    let uniqueName = names[nameIndex];
    if (i >= names.length) {
      const suffix = Math.floor(i / names.length) + 1;
      uniqueName = `${names[nameIndex]}·${suffix}`;
    }

    entries.push({
      name: uniqueName,
      scene: luxuryScenes[sceneIndex],
      outfit: generateLuxuryDynastyOutfit(dynasty, i),
      action: luxuryActions[actionIndex]
    });
    totalCreated++;
  }

  newCategories.push({
    name: `${dynasty}華服`,
    entries: entries
  });
});

// 2. 創建35組長相思
console.log('創建長相思補充...');
const changxiangsiEntries = [];
for (let i = 0; i < 35; i++) {
  const nameIndex = i % changxiangsiNames.length;
  const sceneIndex = i % changxiangsiScenes.length;
  const actionIndex = i % changxiangsiAction.length;

  let uniqueName = changxiangsiNames[nameIndex];
  if (i >= changxiangsiNames.length) {
    const suffix = Math.floor(i / changxiangsiNames.length) + 1;
    uniqueName = `${changxiangsiNames[nameIndex]}·${suffix}`;
  }

  changxiangsiEntries.push({
    name: uniqueName,
    scene: changxiangsiScenes[sceneIndex],
    outfit: changxiangsiOutfit(i),
    action: changxiangsiAction[actionIndex]
  });
  totalCreated++;
}

newCategories.push({
  name: '長相思·上古神話',
  entries: changxiangsiEntries
});

// 3. 創建40組大唐飛天
console.log('創建大唐飛天補充...');
const feitianEntries = [];
for (let i = 0; i < 40; i++) {
  const nameIndex = i % feitianNames.length;
  const sceneIndex = i % feitianScenes.length;
  const actionIndex = i % feitianActions.length;

  let uniqueName = feitianNames[nameIndex];
  if (i >= feitianNames.length) {
    const suffix = Math.floor(i / feitianNames.length) + 1;
    uniqueName = `${feitianNames[nameIndex]}·${suffix}`;
  }

  feitianEntries.push({
    name: uniqueName,
    scene: feitianScenes[sceneIndex],
    outfit: feitianOutfit(i),
    action: feitianActions[actionIndex]
  });
  totalCreated++;
}

newCategories.push({
  name: '大唐飛天·敦煌壁畫',
  entries: feitianEntries
});

// 添加到 CATS 數組
cats.push(...newCategories);

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('\n' + '='.repeat(60));
console.log(`✅ 完成！創建了 ${totalCreated} 張新角色卡`);
console.log(`\n分配明細：`);
console.log(`  精緻華麗朝代古裝: 500張 (${dynasties.length}個朝代，每個100張)`);
console.log(`  長相思補充: 35張`);
console.log(`  大唐飛天補充: 40張`);
console.log(`\n新增分類: ${newCategories.length}個`);
