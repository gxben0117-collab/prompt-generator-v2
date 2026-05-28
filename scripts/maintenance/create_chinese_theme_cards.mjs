import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 創建500張中國主題角色卡 ===\n');

// 先刪除已存在的新增分類
const categoriesToRemove = [
  '漢代宮廷', '唐代宮廷', '宋代宮廷', '明代宮廷', '清代宮廷',
  '中國神話傳說', '仙俠修真', '武俠江湖'
];

let removedCount = 0;
categoriesToRemove.forEach(catName => {
  const index = cats.findIndex(c => c.name === catName);
  if (index !== -1) {
    const removed = cats.splice(index, 1)[0];
    removedCount += removed.entries ? removed.entries.length : 0;
    console.log(`🗑️  刪除舊分類: ${catName} (${removed.entries ? removed.entries.length : 0}個)`);
  }
});

if (removedCount > 0) {
  console.log(`\n已刪除 ${removedCount} 個舊角色卡\n`);
}

console.log('開始創建新角色卡...\n');

// ============================================
// 角色名稱庫
// ============================================

// 真實歷史人物和典故
const dynastyNames = {
  '漢代': [
    '趙飛燕', '衛子夫', '王昭君', '班婕妤', '陳阿嬌', '李夫人', '鉤弋夫人', '竇太后', '呂雉', '薄姬',
    '許平君', '霍成君', '上官皇后', '張嫣', '鄧綏', '陰麗華', '郭聖通', '馬皇后', '竇妙', '梁妠'
  ],
  '唐代': [
    '武則天', '楊貴妃', '太平公主', '上官婉兒', '長孫皇后', '韋皇后', '蕭淑妃', '徐惠妃', '武惠妃', '楊淑妃',
    '高陽公主', '文成公主', '安樂公主', '永泰公主', '薛濤', '魚玄機', '李冶', '劉采春', '關盼盼', '紅拂女'
  ],
  '宋代': [
    '李清照', '朱淑真', '劉娥', '曹皇后', '孟皇后', '楊皇后', '謝道清', '李師師', '梁紅玉', '穆桂英',
    '佘太君', '楊門女將', '秦良玉', '花蕊夫人', '嚴蕊', '唐婉', '陸游妻', '蘇小妹', '張玉娘', '管道昇'
  ],
  '明代': [
    '馬皇后', '徐妙錦', '孫若微', '張皇后', '錢皇后', '周皇后', '王皇后', '陳皇后', '柳如是', '陳圓圓',
    '董小宛', '李香君', '顧橫波', '卞玉京', '寇白門', '馬湘蘭', '秦淮八艷', '沈宛', '黃娥', '楊慎妻'
  ],
  '清代': [
    '孝莊太后', '慈禧太后', '慈安太后', '孝賢皇后', '令妃', '香妃', '珍妃', '瑾妃', '婉容', '文繡',
    '那拉氏', '鈕祜祿氏', '富察氏', '烏拉那拉氏', '葉赫那拉氏', '博爾濟吉特氏', '董鄂妃', '蘇麻喇姑', '容妃', '純惠皇貴妃'
  ]
};

// 真實神話傳說人物（全部女性）
const mythNames = [
  '女媧', '嫦娥', '織女', '九天玄女', '西王母', '瑤池金母', '麻姑', '何仙姑', '呂洞賓妻', '鐵拐李妻',
  '洛神甄宓', '巫山神女', '湘妃娥皇', '湘妃女英', '精衛', '嫘祖', '媽祖林默娘', '觀音菩薩', '文殊菩薩', '普賢菩薩',
  '碧霞元君', '斗姆元君', '金靈聖母', '龜靈聖母', '無當聖母', '三霄娘娘', '雲霄', '瓊霄', '碧霄', '金光聖母',
  '龍女', '白素貞', '小青', '七仙女', '織女星君', '嫦娥仙子', '孟姜女', '白娘子', '祝英台', '梁山伯妻',
  '月宮嫦娥', '常娥仙子', '玉兔精', '天仙配仙女', '董永配七仙女', '七夕織女', '牛郎配織女', '鵲橋仙女', '王母娘娘', '瑤池聖母'
];

