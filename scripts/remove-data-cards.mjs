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

// 讀取 data.js
const dataFile = path.join(rootDir, "src/data.js");
let content = fs.readFileSync(dataFile, "utf-8");

// 找到 RAW_WORLD_LAYER_PROFILES 的位置
const rawProfilesMatch = content.match(/const RAW_WORLD_LAYER_PROFILES = \[/);
if (!rawProfilesMatch) {
  console.error("找不到 RAW_WORLD_LAYER_PROFILES 定義");
  process.exit(1);
}

console.log("\n開始處理 data.js...");

// 統計刪除數量
let deleteCount = 0;

// 逐個刪除
for (const id of deleteIds) {
  // 嘗試兩種格式：完整物件定義 和 陣列格式

  // 格式1: 完整物件 { id: "xxx", ... }
  const objectPattern = new RegExp(
    `\\s*\\{\\s*id:\\s*["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'],?[\\s\\S]*?\\n\\s*\\},?\\s*\\n`,
    "g"
  );

  if (content.match(objectPattern)) {
    content = content.replace(objectPattern, "");
    deleteCount++;
    continue;
  }

  // 格式2: 陣列格式 [14, "id", ...]
  const arrayPattern = new RegExp(
    `\\s*\\[\\s*\\d+,\\s*["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][\\s\\S]*?\\],?\\s*\\n`,
    "g"
  );

  if (content.match(arrayPattern)) {
    content = content.replace(arrayPattern, "");
    deleteCount++;
  }
}

// 清理多餘的逗號和空行
content = content.replace(/,(\s*),/g, ",");
content = content.replace(/,(\s*)\]/g, "$1]");
content = content.replace(/\n\n\n+/g, "\n\n");

fs.writeFileSync(dataFile, content, "utf-8");

console.log(`\n處理完成！`);
console.log(`  從 data.js 刪除了 ${deleteCount} 張角色卡`);
console.log(`  預期刪除數量: ${deleteIds.size - 26} (已扣除前面刪除的 26 張)`);

if (deleteCount < deleteIds.size - 26) {
  console.log(`\n⚠️  警告: 刪除數量少於預期，可能有些 ID 格式不同`);
  console.log(`   建議檢查 data.js 是否還有殘留`);
}
