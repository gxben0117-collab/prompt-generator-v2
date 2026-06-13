/**
 * 紅樓夢｜大觀園｜經典名著
 * Dream of the Red Chamber - Grand View Garden - Classic Literature
 */

export const DREAM_RED_CHAMBER_CATEGORY = {
  id: 'dream-red-chamber',
  name: '紅樓夢｜大觀園｜經典名著',
  themeGroup: 'eastern-historical-court',

  visualDNA: {
    // 核心氛圍
    atmosphere: [
      'Grand View Garden poetic melancholy',
      'classical Chinese literature cinema',
      'rainy bamboo courtyard elegance',
      'Qing Dynasty aristocratic refinement',
    ],

    // 色彩基因
    colors: {
      primary: ['moon-white', 'pale cyan-blue', 'soft powder-pink'],
      secondary: ['warm ivory', 'muted apricot-gold', 'jade green'],
      accent: ['bamboo shadow green', 'incense smoke gray'],
    },

    // 標誌性道具
    iconicProps: [
      'Grand View Garden pavilions',
      'bamboo grove after rain',
      'classical window lattice',
      'poetry manuscript scrolls',
      'flower hoe and handkerchief',
      'fallen petals on stone path',
      'incense burner with smoke',
      'traditional screen panels',
      'scholar\'s study desk',
    ],

    // 服裝風格
    costumeStyle: {
      layer1: 'Qing Dynasty inner layer foundation',
      concept: 'classical literature character authentic costume',
      keywords: [
        'Qing Dynasty lady\'s ensemble',
        'embroidered silk robe',
        'delicate pastel colors',
        'refined aristocratic accessories',
        'golden lock pendant (for Baochai)',
        'jade pendant ornaments',
      ],
      fabric: [
        'pale cyan silk with subtle embroidery',
        'moon-white gauze outer layer',
        'soft powder-pink accents',
      ],
    },

    // 身材要求
    bodyRequirements: {
      bodyType: 'slender refined literary beauty',
      emphasis: 'delicate and elegant silhouette matching classical literature descriptions',
    },

    // 場景類型
    sceneTypes: [
      'Xiaoxiang Pavilion with bamboo and rain',
      'Hengwu Garden study room',
      'Grand View Garden courtyard paths',
      'traditional Chinese garden after rain',
    ],

    // 光線偏好
    lighting: {
      keyLight: 'soft diffused rainy day light or warm afternoon window light',
      fillLight: 'gentle courtyard ambient bounce',
      rimLight: 'subtle bamboo shadow edge separation',
      ambience: 'quiet garden soft diffusion with incense haze',
      mood: 'melancholic poetic atmosphere',
    },

    // 攝影風格
    photography: {
      framing: 'classical Chinese painting composition',
      focus: 'soft focus with garden bokeh',
      mood: 'literary period drama cinema quality',
    },

    // 禁止元素
    prohibitions: [
      'no anime hanfu style',
      'no bright saturated colors',
      'no fantasy game costume',
      'no modern makeup aesthetic',
      'must maintain classical literature character authenticity',
    ],

    // 質感要求
    textureRequirements: [
      'authentic Qing Dynasty silk texture',
      'natural skin with literary character delicacy',
      'realistic bamboo and garden environment',
      'soft rainy day lighting diffusion',
      'classical painting atmospheric quality',
    ],

    // 文學考據
    literaryAccuracy: {
      source: 'Dream of the Red Chamber by Cao Xueqin',
      setting: 'Grand View Garden (Daguan Yuan)',
      characters: 'Lin Daiyu (Xiaoxiang Pavilion), Xue Baochai (Hengwu Garden)',
      mood: 'poetic melancholy and aristocratic refinement',
    },
  },

  // 提示詞權重配置
  promptWeights: {
    faceLock: 1.5,
    scene: 1.2,
    costume: 1.2,
    lighting: 1.1,
    style: 1.0,
  },
};