// 仙俠小說經典女性角色（金庸、古龍、梁羽生等）
const xianxiaNames = [
  '小龍女', '王語嫣', '任盈盈', '黃蓉', '趙敏', '周芷若', '阿朱', '阿紫', '程靈素', '香香公主',
  '霍青桐', '李莫愁', '郭襄', '小昭', '殷離', '楊不悔', '蛛兒', '韓小瑩', '穆念慈', '梅超風',
  '白飛飛', '朱七七', '沈璧君', '練霓裳', '凌霜華', '水笙', '冰雪兒', '閔柔', '何紅藥', '瑛姑',
  '藍鳳凰', '殷素素', '紀曉芙', '滅絕師太', '裘千尺', '公孫綠萼', '陸無雙', '程英', '郭芙', '耶律燕',
  '完顏萍', '雙兒', '曾柔', '方怡', '沐劍屏', '建寧公主', '蘇荃', '阿珂', '沐劍聲', '方怡'
];

// 武俠小說經典女性角色
const wuxiaNames = [
  '東方不敗', '林詩音', '孫小紅', '白飛飛', '朱七七', '沈璧君', '練霓裳', '凌霜華', '水笙', '冰雪兒',
  '林仙兒', '孫秀清', '蘇蓉蓉', '姬冰雁', '石秀雲', '宮南燕', '沙曼', '李紅袖', '上官小仙', '上官飛燕',
  '峨眉派掌門', '武當派女俠', '少林寺俗家', '華山派劍客', '崑崙派仙子', '崆峒派俠女', '點蒼派劍姬', '青城派女俠', '天山童姥', '逍遙派主',
  '明教聖女', '日月神教長老', '五毒教主', '星宿派女弟子', '丐幫女幫主', '天鷹教聖女', '神龍教聖女', '紅花會女俠', '天地會女俠', '青幫女俠',
  '飛刀門女俠', '暗器世家女', '毒手門女俠', '鐵掌幫女俠', '金刀門女俠', '銀槍會女俠', '銅錘幫女俠', '鐵扇門女俠', '唐門女俠', '五仙教女'
];

// ============================================
// 場景庫
// ============================================

const dynastyScenes = [
  'grand imperial palace hall with golden dragon pillars and red silk curtains, soft candlelight creating warm atmosphere',
  'elegant palace garden with blooming peonies and ancient pavilion, morning mist and soft sunlight',
  'luxurious palace chamber with carved wooden screens and silk bedding, warm lamplight and incense smoke',
  'imperial throne room with jade steps and golden throne, dramatic lighting from high windows',
  'palace courtyard with marble pathways and lotus pond, afternoon golden light filtering through trees',
  'royal library with ancient scrolls and sandalwood furniture, soft natural light from paper windows',
  'palace balcony overlooking imperial city, sunset golden hour with distant mountains',
  'ceremonial hall with bronze incense burners and silk banners, solemn candlelight atmosphere',
  'imperial garden pavilion by lake, cherry blossoms falling in spring breeze',
  'palace bedroom with embroidered curtains and jade ornaments, soft moonlight through windows'
];

const mythScenes = [
  'heavenly palace floating in clouds, golden light and celestial atmosphere with rainbow bridges',
  'sacred mountain peak above sea of clouds, mystical fog and divine radiance',
  'jade pool in celestial realm, crystal clear water reflecting starlight and moon',
  'divine temple with golden pillars and jade floors, ethereal glow and floating lotus flowers',
  'celestial garden with immortal peach trees, glowing fruits and magical butterflies',
  'heavenly waterfall cascading from clouds, rainbow mist and divine energy',
  'sacred cave with glowing crystals and ancient inscriptions, mystical atmosphere',
  'celestial pavilion among stars, cosmic background with nebula colors',
  'divine palace hall with floating lanterns and golden decorations, heavenly light',
  'immortal realm forest with glowing plants and magical creatures, ethereal atmosphere'
];

