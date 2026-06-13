/**
 * Style Engine - 視覺風格層引擎
 * Layer 5: Variable, choose one visual style (photorealistic/webtoon/Chinese CG)
 */

/**
 * 三種核心視覺風格配置
 */
export const VISUAL_STYLES = {
  // 超寫實攝影風格
  photorealistic: {
    name: 'Photorealistic Cinema',
    description: 'Ultra-realistic photographic quality with natural lighting and texture',
    keywords: [
      'photorealistic cinema quality',
      'natural skin texture',
      'realistic fabric physics',
      'authentic environmental lighting',
      'professional photography aesthetic',
    ],
    negativeKeywords: [
      '3D rendering',
      'game engine',
      'anime style',
      'cartoon',
      'illustrated',
      'digital painting',
      'CG artificial look',
    ],
    weight: 1.0,
  },

  // 韓式網漫 Webtoon 風格
  webtoon: {
    name: 'Korean Webtoon CG',
    description: 'Semi-realistic Korean webtoon illustration style with soft rendering',
    keywords: [
      'Korean webtoon illustration style',
      'semi-realistic character rendering',
      'soft digital painting aesthetic',
      'webtoon color grading',
      'manhwa art style quality',
    ],
    negativeKeywords: [
      'anime chibi',
      'Japanese manga style',
      'pixel art',
      'sketch',
      'overly cartoonish',
    ],
    weight: 1.0,
  },

  // 中式 CG 電影風格
  chineseCG: {
    name: 'Chinese CG Cinema',
    description: 'High-end Chinese fantasy cinema CG with epic atmosphere',
    keywords: [
      'Chinese fantasy cinema CG quality',
      'epic martial arts film aesthetic',
      'high-budget wuxia film rendering',
      'theatrical release quality',
      'Asian cinema production value',
    ],
    negativeKeywords: [
      'low-budget game CG',
      'mobile game graphics',
      'anime style',
      'western CG look',
    ],
    weight: 1.0,
  },
};

/**
 * 生成視覺風格 Prompt
 * @param {string} styleName - 風格名稱 (photorealistic/webtoon/chineseCG)
 * @returns {Object} 風格 Prompt 配置
 */
export function generateStylePrompt(styleName = 'photorealistic') {
  const style = VISUAL_STYLES[styleName];

  if (!style) {
    // Unknown style, falling back to photorealistic
    return generateStylePrompt('photorealistic');
  }

  const positivePrompt = style.keywords.join(', ');
  const negativePrompt = style.negativeKeywords.join(', ');

  return {
    positive: positivePrompt,
    negative: negativePrompt,
    weight: style.weight,
    layer: 'style',
    styleName: style.name,
  };
}

/**
 * 風格衝突檢測
 * 確保不會同時使用多種衝突的視覺風格
 */
export function detectStyleConflicts(fullPrompt) {
  const conflicts = [];
  const styleIndicators = {
    photorealistic: ['photorealistic', 'realistic photo', 'natural lighting'],
    webtoon: ['webtoon', 'manhwa', 'korean illustration'],
    chineseCG: ['chinese cg', 'wuxia film', 'martial arts cinema'],
    anime: ['anime', 'manga style', 'japanese animation'],
    '3d': ['3d rendering', 'game engine', 'cg artificial'],
  };

  const detectedStyles = [];
  const promptLower = fullPrompt.toLowerCase();

  Object.entries(styleIndicators).forEach(([style, indicators]) => {
    if (indicators.some(indicator => promptLower.includes(indicator))) {
      detectedStyles.push(style);
    }
  });

  // 如果檢測到多於一種主要風格，標記為衝突
  if (detectedStyles.length > 1) {
    conflicts.push({
      type: 'style_conflict',
      detected: detectedStyles,
      message: `Multiple conflicting styles detected: ${detectedStyles.join(', ')}`,
    });
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    detectedStyles,
  };
}

/**
 * 根據分類推薦視覺風格
 */
export function recommendStyle(categoryVisualDNA) {
  const { atmosphere, themeGroup } = categoryVisualDNA;

  // 根據主題組推薦
  if (themeGroup?.includes('historical') || themeGroup?.includes('court')) {
    return 'photorealistic'; // 歷史宮廷類用超寫實
  }

  if (themeGroup?.includes('mythology') || themeGroup?.includes('fantasy')) {
    return 'chineseCG'; // 神話奇幻類用中式 CG
  }

  if (themeGroup?.includes('travel-photography')) {
    return 'photorealistic'; // 旅拍類用超寫實
  }

  // 根據氛圍描述推薦
  const atmosphereText = atmosphere ? atmosphere.join(' ').toLowerCase() : '';

  if (atmosphereText.includes('cinema') || atmosphereText.includes('photography')) {
    return 'photorealistic';
  }

  if (atmosphereText.includes('epic') || atmosphereText.includes('martial arts')) {
    return 'chineseCG';
  }

  // 默認使用超寫實
  return 'photorealistic';
}

/**
 * 通用負面 Prompt (適用於所有風格)
 */
export const UNIVERSAL_NEGATIVE = [
  'deformed',
  'disfigured',
  'bad anatomy',
  'bad proportions',
  'extra limbs',
  'missing limbs',
  'watermark',
  'signature',
  'text overlay',
];

/**
 * 生成完整負面 Prompt
 */
export function generateNegativePrompt(styleNegative, categoryProhibitions = []) {
  const allNegative = [
    ...UNIVERSAL_NEGATIVE,
    ...styleNegative,
    ...categoryProhibitions,
  ];

  // 去重並返回
  return [...new Set(allNegative)].join(', ');
}
