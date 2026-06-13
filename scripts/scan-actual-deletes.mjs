import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 要刪除的 6 個父分類
const deleteCategories = [
  "水下龍宮海國",
  "埃及豔后／尼羅河女兒／埃及神話女神",
  "世界景點旅拍",
  "現代都市 / 街拍電影",
  "現代都市夜景",
  "室內生活寫真",
];

console.log("要刪除的父分類:");
deleteCategories.forEach((cat, i) => console.log(`  ${i + 1}. ${cat}`));

// 讀取 data.js
const dataFile = path.join(rootDir, "src/data.js");
let content = fs.readFileSync(dataFile, "utf-8");

console.log("\n掃描 data.js 中的角色卡...");

let deleteCount = 0;
const deletedIds = [];

// 使用正則表達式匹配所有角色卡物件
const profilePattern = /\{[\s\S]*?id:\s*["']([^"']+)["'][\s\S]*?(?:parentCategory|category):\s*["']([^"']+)["'][\s\S]*?\}/g;

let match;
const profiles = [];
while ((match = profilePattern.exec(content)) !== null) {
  profiles.push({
    id: match[1],
    category: match[2],
    startPos: match.index,
    fullMatch: match[0],
  });
}

console.log(`  找到 ${profiles.length} 個角色卡定義`);

// 檢查哪些需要刪除
for (const profile of profiles) {
  if (deleteCategories.some(cat => profile.category.includes(cat))) {
    deletedIds.push(profile.id);
    deleteCount++;
  }
}

console.log(`\n需要刪除的角色卡數量: ${deleteCount}`);
console.log("\n前 20 個要刪除的 ID:");
deletedIds.slice(0, 20).forEach((id, i) => console.log(`  ${i + 1}. ${id}`));

// 保存到新的 delete-ids.json
const deleteIdsFile = path.join(rootDir, "delete-ids-actual.json");
fs.writeFileSync(deleteIdsFile, JSON.stringify(deletedIds, null, 2), "utf-8");
console.log(`\n已保存到: delete-ids-actual.json`);