const xianxiaScenes = [
  'mountain peak cultivation platform, sword energy visible in air, morning mist and spiritual energy',
  'ancient sect main hall with floating swords and cultivation manuals, mystical atmosphere',
  'cliff edge meditation spot overlooking endless mountains, sunset with spiritual energy flowing',
  'bamboo forest cultivation ground, spiritual energy gathering like fireflies at night',
  'waterfall cultivation cave with natural stone platform, water mist and spiritual light',
  'ancient sword formation array, multiple flying swords creating geometric patterns in air',
  'sect library tower with ancient cultivation texts, soft candlelight and mystical atmosphere',
  'mountain valley training ground with sword marks on rocks, dawn light breaking through mist',
  'floating island in sky with cultivation pavilion, clouds below and stars above',
  'ancient ruins with broken pillars and sword energy remnants, mysterious atmosphere'
];

const wuxiaScenes = [
  'bamboo forest with dappled sunlight, fallen leaves on ground, peaceful martial atmosphere',
  'ancient temple courtyard with stone lions and incense smoke, afternoon golden light',
  'riverside willow grove with wooden bridge, gentle breeze and flowing water sounds',
  'mountain inn common room with wooden tables and lanterns, warm firelight atmosphere',
  'rooftop of ancient building overlooking city, night scene with moon and distant lights',
  'forest clearing with ancient trees, morning mist and bird songs, tranquil martial setting',
  'stone bridge over mountain stream, cherry blossoms falling, spring atmosphere',
  'abandoned manor courtyard overgrown with vines, melancholic sunset lighting',
  'mountain path with pine trees and rocky cliffs, dramatic mountain scenery',
  'lakeside pavilion with lotus flowers, evening golden hour reflection on water'
];

// ============================================
// 服飾生成（6層中國古典電影級）
// ============================================

function generateDynastyOutfit(dynasty, index) {
  const silhouettes = {
    '漢代': 'flowing Han dynasty curved-train robe with elegant cross-collar design',
    '唐代': 'luxurious Tang dynasty high-waist flowing dress with chest-high ruqun ensemble',
    '宋代': 'refined Song dynasty minimalist layered robe with narrow elegant sleeves',
    '明代': 'structured Ming dynasty horse-face skirt ensemble with embroidered jacket',
    '清代': 'elegant Qing dynasty flag gown qipao with refined Manchu styling'
  };

  const fabrics = [
    'flowing silk fabric with natural draping weight and luxurious sheen',
    'layered translucent gauze with subtle transparency and ethereal lightness',
    'heavy brocade with realistic texture and rich embroidered patterns',
    'delicate satin with fine craftsmanship and smooth elegant drape'
  ];

  const embroidery = [
    'intricate hand-embroidered dragon and phoenix patterns with gold thread',
    'delicate cloud and wave motifs with traditional Chinese symbolism',
    'elegant peony and lotus embroidery with fine silk thread details',
    'traditional geometric patterns with auspicious symbols and borders'
  ];

  const accessories = [
    'ornate jade hairpin with gold accents, pearl necklace, embroidered silk shoes',
    'elegant phoenix crown with precious stones, jade pendant, traditional belt',
    'delicate flower hairpin with pearls, jade bracelet, embroidered accessories',
    'traditional hair ornaments with gold, jade earrings, silk embroidered details'
  ];

  const colors = [
    'imperial bright red with gold embroidery and jade green accents',
    'elegant celadon green with ivory white and silver highlights',
    'luxurious plum purple with gold thread and pearl white details',
    'sophisticated ink blue with silver accents and cream undertones'
  ];

  const realism = [
    'realistic fabric weight with natural draping and authentic period construction',
    'cinematic lighting on traditional textiles with historically accurate tailoring',
    'natural fabric movement with air flow and authentic dynasty aesthetic',
    'period-accurate costume quality with realistic material behavior'
  ];

  return `${silhouettes[dynasty]}, ${fabrics[index % fabrics.length]}, ${embroidery[index % embroidery.length]}, ${accessories[index % accessories.length]}, ${colors[index % colors.length]}, ${realism[index % realism.length]}`;
}

