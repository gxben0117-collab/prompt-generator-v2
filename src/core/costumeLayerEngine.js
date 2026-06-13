/**
 * Costume Layer Engine - 10層服裝系統
 * Layer 3: Variable, 10-layer realistic wearable clothing physics
 */

/**
 * 從分類 visualDNA 和角色數據生成 10 層服裝系統
 * @param {Object} categoryVisualDNA - 分類的 visualDNA 配置
 * @param {Object} roleCostumeData - 角色卡的服裝數據
 * @returns {Object} 10 層服裝 Prompt
 */
export function generateCostumePrompt(categoryVisualDNA, roleCostumeData) {
  const { costumeStyle, bodyRequirements, textureRequirements, prohibitions } = categoryVisualDNA;
  const { layer1, layer10, layers } = roleCostumeData;

  // Layer 1: 貼身基底層 (Foundation)
  const foundationLayer = layer1 || costumeStyle.layer1;

  // Layer 2-9: 中間服裝層 (由角色卡具體定義)
  const middleLayers = layers || buildDefaultMiddleLayers(costumeStyle);

  // Layer 10: 最終輪廓與概念 (Final Silhouette)
  const silhouetteLayer = layer10 || buildSilhouetteLayer(costumeStyle);

  // 身材要求
  const bodyDescription = buildBodyDescription(bodyRequirements);

  // 質感要求
  const textureDescription = textureRequirements.slice(0, 3).join(', ');

  // 組合完整服裝描述
  const positivePrompt = [
    `costumeLayer1: ${foundationLayer}`,
    `costume middle layers: ${middleLayers}`,
    `costumeLayer10: ${silhouetteLayer}`,
    bodyDescription,
    textureDescription,
  ].join('; ');

  // 禁止元素
  const negativePrompt = prohibitions
    .map(p => p.replace('no ', '').replace('must be ', '').replace('must ', ''))
    .join(', ');

  return {
    positive: positivePrompt,
    negative: negativePrompt,
    weight: 1.3,
    layer: 'costume',
  };
}

/**
 * 構建默認中間層服裝
 */
function buildDefaultMiddleLayers(costumeStyle) {
  const { keywords, fabric } = costumeStyle;
  return keywords.slice(0, 4).join(', ') + '; ' + fabric.slice(0, 2).join(', ');
}

/**
 * 構建最終輪廓層描述
 */
function buildSilhouetteLayer(costumeStyle) {
  const { concept, keywords } = costumeStyle;
  return `${concept}, forming ${keywords[0]} with cinematic silhouette`;
}

/**
 * 構建身材描述
 */
function buildBodyDescription(bodyRequirements) {
  if (!bodyRequirements) return '';

  const parts = [];

  if (bodyRequirements.bust) {
    parts.push(`${bodyRequirements.bust} natural chest volume`);
  }

  if (bodyRequirements.bodyType) {
    parts.push(bodyRequirements.bodyType);
  }

  if (bodyRequirements.emphasis) {
    parts.push(bodyRequirements.emphasis);
  }

  return parts.join(', ');
}

/**
 * 服裝層驗證
 * 確保 10 層系統完整性和物理真實性
 */
export function validateCostumeLayers(costumePrompt) {
  const errors = [];
  const prompt = costumePrompt.positive.toLowerCase();

  // 必須包含 Layer 1 和 Layer 10
  if (!prompt.includes('costumelayer1')) {
    errors.push('Missing costumeLayer1 foundation');
  }

  if (!prompt.includes('costumelayer10')) {
    errors.push('Missing costumeLayer10 final silhouette');
  }

  // 必須描述質感物理
  const physicsKeywords = ['draping', 'fabric', 'texture', 'realistic', 'physics'];
  const hasPhysics = physicsKeywords.some(keyword => prompt.includes(keyword));

  if (!hasPhysics) {
    errors.push('Missing realistic fabric physics description');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 優化服裝描述，避免重複與衝突
 */
export function optimizeCostumePrompt(costumePrompt) {
  let optimized = costumePrompt.positive;

  // 移除重複的材質描述
  const materialWords = ['silk', 'satin', 'velvet', 'gauze', 'chiffon'];
  materialWords.forEach(material => {
    const regex = new RegExp(`\\b${material}\\b`, 'gi');
    const matches = optimized.match(regex);
    if (matches && matches.length > 2) {
      // 保留前兩次出現，移除其他
      let count = 0;
      optimized = optimized.replace(regex, match => {
        count++;
        return count <= 2 ? match : '';
      });
    }
  });

  return {
    ...costumePrompt,
    positive: optimized.replace(/\s+/g, ' ').replace(/[,;]\s*[,;]/g, ', ').trim(),
  };
}
