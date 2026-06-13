/**
 * 九尾妖狐｜月夜禁林｜狐火神域
 * Nine-Tailed Fox Spirit - Moonlit Forbidden Forest - Spirit Fire Realm
 */

export const NINE_TAIL_FOX_CATEGORY = {
  id: 'nine-tail-fox',
  name: '九尾妖狐｜月夜禁林｜狐火神域',
  themeGroup: 'eastern-mythology',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'moonlit ancient forbidden forest',
      'spirit fox sacred realm',
      'floating spirit-fire mystical ambience',
      'eastern mythology epic cinema',
    ],

    // 色彩基因
    colors: {
      primary: ['moonlight silver-white', 'spirit fox golden-orange'],
      secondary: ['forest deep green', 'spirit fire warm amber'],
      accent: ['fox-fire golden glow', 'moon cold blue-white'],
    },

    // 標誌性道具
    iconicProps: [
      'nine fox tails (mandatory signature element)',
      'floating spirit-fire orbs',
      'ancient fox shrine ruins',
      'sacred torii gate',
      'spirit lanterns',
      'fox-fire particles',
      'moonlit forest trees',
      'mystical fog layers',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'white silk foundation with golden-orange accent',
      concept: 'cinematic eastern fox spirit royal costume',
      keywords: [
        'flowing white-gold layered kimono',
        'spirit fox fur trim details',
        'golden ornate accessories',
        'translucent flame-pattern veil',
        'jeweled fox-themed headdress',
        'trailing ceremonial sleeves',
      ],
      fabric: [
        'white silk with golden embroidery',
        'translucent spirit-fire pattern gauze',
        'fox fur texture accents',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bodyType: 'elegant ethereal fox spirit silhouette',
      emphasis: 'supernatural beauty with mystical presence, not human proportions',
    },

    // 場景類型
    sceneTypes: [
      'moonlit forbidden forest clearing',
      'ancient fox spirit shrine ruins',
      'mystical forest with spirit lanterns',
      'sacred mountain fox realm',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'bright full moon as main light source',
      fillLight: 'warm spirit-fire glow from fox-fire orbs',
      rimLight: 'golden ember edge separation on nine tails and hair',
      ambience: 'cool moonlight with warm fire dual-lighting',
      specialEffect: 'fox-fire particle glow and mystical fog diffusion',
    },

    // 攝影風格
    photography: {
      framing: 'epic cinematic composition showing all nine tails',
      focus: 'dramatic depth with spirit-fire bokeh',
      mood: 'eastern mythology fantasy epic quality',
    },

    // 禁止元素
    prohibitions: [
      'no anime catgirl costume',
      'no game character fox-ear accessory',
      'no cute animal cosplay',
      'no sexy furry outfit',
      'tails must be nine separate realistic fox tails with volume and weight',
    ],

    // 質感要求
    textureRequirements: [
      'realistic fox fur texture on nine tails',
      'each tail must have individual volume and movement',
      'spirit-fire must have ethereal glow effect',
      'fabric shows supernatural flowing physics',
      'moonlight creates realistic cold-tone illumination',
    ],

    // 關鍵驗證點
    criticalValidation: {
      mustHave: 'exactly nine visible fox tails',
      signature: 'fox-fire spirit orbs floating in scene',
      atmosphere: 'moonlit forest with mystical fog',
    },
  },

  // 提示詞權重配置
  promptWeights: {
    faceLock: 1.5,
    scene: 1.3,
    costume: 1.2,
    lighting: 1.2,
    style: 1.0,
  },
};
