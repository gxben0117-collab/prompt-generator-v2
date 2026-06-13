// 修復未使用變數的腳本
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data.js');
let content = fs.readFileSync(filePath, 'utf8');

// 將未使用的常數定義註解掉
const unusedVars = [
  'REQUESTED_DARK_ROYAL_PROFILES',
  'FORMAL_DARK_QUEEN_PROFILES',
  'SUCCUBUS_COUTURE_SERIES_PROFILES',
  'SENSUAL_ELEGANT_ROLE_PROFILES',
  'REQUESTED_SECOND_WAVE_PROFILES',
  'WORLD_LANDMARK_DIVERSE_TRAVEL_PROFILES',
  'WORLD_CULTURAL_LANDMARK_TRAVEL_DEFS',
  'REQUESTED_REFERENCE_IMAGE_PROFILES',
  'REQUESTED_HISTORICAL_PROFILES',
  'REQUESTED_THIRD_WAVE_PROFILES'
];

unusedVars.forEach(varName => {
  const regex = new RegExp(`^const ${varName}`, 'gm');
  content = content.replace(regex, `// Unused: const ${varName}`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ 已註解掉 10 個未使用的變數');