function generateMythOutfit(index) {
  const silhouettes = [
    'sacred celestial gown with divine elegant silhouette and heavenly design',
    'ethereal goddess dress with flowing immortal layers and mystical grace',
    'divine ceremonial robe with sacred symbols and celestial elegance',
    'heavenly fairy dress with gossamer wings and immortal beauty'
  ];

  const fabrics = [
    'flowing celestial silk with subtle divine shimmer and ethereal lightness',
    'translucent heavenly gauze with mystical glow and weightless drape',
    'sacred brocade with divine patterns and immortal sheen',
    'ethereal chiffon with starlight transparency and heavenly flow'
  ];

  const embroidery = [
    'intricate celestial symbols and divine patterns with golden thread',
    'delicate cloud and crane motifs with immortal symbolism',
    'sacred lotus and phoenix embroidery with heavenly craftsmanship',
    'mystical dragon and pearl patterns with divine artistry'
  ];

  const accessories = [
    'divine crown with celestial jewels, immortal jade pendant, heavenly ornaments',
    'sacred hairpin with glowing gems, divine necklace, ethereal accessories',
    'celestial circlet with starlight stones, holy jade, mystical jewelry',
    'heavenly hair ornaments with pearls, divine earrings, sacred details'
  ];

  const colors = [
    'pure celestial white with golden divine accents and rainbow highlights',
    'ethereal silver with moonlight shimmer and starlight sparkle',
    'sacred purple with heavenly glow and pearl white details',
    'divine blue with celestial radiance and golden immortal accents'
  ];

  const realism = [
    'realistic divine fabric with subtle magical glow and authentic celestial atmosphere',
    'cinematic heavenly lighting creating mystical ambiance with sacred quality',
    'natural ethereal movement with divine enhancement and immortal grace',
    'authentic mythological aesthetic with believable celestial construction'
  ];

  return `${silhouettes[index % silhouettes.length]}, ${fabrics[index % fabrics.length]}, ${embroidery[index % embroidery.length]}, ${accessories[index % accessories.length]}, ${colors[index % colors.length]}, ${realism[index % realism.length]}`;
}

function generateXianxiaOutfit(index) {
  const silhouettes = [
    'elegant cultivation sect robe with flowing immortal silhouette and sword-bearer design',
    'mystical dao robe with ethereal layers and cultivation elegance',
    'refined immortal cultivator dress with graceful martial lines',
    'sacred sect ceremonial gown with cultivation symbols and elegant flow'
  ];

  const fabrics = [
    'flowing cultivation silk with subtle spiritual energy shimmer',
    'lightweight dao fabric with natural drape and martial flexibility',
    'mystical sect textile with ethereal sheen and cultivation quality',
    'refined immortal cloth with smooth texture and spiritual essence'
  ];

  const embroidery = [
    'intricate cultivation symbols and dao patterns with silver thread',
    'delicate sword and cloud motifs with sect insignia details',
    'elegant immortal runes and spiritual patterns with fine craftsmanship',
    'traditional cultivation symbols with mystical energy designs'
  ];

  const accessories = [
    'elegant jade cultivation token, immortal sword accessory, sect hairpin',
    'mystical dao pendant with spiritual gem, cultivation belt, elegant ornaments',
    'refined sect badge with jade, immortal hair ornament, spiritual jewelry',
    'sacred cultivation talisman, elegant jade accessories, sect details'
  ];

  const colors = [
    'elegant white and blue with silver cultivation accents',
    'mystical purple and gold with spiritual energy glow',
    'refined green and silver with jade immortal highlights',
    'sacred black and gold with cultivation sect colors'
  ];

  const realism = [
    'realistic cultivation fabric with subtle spiritual energy effects',
    'cinematic martial lighting creating mystical cultivation atmosphere',
    'natural fabric flow with cultivation grace and immortal elegance',
    'authentic xianxia aesthetic with believable sect costume quality'
  ];

  return `${silhouettes[index % silhouettes.length]}, ${fabrics[index % fabrics.length]}, ${embroidery[index % embroidery.length]}, ${accessories[index % accessories.length]}, ${colors[index % colors.length]}, ${realism[index % realism.length]}`;
}

