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

// 處理每個檔案
const filesToProcess = [
  {
    path: "src/profiles/styleReferenceProfiles.js",
    exportName: "STYLE_REFERENCE_PROFILES",
    type: "array-export",
  },
  {
    path: "src/profiles/historicalAndStyleExpansionProfiles.js",
    exportName: "NINTH_WAVE_PROFILE_DEFS",
    type: "array-const",
  },
  {
    path: "src/profiles/modernLifestyleProfiles.js",
    exportName: "EIGHTH_WAVE_PROFILE_DEFS",
    type: "array-const",
  },
];

for (const fileInfo of filesToProcess) {
  const filePath = path.join(rootDir, fileInfo.path);
  const content = fs.readFileSync(filePath, "utf-8");

  // 檢查檔案中有多少 ID 需要刪除
  let foundCount = 0;
  const foundIds = [];

  for (const id of deleteIds) {
    if (content.includes(`"${id}"`) || content.includes(`'${id}'`)) {
      foundCount++;
      foundIds.push(id);
    }
  }

  console.log(`\n${fileInfo.path}:`);
  console.log(`  找到 ${foundCount} 個需要刪除的 ID`);
  if (foundIds.length > 0 && foundIds.length <= 20) {
    console.log(`  ID: ${foundIds.join(", ")}`);
  }
}
