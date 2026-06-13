/**
 * 墮天使｜哥德廢墟｜神聖破碎
 * Fallen Angel - Gothic Ruins - Sacred Destruction Cinema
 */

export const FALLEN_ANGEL_CATEGORY = {
  id: 'fallen-angel',
  name: '墮天使｜哥德廢墟｜神聖破碎',
  themeGroup: 'dark-fantasy',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'gothic ruined cathedral ambience',
      'sacred destruction cinema',
      'ash and black feather darkness',
      'divine fallen elegy mood',
    ],

    // 色彩基因
    colors: {
      primary: ['obsidian black', 'ash gray', 'cold silver'],
      secondary: ['sacred white', 'dark purple shadow'],
      accent: ['moonlight beam', 'sacred light glow', 'ember ash particles'],
    },

    // 標誌性道具
    iconicProps: [
      'massive black wings',
      'scattered falling feathers',
      'broken stone pillars',
      'shattered stained glass',
      'burned sacred cloth',
      'silver holy armor fragments',
      'gothic embroidered fabric',
      'ruined altar',
      'ash particles floating',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'cold white silk inner layer with black shadow veil',
      concept: 'cinematic fallen angel sacred broken costume',
      keywords: [
        'black-white sacred robe with trailing',
        'remnant wing cape draping',
        'silver holy armor fragments',
        'gothic embroidery details',
        'ash-covered fabric texture',
        'divine destruction aesthetic',
      ],
      fabric: [
        'burned sacred white cloth',
        'obsidian black feather material',
        'cold silver metallic fragments',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bodyType: 'slender ethereal silhouette',
      emphasis: 'divine being with elegant posture, not sexualized',
    },

    // 場景類型
    sceneTypes: [
      'ruined gothic cathedral with broken ceiling',
      'destroyed temple with moonlight beam',
      'collapsed stone architecture',
      'sacred ruins with ash falling',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'high sacred light beam from broken cathedral ceiling',
      fillLight: 'soft side light through ruined windows',
      rimLight: 'cold gray edge separation on black wings and hair',
      ambience: 'dust volumetric light with ash haze',
      specialEffect: 'god rays through broken stained glass',
    },

    // 攝影風格
    photography: {
      framing: 'epic wide-angle or dramatic low-angle shot',
      focus: 'cinematic depth of field with floating feather bokeh',
      mood: 'dark fantasy epic cinema quality',
    },

    // 禁止元素
    prohibitions: [
      'no game engine character model',
      'no anime magical girl wings',
      'no sexy lingerie fallen angel',
      'no cute decorative wings',
      'wings must be massive and realistic with weight',
    ],

    // 質感要求
    textureRequirements: [
      'realistic black feather texture with individual detail',
      'stone ruins with weathered surface',
      'fabric must show burn marks and ash coverage',
      'silver armor with oxidation and damage',
      'volumetric dust and ash particles in air',
    ],
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