function generateWuxiaOutfit(index) {
  const silhouettes = [
    'elegant martial arts robe with flowing warrior silhouette and practical design',
    'refined jianghu dress with graceful martial lines and fighter elegance',
    'traditional wuxia outfit with heroic style and combat flexibility',
    'sophisticated martial artist gown with elegant warrior aesthetic'
  ];

  const fabrics = [
    'durable martial silk with natural drape and combat-ready weight',
    'flexible warrior fabric with smooth texture and practical movement',
    'traditional jianghu textile with authentic martial quality',
    'refined combat cloth with elegant drape and fighter durability'
  ];

  const embroidery = [
    'subtle martial symbols and sect patterns with traditional thread',
    'delicate weapon motifs and jianghu insignia with fine detail',
    'elegant warrior designs and martial patterns with craftsmanship',
    'traditional combat symbols with heroic artistic touches'
  ];

  const accessories = [
    'practical leather belt with weapon holder, simple jade pendant, martial boots',
    'elegant sect badge with metal, warrior hair tie, combat accessories',
    'refined martial ornament with jade, practical jewelry, fighter details',
    'traditional weapon accessory, simple elegant ornaments, jianghu style'
  ];

  const colors = [
    'classic black and white with red martial accents',
    'elegant blue and silver with traditional jianghu tones',
    'refined brown and gold with earthy warrior colors',
    'traditional green and black with martial sect styling'
  ];

  const realism = [
    'realistic martial fabric with natural combat movement and authentic construction',
    'cinematic wuxia lighting creating traditional jianghu atmosphere',
    'natural warrior fabric flow with martial grace and fighter practicality',
    'authentic wuxia aesthetic with believable martial arts costume quality'
  ];

  return `${silhouettes[index % silhouettes.length]}, ${fabrics[index % fabrics.length]}, ${embroidery[index % embroidery.length]}, ${accessories[index % accessories.length]}, ${colors[index % colors.length]}, ${realism[index % realism.length]}`;
}

// ============================================
// 動作生成（50mm電影級 + 鎖臉）
// ============================================

const dynastyActions = [
  'standing gracefully in traditional palace posture, face fully visible, hands naturally positioned in classical gesture, serene dignified expression, elegant imperial composure, natural fabric draping, cinematic medium shot, 50mm lens, soft palace lighting, shallow depth of field, authentic dynasty court atmosphere',

  'sitting elegantly in traditional kneeling posture, face fully visible, hands resting gracefully on lap, calm noble expression, refined palace posture, fabric arranged beautifully, cinematic portrait, 50mm lens, soft natural lighting, shallow depth of field, authentic imperial aesthetic',

  'walking slowly with graceful traditional gait, face fully visible throughout, long sleeves flowing naturally, elegant palace movement, dignified expression, natural fabric motion, cinematic tracking shot, 50mm lens, soft diffused lighting, authentic dynasty atmosphere',

  'standing by palace window naturally, face fully visible in soft light, one hand touching window frame, serene contemplative expression, elegant posture, fabric catching natural light, cinematic medium shot, 50mm lens, natural window lighting, authentic palace atmosphere',

  'adjusting hair ornament with natural hand movement, face fully visible, calm focused expression, elegant finger positioning, subtle breathing motion, cinematic close-up, 50mm lens, soft side lighting, shallow focus, authentic dynasty elegance'
];

