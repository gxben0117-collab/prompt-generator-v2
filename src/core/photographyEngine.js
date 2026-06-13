/**
 * Photography Engine - 攝影層引擎
 * Layer 4: Fixed or semi-fixed photography technical parameters
 */

/**
 * 標準攝影參數配置
 */
export const PHOTOGRAPHY_PRESETS = {
  // 人像標準配置
  portrait: {
    framing: 'medium close-up portrait, upper body visible',
    focus: 'shallow depth of field, f/2.8 equivalent',
    lens: '85mm portrait lens equivalent',
    angle: 'eye-level natural perspective',
    composition: 'rule of thirds, balanced composition',
  },

  // 全身人像配置
  fullBody: {
    framing: 'full body portrait, head to toe visible',
    focus: 'moderate depth of field, f/4 equivalent',
    lens: '50mm standard lens equivalent',
    angle: 'slight low angle for elegance',
    composition: 'centered with environmental context',
  },

  // 電影級構圖
  cinematic: {
    framing: 'cinematic wide composition',
    focus: 'cinematic depth with environmental bokeh',
    lens: 'anamorphic cinema lens aesthetic',
    angle: 'dynamic dramatic angle',
    composition: 'epic scale with architecture or landscape context',
  },

  // 旅拍攝影
  travelPhotography: {
    framing: 'travel photography scale, subject with epic landscape',
    focus: 'balanced depth showing both subject and environment',
    lens: '35mm wide-angle lens equivalent',
    angle: 'eye-level or slight low angle for grandeur',
    composition: 'subject as focal point within vast scene',
  },
};

/**
 * 生成攝影層 Prompt
 * @param {Object} categoryVisualDNA - 分類的 visualDNA 配置
 * @param {string} presetType - 預設類型 (portrait/fullBody/cinematic/travelPhotography)
 * @returns {Object} 攝影 Prompt 配置
 */
export function generatePhotographyPrompt(categoryVisualDNA, presetType = 'portrait') {
  const categoryPhotography = categoryVisualDNA.photography || {};
  const preset = PHOTOGRAPHY_PRESETS[presetType] || PHOTOGRAPHY_PRESETS.portrait;

  // 合併分類特定設定與預設
  const photography = {
    ...preset,
    ...categoryPhotography,
  };

  // 構建攝影描述
  const photographyDescription = [
    photography.framing,
    photography.focus,
    photography.lens,
    photography.angle,
    photography.composition,
  ].filter(Boolean).join(', ');

  // 攝影情緒/風格
  const moodDescription = photography.mood || 'professional photography quality';

  return {
    positive: `${photographyDescription}, ${moodDescription}`,
    weight: 1.1,
    layer: 'photography',
  };
}

/**
 * 通用技術品質參數 (精簡版，避免重複)
 */
export const TECHNICAL_QUALITY = {
  resolution: 'professional high resolution',
  detail: 'sharp focus with natural detail',
  clarity: 'clean image quality',
};

/**
 * 生成技術品質 Prompt (精簡，避免 token 浪費)
 */
export function generateTechnicalQuality() {
  const { resolution, detail, clarity } = TECHNICAL_QUALITY;
  return `${resolution}, ${detail}, ${clarity}`;
}

/**
 * 負面技術參數 (精簡版)
 */
export const TECHNICAL_NEGATIVE = [
  'blurry',
  'low quality',
  'distorted',
  'pixelated',
  'overexposed',
  'underexposed',
];

/**
 * 攝影層優化 - 移除重複的技術參數
 */
export function optimizePhotographyPrompt(photographyPrompt) {
  let optimized = photographyPrompt.positive;

  // 檢查是否已經包含類似的技術參數
  const technicalKeywords = ['depth of field', 'lens', 'focus', 'resolution', 'quality'];

  technicalKeywords.forEach(keyword => {
    const regex = new RegExp(`[^,;]*${keyword}[^,;]*`, 'gi');
    const matches = optimized.match(regex);

    if (matches && matches.length > 1) {
      // 保留第一個最具體的描述，移除重複
      optimized = optimized.replace(regex, (match, offset) => {
        return offset === optimized.search(regex) ? match : '';
      });
    }
  });

  return {
    ...photographyPrompt,
    positive: optimized.replace(/\s+/g, ' ').replace(/[,;]\s*[,;]/g, ', ').trim(),
  };
}

/**
 * 根據分類自動選擇攝影預設
 */
export function selectPhotographyPreset(categoryVisualDNA) {
  const { photography, atmosphere } = categoryVisualDNA;

  // 根據氛圍關鍵詞判斷
  const atmosphereText = atmosphere ? atmosphere.join(' ').toLowerCase() : '';

  if (atmosphereText.includes('epic') || atmosphereText.includes('travel photography')) {
    return 'travelPhotography';
  }

  if (atmosphereText.includes('cinema') || atmosphereText.includes('cinematic')) {
    return 'cinematic';
  }

  if (photography?.framing?.includes('full body')) {
    return 'fullBody';
  }

  return 'portrait';
}
