/**
 * 夜宴魅魔｜暗黑浪漫｜哥德禮服
 * Succubus Night Banquet - Dark Romance Gothic Gown Cinema
 */

export const SUCCUBUS_BANQUET_CATEGORY = {
  id: 'succubus-banquet',
  name: '夜宴魅魔｜暗黑浪漫｜哥德禮服',
  themeGroup: 'dark-romance',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'dark romantic velvet chamber',
      'gothic luxury bedroom cinema',
      'candlelit purple amethyst ambience',
      'mature elegant dark glamour',
    ],

    // 色彩基因
    colors: {
      primary: ['deep purple', 'amethyst violet', 'obsidian black'],
      secondary: ['dark crimson', 'moon silver', 'ruby red'],
      accent: ['candlelight warm glow', 'purple crystal reflection'],
    },

    // 標誌性道具
    iconicProps: [
      'gothic carved mirror',
      'amethyst wine glass',
      'black rose arrangement',
      'velvet canopy bed',
      'obsidian mirror surface',
      'gothic carved screen',
      'crystal chandelier',
      'lace spider-web curtain',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'luxury deep purple silk slip nightgown foundation',
      concept: 'cinematic low-cut satin nightgown evening dress',
      keywords: [
        'one-piece luxury satin nightgown',
        'deep V slip dress silhouette',
        'gothic ornate accessories',
        'butterfly shoulder veil',
        'jewel shoulder chain',
        'flowing translucent cape',
      ],
      fabric: [
        'purple-black satin',
        'moon-silver sheer veil',
        'velvet ribbon trim',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bust: 'K cup minimum',
      bodyType: 'voluptuous mature silhouette',
      emphasis: 'natural chest volume with realistic draping fabric physics',
    },

    // 場景類型
    sceneTypes: [
      'dark purple velvet bedroom chamber',
      'gothic candlelit palace interior',
      'moonlight high window chamber',
      'luxury dark romantic boudoir',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'soft warm candlelight from low position',
      fillLight: 'cool purple moonlight from high window',
      rimLight: 'moonlight edge separation on silk and hair',
      ambience: 'purple haze with warm ruby reflection',
      catchlight: 'visible in eyes, jewelry has soft specular highlights',
    },

    // 攝影風格
    photography: {
      framing: 'cinematic medium-close portrait or seated pose',
      focus: 'shallow depth of field with velvet bokeh',
      mood: 'mature dark romantic cinema quality',
    },

    // 禁止元素 (Critical)
    prohibitions: [
      'no bra-and-panty lingerie set',
      'no erotic underwear costume',
      'no game character skin outfit',
      'no anime magical girl dress',
      'no overly exposed body',
      'dress must be one-piece nightgown covering chest and lower body',
    ],

    // 質感要求
    textureRequirements: [
      'realistic silk fabric draping physics',
      'natural candlelight reflection on satin',
      'soft skin-close fabric contact',
      'cinematic fabric weight and flow',
      'velvet realistic texture with depth',
    ],
  },

  // 提示詞權重配置
  promptWeights: {
    faceLock: 1.5,
    scene: 1.2,
    costume: 1.3,
    lighting: 1.1,
    style: 1.0,
  },
};
