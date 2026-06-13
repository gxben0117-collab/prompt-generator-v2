import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 讀取要刪除的 ID 列表
const deleteIdsPath = path.join(rootDir, "delete-ids.json");
const deleteIds = new Set(JSON.parse(fs.readFileSync(deleteIdsPath, "utf-8")));

console.log(`要刪除的 ID 總數: ${deleteIds.size}`);

// 處理 modernLifestyleProfiles.js
const modernFile = path.join(rootDir, "src/profiles/modernLifestyleProfiles.js");
let modernContent = fs.readFileSync(modernFile, "utf-8");

// 要刪除的 9 個 ID
const modernDeleteIds = [
  "eighth-london-tower-bridge-trench",
  "eighth-dubai-burj-khalifa-gold",
  "eighth-sydney-opera-house-silk",
  "eighth-loft-window-knit-lifestyle",
  "eighth-library-desk-cardigan-reader",
  "eighth-bedroom-morning-shirt",
  "eighth-seoul-record-store-street",
  "eighth-tokyo-crosswalk-editor",
  "eighth-bangkok-rooftop-linen",
];

// 找到每個物件的範圍並刪除
for (const id of modernDeleteIds) {
  // 找到 id: "xxx" 的行
  const idPattern = new RegExp(`\\s*\\{\\s*id:\\s*["']${id}["'][\\s\\S]*?\\n\\s*\\},?\\s*\\n`, "g");
  modernContent = modernContent.replace(idPattern, "");
}

fs.writeFileSync(modernFile, modernContent, "utf-8");
console.log(`\n處理完成: modernLifestyleProfiles.js`);
console.log(`  刪除了 ${modernDeleteIds.length} 張角色卡`);

// 處理 styleReferenceProfiles.js
const styleFile = path.join(rootDir, "src/profiles/styleReferenceProfiles.js");
let styleContent = fs.readFileSync(styleFile, "utf-8");

const styleDeleteIds = [
  "style-ref-flower-window-qipao",
  "style-ref-stardust-silver-evening-muse",
  "style-ref-champagne-wine-bar-gown-diva",
  "style-ref-morning-private-suite-heiress",
  "style-ref-sunset-bay-white-shirt-traveler",
  "style-ref-pink-pet-clinic-nurse",
  "style-ref-pink-cat-ear-clinic-assistant",
  "style-ref-bangkok-golden-temple-traveler",
  "style-ref-white-peony-qipao-club-lady",
  "style-ref-indoor-window-knit-lifestyle",
  "style-ref-indoor-bookstore-cardigan-reader",
  "style-ref-indoor-kitchen-apron-tea-hostess",
  "style-ref-banquet-colorprint-slip-dress",
  "style-ref-redwine-stargown-bar-fantasy",
  "style-ref-purple-holographic-crystal-bar",
  "style-ref-paris-cafe-cream-blouse-afternoon",
  "style-ref-modern-black-gold-queen",
];

for (const id of styleDeleteIds) {
  const idPattern = new RegExp(`\\s*\\{\\s*id:\\s*["']${id}["'][\\s\\S]*?\\n\\s*\\},?\\s*\\n`, "g");
  styleContent = styleContent.replace(idPattern, "");
}

fs.writeFileSync(styleFile, styleContent, "utf-8");
console.log(`\n處理完成: styleReferenceProfiles.js`);
console.log(`  刪除了 ${styleDeleteIds.length} 張角色卡`);

console.log(`\n總共刪除: ${modernDeleteIds.length + styleDeleteIds.length} 張角色卡`);
console.log(`剩餘需要從 data.js 刪除: ${deleteIds.size - modernDeleteIds.length - styleDeleteIds.length} 張`);