const mythActions = [
  'floating gracefully in celestial pose, face fully visible, arms extended naturally with divine grace, serene immortal expression, ethereal heavenly posture, fabric flowing with mystical breeze, cinematic medium shot, 50mm lens, soft divine lighting, shallow depth of field, authentic mythological atmosphere',

  'standing on clouds naturally, face fully visible, one hand gesturing with divine energy, calm celestial expression, elegant immortal posture, sacred elements visible, cinematic portrait, 50mm lens, soft heavenly lighting, authentic mythological aesthetic',

  'sitting in lotus position on sacred platform, face fully visible, hands in meditation gesture, peaceful divine expression, serene immortal composure, mystical glow surrounding, cinematic medium shot, 50mm lens, soft sacred lighting, authentic celestial atmosphere',

  'walking through heavenly realm, face fully visible throughout, fabric flowing with divine wind, serene immortal expression, graceful celestial movement, mystical elements around, cinematic tracking shot, 50mm lens, soft divine lighting, authentic mythological atmosphere',

  'holding sacred artifact naturally, face fully visible, calm powerful expression, elegant divine posture, mystical energy visible, cinematic portrait, 50mm lens, dramatic heavenly lighting, authentic celestial aesthetic'
];

const xianxiaActions = [
  'standing in cultivation meditation pose, face fully visible, hands forming dao seal naturally, calm spiritual expression, elegant immortal posture, subtle energy flow visible, cinematic medium shot, 50mm lens, soft mystical lighting, shallow depth of field, authentic xianxia atmosphere',

  'performing sword cultivation gesture, face fully visible throughout, graceful martial movement, focused cultivator expression, elegant sect posture, spiritual energy around, cinematic action shot, 50mm lens, dramatic cultivation lighting, authentic xianxia aesthetic',

  'sitting in cultivation position on mountain peak, face fully visible, hands in meditation seal, serene immortal expression, refined dao posture, natural spiritual atmosphere, cinematic portrait, 50mm lens, soft mountain lighting, authentic cultivation atmosphere',

  'walking through sect grounds naturally, face fully visible, one hand on sword hilt, calm martial expression, elegant cultivator stride, fabric flowing naturally, cinematic tracking shot, 50mm lens, soft natural lighting, authentic xianxia atmosphere',

  'channeling spiritual energy with hand gesture, face fully visible, concentrated expression, strong cultivation posture, mystical energy effects visible, cinematic medium shot, 50mm lens, dramatic spiritual lighting, authentic xianxia aesthetic'
];

const wuxiaActions = [
  'standing in martial ready stance, face fully visible, one hand on weapon naturally, alert warrior expression, strong jianghu posture, fabric settled naturally, cinematic medium shot, 50mm lens, natural outdoor lighting, shallow depth of field, authentic wuxia atmosphere',

  'performing martial arts form, face fully visible throughout, graceful combat movement, focused fighter expression, elegant warrior posture, fabric flowing with motion, cinematic action shot, 50mm lens, dramatic natural lighting, authentic wuxia aesthetic',

  'sitting in meditation on rock, face fully visible, hands resting on knees, calm martial expression, relaxed warrior posture, natural outdoor setting, cinematic portrait, 50mm lens, soft natural lighting, authentic jianghu atmosphere',

  'walking through bamboo forest, face fully visible, natural martial stride, alert expression, confident warrior movement, fabric moving with breeze, cinematic tracking shot, 50mm lens, dappled forest lighting, authentic wuxia atmosphere',

  'drawing weapon in fluid motion, face fully visible, determined expression, strong martial posture, dynamic warrior movement, cinematic action shot, 50mm lens, dramatic lighting, authentic wuxia aesthetic'
];

// ============================================
// 創建500張新角色卡
// ============================================

const newCategories = [];
let totalCreated = 0;

// 分配數量：隨機但總和為500
const distribution = {
  dynasty: 150,  // 朝代
  myth: 120,     // 神話
  xianxia: 120,  // 仙俠
  wuxia: 110     // 武俠
};

// 創建朝代角色卡
const dynasties = Object.keys(dynastyNames);
const cardsPerDynasty = Math.floor(distribution.dynasty / dynasties.length);

