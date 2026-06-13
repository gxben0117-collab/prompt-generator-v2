/**
 * 盛唐大明宮｜貴妃考據｜史實禮制
 * Tang Dynasty Daming Palace - Imperial Consort Historical - Authentic Ceremony
 */

export const TANG_DAMING_PALACE_CATEGORY = {
  id: 'tang-daming-palace',
  name: '盛唐大明宮｜貴妃考據｜史實禮制',
  themeGroup: 'eastern-historical-court',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'Tang Dynasty imperial palace grandeur',
      'historical consort ceremony cinema',
      'peony garden golden sunset ambience',
      'authentic court protocol elegance',
    ],

    // 色彩基因
    colors: {
      primary: ['peony crimson-red', 'imperial golden-yellow'],
      secondary: ['peacock jade-green', 'sapphire royal-blue'],
      accent: ['sunset golden glow', 'silk pearl luster'],
    },

    // 標誌性道具
    iconicProps: [
      'Daming Palace architecture columns',
      'peony flower arrangements',
      'palace lanterns with red tassels',
      'carved jade railings',
      'ceremonial incense burner',
      'phoenix crown accessories',
      'imperial court fan',
      'embroidered screen panels',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'Tang Dynasty high-waist layered foundation',
      concept: 'historically accurate Tang imperial consort ceremonial dress',
      keywords: [
        'Tang Dynasty ruqun ensemble',
        'banbi half-sleeve jacket',
        'pibo silk shawl draping',
        'high-waist layered skirt',
        'phoenix crown ceremonial headdress',
        'authentic court jewelry',
      ],
      fabric: [
        'imperial silk with phoenix-peony embroidery',
        'translucent gauze outer layer',
        'golden thread brocade trim',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bodyType: 'Tang Dynasty aesthetic - fuller figure preferred',
      emphasis: 'historically accurate proportions, Tang era beauty standard',
    },

    // 場景類型
    sceneTypes: [
      'Daming Palace Hanyuan Hall exterior',
      'Linde Hall ceremonial space',
      'imperial peony garden',
      'palace corridor with lanterns and columns',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'golden sunset balanced key light from palace courtyard',
      fillLight: 'warm palace lantern ambient glow',
      rimLight: 'soft golden edge separation on silk and jewelry',
      ambience: 'warm palace garden sunset atmosphere',
      catchlight: 'natural golden hour reflection in eyes',
    },

    // 攝影風格
    photography: {
      framing: 'cinematic historical drama composition',
      focus: 'shallow depth with palace architecture bokeh',
      mood: 'authentic Tang Dynasty court cinema quality',
    },

    // 禁止元素
    prohibitions: [
      'no anime hanfu costume',
      'no cheap cosplay quality',
      'no modern fabric shine',
      'no fantasy game palace outfit',
      'no Korean hanbok confusion',
      'must be historically accurate Tang Dynasty style',
    ],

    // 質感要求
    textureRequirements: [
      'authentic Tang silk draping physics',
      'historically accurate embroidery patterns',
      'natural jade and gold jewelry texture',
      'weathered palace architecture surface',
      'realistic fabric layering with proper weight',
    ],

    // 考據要點
    historicalAccuracy: {
      period: 'Tang Xuanzong era (713-756 CE)',
      reference: 'Daming Palace archaeological records',
      costume: 'Tang Dynasty court dress code standards',
      architecture: 'Hanyuan Hall and Linde Hall authentic details',
    },
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
