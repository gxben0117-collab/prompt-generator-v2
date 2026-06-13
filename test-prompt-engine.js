/**
 * Test Script - 測試 Prompt 引擎系統
 */

import { SUCCUBUS_BANQUET_CATEGORY } from '../categories/dark-romance/succubus-banquet.js';
import { buildPrompt, generateQualityReport } from '../core/promptBuilder.js';

// 測試角色卡數據
const testRoleCard = {
  id: 'succubus-01',
  title: '紫蝶夜宴魅魔・暗紫絲絨',
  categoryId: 'succubus-banquet',

  scene: {
    location: 'dark purple velvet bedroom chamber',
    props: [
      'obsidian mirror surface',
      'amethyst wine glass',
      'black rose arrangement',
      'gothic carved screen',
      'low candlelight',
    ],
    timeOfDay: 'midnight',
    weather: null,
  },

  costume: {
    layer1: 'luxury deep purple silk slip nightgown foundation, soft skin-close fabric',
    layers: 'one-piece satin nightgown, deep V neckline, butterfly shoulder veil, jewel shoulder chain, flowing purple-black cape',
    layer10: 'cinematic dark romantic silhouette with gothic luxury nightgown, purple satin and moon-silver veil, mature elegant presence',
  },

  action: {
    pose: 'seated on velvet chair with elegant posture',
    gesture: 'one hand holding amethyst wine glass',
    gaze: 'confident seductive eye contact with camera',
    expression: 'mature mysterious smile',
  },

  style: 'photorealistic',
};

// 生成 Prompt
console.log('=== Testing Prompt Builder ===\n');

const result = buildPrompt(SUCCUBUS_BANQUET_CATEGORY, testRoleCard);

console.log('📋 Role Card:', result.title);
console.log('📁 Category:', result.categoryName);
console.log('🎨 Style:', result.metadata.style);
console.log('📸 Photography:', result.metadata.photographyPreset);
console.log('🔢 Token Count:', result.metadata.tokenCount);
console.log('\n--- POSITIVE PROMPT ---');
console.log(result.prompt.positive);
console.log('\n--- NEGATIVE PROMPT ---');
console.log(result.prompt.negative);

console.log('\n--- VALIDATION ---');
console.log('Face Lock:', result.validation.faceLockValid ? '✅' : '❌');
console.log('Scene:', result.validation.sceneValid ? '✅' : '❌');
console.log('Costume:', result.validation.costumeValid ? '✅' : '❌');
console.log('No Style Conflict:', result.validation.noStyleConflict ? '✅' : '❌');
console.log('All Valid:', result.validation.allValid ? '✅' : '❌');

if (result.warnings.length > 0) {
  console.log('\n⚠️ Warnings:');
  result.warnings.forEach(w => console.log('  -', w));
}

console.log('\n--- QUALITY REPORT ---');
const qualityReport = generateQualityReport(result);
console.log('Overall:', qualityReport.overall);
console.log('Token Efficiency:', qualityReport.tokenEfficiency);
console.log('Validation Status:', qualityReport.validationStatus);

console.log('\n✅ Test completed!');
