/**
 * Prompt Builder - 五層模組化 Prompt 組裝引擎
 * Assembles all 5 layers into final optimized prompt
 */

import { FACE_LOCK_ENGINE, validateFaceLock } from './faceLockEngine.js';
import { generateScenePrompt, validateScene, optimizeScenePrompt } from './sceneEngine.js';
import { generateCostumePrompt, validateCostumeLayers, optimizeCostumePrompt } from './costumeLayerEngine.js';
import { generatePhotographyPrompt, selectPhotographyPreset, optimizePhotographyPrompt, generateTechnicalQuality } from './photographyEngine.js';
import { generateStylePrompt, detectStyleConflicts, recommendStyle, generateNegativePrompt } from './styleEngine.js';

/**
 * 主 Prompt 構建器
 * @param {Object} category - 分類對象 (包含 visualDNA)
 * @param {Object} roleCard - 角色卡數據
 * @param {Object} options - 可選配置
 * @returns {Object} 完整的 Prompt 配置
 */
export function buildPrompt(category, roleCard, options = {}) {
  const { visualDNA } = category;
  const {
    styleOverride = null,
    photographyPreset = null,
    includeTitle = true,
  } = options;

  // === Layer 1: Face Lock (Highest Priority) ===
  const faceLock = FACE_LOCK_ENGINE.generate();

  // === Layer 2: Scene (Variable) ===
  const scenePrompt = generateScenePrompt(visualDNA, roleCard.scene);
  const sceneValidation = validateScene(scenePrompt, visualDNA);

  if (!sceneValidation.valid) {
    // Scene validation failed - errors logged in development
  }

  const optimizedScene = optimizeScenePrompt(scenePrompt);

  // === Layer 3: Costume (Variable, 10-layer system) ===
  const costumePrompt = generateCostumePrompt(visualDNA, roleCard.costume);
  const costumeValidation = validateCostumeLayers(costumePrompt);

  if (!costumeValidation.valid) {
    // Costume validation failed - errors logged in development
  }

  const optimizedCostume = optimizeCostumePrompt(costumePrompt);

  // === Layer 4: Photography (Fixed/Semi-fixed) ===
  const selectedPreset = photographyPreset || selectPhotographyPreset(visualDNA);
  const photographyPrompt = generatePhotographyPrompt(visualDNA, selectedPreset);
  const optimizedPhotography = optimizePhotographyPrompt(photographyPrompt);

  // === Layer 5: Visual Style (Variable) ===
  const selectedStyle = styleOverride || roleCard.style || recommendStyle(visualDNA);
  const stylePrompt = generateStylePrompt(selectedStyle);

  // === Lighting (從 visualDNA 提取) ===
  const lightingPrompt = buildLightingPrompt(visualDNA.lighting);

  // === Action/Pose (從角色卡提取) ===
  const actionPrompt = roleCard.action ? buildActionPrompt(roleCard.action) : '';

  // === 組裝完整正面 Prompt ===
  const positiveComponents = [
    faceLock.positive,
    optimizedScene.positive,
    lightingPrompt,
    optimizedCostume.positive,
    actionPrompt,
    optimizedPhotography.positive,
    stylePrompt.positive,
    generateTechnicalQuality(),
  ].filter(Boolean);

  const fullPositivePrompt = positiveComponents.join(', ');

  // === 風格衝突檢測 ===
  const conflictCheck = detectStyleConflicts(fullPositivePrompt);
  if (conflictCheck.hasConflict) {
    // Style conflicts detected - logged in development
  }

  // === 組裝完整負面 Prompt ===
  const negativeComponents = [
    faceLock.negative,
    optimizedCostume.negative,
    stylePrompt.negative,
  ].filter(Boolean);

  const fullNegativePrompt = generateNegativePrompt(
    negativeComponents.join(', ').split(', '),
    visualDNA.prohibitions || []
  );

  // === 最終驗證 ===
  const faceLockValid = validateFaceLock({ positive: fullPositivePrompt });

  // === 返回完整配置 ===
  return {
    title: includeTitle ? roleCard.title : null,
    categoryId: category.id,
    categoryName: category.name,
    roleCardId: roleCard.id,

    prompt: {
      positive: fullPositivePrompt,
      negative: fullNegativePrompt,
    },

    metadata: {
      style: selectedStyle,
      photographyPreset: selectedPreset,
      tokenCount: estimateTokenCount(fullPositivePrompt),
      layers: {
        faceLock: faceLock.positive.substring(0, 50) + '...',
        scene: optimizedScene.positive.substring(0, 50) + '...',
        costume: optimizedCostume.positive.substring(0, 50) + '...',
        photography: optimizedPhotography.positive.substring(0, 50) + '...',
        style: stylePrompt.positive.substring(0, 50) + '...',
      },
    },

    validation: {
      faceLockValid,
      sceneValid: sceneValidation.valid,
      costumeValid: costumeValidation.valid,
      noStyleConflict: !conflictCheck.hasConflict,
      allValid: faceLockValid && sceneValidation.valid && costumeValidation.valid && !conflictCheck.hasConflict,
    },

    warnings: [
      ...(!faceLockValid ? ['Face lock validation failed'] : []),
      ...(sceneValidation.errors || []),
      ...(costumeValidation.errors || []),
      ...(conflictCheck.conflicts.map(c => c.message) || []),
    ],
  };
}

/**
 * 構建光線 Prompt
 */
function buildLightingPrompt(lighting) {
  if (!lighting) return '';

  const components = [
    lighting.keyLight,
    lighting.fillLight,
    lighting.rimLight,
    lighting.ambience,
    lighting.specialEffect,
  ].filter(Boolean);

  return components.slice(0, 3).join(', '); // 最多 3 個光線描述避免過長
}

/**
 * 構建動作/姿態 Prompt
 */
function buildActionPrompt(action) {
  if (!action) return '';

  const components = [
    action.pose,
    action.gesture,
    action.gaze,
    action.expression,
  ].filter(Boolean);

  return components.join(', ');
}

/**
 * 估算 Token 數量 (粗略估計：英文單詞數 × 1.3)
 */
function estimateTokenCount(prompt) {
  const words = prompt.split(/\s+/).length;
  return Math.ceil(words * 1.3);
}

/**
 * 批量構建 Prompt (用於角色卡批次生成)
 */
export function buildPromptBatch(category, roleCards, options = {}) {
  return roleCards.map(roleCard => buildPrompt(category, roleCard, options));
}

/**
 * Prompt 品質檢查報告
 */
export function generateQualityReport(builtPrompt) {
  const { validation, metadata, warnings } = builtPrompt;

  return {
    overall: validation.allValid ? 'PASS' : 'FAIL',
    tokenCount: metadata.tokenCount,
    tokenEfficiency: metadata.tokenCount < 150 ? 'EXCELLENT' : metadata.tokenCount < 200 ? 'GOOD' : 'NEEDS_OPTIMIZATION',
    validationStatus: {
      faceLock: validation.faceLockValid ? '✅' : '❌',
      scene: validation.sceneValid ? '✅' : '❌',
      costume: validation.costumeValid ? '✅' : '❌',
      styleConflict: validation.noStyleConflict ? '✅ No conflict' : '❌ Conflict detected',
    },
    warnings: warnings.length > 0 ? warnings : ['No warnings'],
  };
}
