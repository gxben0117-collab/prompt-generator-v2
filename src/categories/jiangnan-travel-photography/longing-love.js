/**
 * 長相思｜江南仙境｜電影旅拍
 * Longing Love - Jiangnan Fairyland - Cinematic Travel Photography
 */

export const LONGING_LOVE_CATEGORY = {
  id: 'longing-love',
  name: '長相思｜江南仙境｜電影旅拍',
  themeGroup: 'jiangnan-travel-photography',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'epic cinematic travel photography scale',
      'Jiangnan peach blossom fairyland',
      'red silk ribbon dynamic motion blur',
      'sunset ancient bridge romance',
    ],

    // 色彩基因
    colors: {
      primary: ['vibrant crimson-red', 'peach blossom pink'],
      secondary: ['sunset golden-orange', 'river water jade-blue'],
      accent: ['red umbrella focal point', 'silk ribbon motion trail'],
    },

    // 標誌性道具 (Signature Elements - MANDATORY)
    iconicProps: [
      'red silk ribbon with dynamic motion blur (MANDATORY signature)',
      'red umbrella as high-saturation focal point (MANDATORY signature)',
      'ancient stone bridge architecture',
      'city wall or mountain pass',
      'peach blossom trees',
      'water reflection surface',
      'Chinese pavilion silhouette',
      'sunset sky gradient',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'flowing white-pink silk foundation',
      concept: 'cinematic fairy-tale travel photography costume',
      keywords: [
        'flowing translucent layered hanfu',
        'peach blossom embroidery',
        'red ribbon integrated into costume',
        'jade accessories',
        'golden hair ornaments',
        'trailing sleeves with motion',
      ],
      fabric: [
        'peach-pink translucent gauze',
        'crimson red silk ribbon',
        'white silk base layer',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bodyType: 'graceful flowing silhouette',
      emphasis: 'fairy-tale character with dynamic movement',
    },

    // 場景類型
    sceneTypes: [
      'Jiangnan ancient bridge over water',
      'peach blossom riverside fairyland',
      'ancient city wall with mountain pass',
      'Chinese pavilion with water reflection',
      'sunset landscape with architecture',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'golden hour sunset backlight or side-light',
      fillLight: 'warm water reflection bounce light',
      rimLight: 'sunset rim illumination on ribbon and hair',
      ambience: 'cinematic epic travel photography golden atmosphere',
      specialEffect: 'red ribbon motion blur with sunset glow',
    },

    // 攝影風格
    photography: {
      framing: 'epic wide-angle travel photography composition',
      focus: 'cinematic scale showing full landscape and architecture',
      mood: 'romantic fairy-tale blockbuster cinema quality',
      technique: 'motion blur on red ribbon, sharp focus on character',
    },

    // 禁止元素
    prohibitions: [
      'no static portrait composition',
      'no anime fairy costume',
      'no game character outfit',
      'MUST include red silk ribbon motion element',
      'MUST include red umbrella in scene',
      'no indoor studio setting',
    ],

    // 質感要求
    textureRequirements: [
      'red silk ribbon with realistic motion blur physics',
      'translucent fabric with sunset backlight glow',
      'ancient architecture with weathered stone texture',
      'water surface with realistic reflection',
      'cinematic color grading with warm golden tone',
    ],

    // 關鍵驗證點 (Critical Validation)
    criticalValidation: {
      mustHave: [
        'red silk ribbon with dynamic motion blur',
        'red umbrella as focal point',
        'ancient architecture (bridge/wall/pavilion)',
        'sunset golden hour lighting',
      ],
      signature: 'epic cinematic travel photography scale, not portrait',
      atmosphere: 'romantic blockbuster movie poster aesthetic',
    },
  },

  // 提示詞權重配置
  promptWeights: {
    faceLock: 1.5,
    scene: 1.4,
    costume: 1.2,
    lighting: 1.2,
    style: 1.0,
  },
};
