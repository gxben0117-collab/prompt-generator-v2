/**
 * Face Lock Engine - 咒語鎖臉系統
 * Highest priority layer - preserves uploaded face identity
 */

export const FACE_LOCK_ENGINE = {
  // 強制性臉部保留指令 (Highest Weight)
  mandatory: [
    'preserve uploaded face identity',
    'maintain original facial features',
    'keep natural face asymmetry',
    'retain real skin texture',
    'preserve individual face characteristics',
    'match uploaded photo face structure',
  ],

  // 臉部細節保護
  facialDetails: [
    'keep original eye shape and spacing',
    'maintain natural nose bridge and profile',
    'preserve authentic lip shape',
    'retain real facial bone structure',
    'keep natural skin tone variation',
    'maintain individual facial proportions',
  ],

  // 禁止的臉部修改 (Critical)
  prohibitions: [
    'no AI beauty filter',
    'no face swap',
    'no generic pretty face template',
    'no facial feature standardization',
    'no Instagram beauty filter',
    'no anime face conversion',
    'no game character face template',
  ],

  // Prompt 權重設定
  weight: 1.5,

  // 生成完整臉部鎖定 Prompt
  generate() {
    const mandatoryPrompt = this.mandatory.join(', ');
    const detailsPrompt = this.facialDetails.join(', ');
    const negativePrompt = this.prohibitions.map(p => p.replace('no ', '')).join(', ');

    return {
      positive: `(${mandatoryPrompt}:${this.weight}), ${detailsPrompt}`,
      negative: negativePrompt,
      priority: 'highest',
    };
  },
};

/**
 * 臉部鎖定驗證函數
 * @param {Object} promptConfig - 完整的 prompt 配置
 * @returns {boolean} 是否包含臉部鎖定層
 */
export function validateFaceLock(promptConfig) {
  const required = ['preserve uploaded face', 'maintain original facial'];
  const hasRequired = required.every(keyword =>
    promptConfig.positive.toLowerCase().includes(keyword)
  );

  if (!hasRequired) {
    // Face lock layer missing or incomplete
  }

  return hasRequired;
}