dynasties.forEach((dynasty, dIndex) => {
  const entries = [];
  const names = dynastyNames[dynasty];

  for (let i = 0; i < cardsPerDynasty; i++) {
    const nameIndex = i % names.length;
    const sceneIndex = (dIndex * cardsPerDynasty + i) % dynastyScenes.length;
    const actionIndex = i % dynastyActions.length;

    // 生成唯一名字：如果超过名字数量，添加编号
    let uniqueName = names[nameIndex];
    if (i >= names.length) {
      const suffix = Math.floor(i / names.length) + 1;
      uniqueName = `${names[nameIndex]}·${suffix}`;
    }

    entries.push({
      name: uniqueName,
      scene: dynastyScenes[sceneIndex],
      outfit: generateDynastyOutfit(dynasty, i),
      action: dynastyActions[actionIndex]
    });
    totalCreated++;
  }

  newCategories.push({
    name: `${dynasty}宮廷`,
    entries: entries
  });
});

// 創建神話角色卡
const mythEntries = [];
for (let i = 0; i < distribution.myth; i++) {
  const nameIndex = i % mythNames.length;
  const sceneIndex = i % mythScenes.length;
  const actionIndex = i % mythActions.length;

  // 生成唯一名字
  let uniqueName = mythNames[nameIndex];
  if (i >= mythNames.length) {
    const suffix = Math.floor(i / mythNames.length) + 1;
    uniqueName = `${mythNames[nameIndex]}·${suffix}`;
  }

  mythEntries.push({
    name: uniqueName,
    scene: mythScenes[sceneIndex],
    outfit: generateMythOutfit(i),
    action: mythActions[actionIndex]
  });
  totalCreated++;
}

newCategories.push({
  name: '中國神話傳說',
  entries: mythEntries
});

// 創建仙俠角色卡
const xianxiaEntries = [];
for (let i = 0; i < distribution.xianxia; i++) {
  const nameIndex = i % xianxiaNames.length;
  const sceneIndex = i % xianxiaScenes.length;
  const actionIndex = i % xianxiaActions.length;

  // 生成唯一名字
  let uniqueName = xianxiaNames[nameIndex];
  if (i >= xianxiaNames.length) {
    const suffix = Math.floor(i / xianxiaNames.length) + 1;
    uniqueName = `${xianxiaNames[nameIndex]}·${suffix}`;
  }

  xianxiaEntries.push({
    name: uniqueName,
    scene: xianxiaScenes[sceneIndex],
    outfit: generateXianxiaOutfit(i),
    action: xianxiaActions[actionIndex]
  });
  totalCreated++;
}

newCategories.push({
  name: '仙俠修真',
  entries: xianxiaEntries
});

// 創建武俠角色卡
const wuxiaEntries = [];
for (let i = 0; i < distribution.wuxia; i++) {
  const nameIndex = i % wuxiaNames.length;
  const sceneIndex = i % wuxiaScenes.length;
  const actionIndex = i % wuxiaActions.length;

  // 生成唯一名字
  let uniqueName = wuxiaNames[nameIndex];
  if (i >= wuxiaNames.length) {
    const suffix = Math.floor(i / wuxiaNames.length) + 1;
    uniqueName = `${wuxiaNames[nameIndex]}·${suffix}`;
  }

  wuxiaEntries.push({
    name: uniqueName,
    scene: wuxiaScenes[sceneIndex],
    outfit: generateWuxiaOutfit(i),
    action: wuxiaActions[actionIndex]
  });
  totalCreated++;
}

newCategories.push({
  name: '武俠江湖',
  entries: wuxiaEntries
});

// 添加到 CATS 數組
cats.push(...newCategories);

const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！創建了 ${totalCreated} 張新角色卡`);
console.log(`\n分配明細：`);
console.log(`  朝代角色: ${distribution.dynasty}張 (${dynasties.length}個朝代)`);
console.log(`  神話傳說: ${distribution.myth}張`);
console.log(`  仙俠修真: ${distribution.xianxia}張`);
console.log(`  武俠江湖: ${distribution.wuxia}張`);
console.log(`\n新增分類: ${newCategories.length}個`);
