import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORLD_LAYER_PROFILES } from "../src/data.js";
import { parentCategoryForProfile } from "../src/categoryClassifier.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const reportPath = path.join(projectRoot, "docs", "reports", "2026-06-12-role-card-quality-audit.md");

const workflowPattern = /全角色卡品質補強|ChatGPT\s*依|姿態由\s*ChatGPT|不要照抄角色卡近中遠原句|與手部動作自然互動|不預設拿/;
const hardPosePattern =
  /45\s*度|四十五度|固定站姿|筆直站立|正中站立|雙手自然垂放|人物站於|人物站在|人物站立/;
const flexibleActionPattern = /坐|倚|靠|扶|持|托|捧|回眸|回身|旋|緩步|前行|走|半蹲|俯|抬手|舞|撫|泡茶|撫琴|牽|搭|整理|觸|指|騎|端坐|停步|提|按|執|借風|前景|穿過|掠過|支撐點|一個主動作|一個動態核心/;
const handheldPattern = /持酒杯|持酒盞|低持酒杯|低持酒盞|端盞|托盞|持權杖|扶權杖|手持燭台|提燈/;
const bedchamberPattern = /寢宮|寵妃|床榻|臥榻|軟榻|王榻|睡衣|私房|臥室|床邊|帷帳|床帳/;
const genericTitlePattern = /^(仙子|女王|皇后|貴妃|仕女|名媛|女爵|女神)$/;

const normalize = (value = "") =>
  String(value)
    .replace(/姿態依[^。；]+/g, "")
    .replace(/姿態安全[^。；]+/g, "")
    .replace(/\s+/g, "")
    .trim();

const originalActionPart = (sceneAction = "") =>
  String(sceneAction)
    .split(/；姿態依|；避免筆直|；姿態安全/)
    .at(0)
    ?.trim() || "";

const keyCount = new Map();
const addKey = (map, key, profile) => {
  if (!key) return;
  const list = map.get(key) || [];
  list.push(profile);
  map.set(key, list);
};

const actionMap = new Map();
const sceneMap = new Map();
const costumeMap = new Map();

for (const profile of WORLD_LAYER_PROFILES) {
  addKey(actionMap, normalize(originalActionPart(profile.sceneAction)), profile);
  addKey(sceneMap, normalize(profile.scene), profile);
  addKey(costumeMap, normalize(profile.costume), profile);
}

const repeated = (map, minCount = 3) =>
  [...map.entries()]
    .filter(([key, profiles]) => key.length > 24 && profiles.length >= minCount)
    .sort((a, b) => b[1].length - a[1].length);

const repeatedActions = repeated(actionMap, 3);
const repeatedScenes = repeated(sceneMap, 3);
const repeatedCostumes = repeated(costumeMap, 3);
const BLOCKING_DUPLICATE_COUNT = 8;

const findings = WORLD_LAYER_PROFILES.map((profile) => {
  const effectiveParentCategory = parentCategoryForProfile(profile);
  const text = [
    profile.title,
    profile.category,
    effectiveParentCategory,
    profile.themeHint,
    profile.costume,
    profile.scene,
    profile.sceneEnvironment,
    profile.sceneAction,
    profile.sceneLighting,
    ...(profile.layers ? Object.values(profile.layers) : []),
  ].join(" ");
  const sceneTopicText = [
    profile.title,
    profile.category,
    effectiveParentCategory,
    profile.themeHint,
    profile.scene,
    profile.sceneEnvironment,
  ].join(" ");
  const baseAction = originalActionPart(profile.sceneAction);

  const issues = [];
  if (workflowPattern.test(text)) issues.push("舊流程詞殘留");
  if (hardPosePattern.test(baseAction) && !flexibleActionPattern.test(profile.sceneAction)) {
    issues.push("姿勢可能寫死");
  }
  if (bedchamberPattern.test(sceneTopicText) && handheldPattern.test(baseAction)) issues.push("寢宮/床榻硬持物風險");
  if (genericTitlePattern.test(String(profile.title || "").trim())) {
    issues.push("標題偏泛用");
  }
  if ((profile.prop || "").length > 0 && /無|無明顯|不使用/.test(profile.prop) && /手持|持|端|托/.test(baseAction)) {
    issues.push("道具欄與動作矛盾");
  }

  const actionDuplicates = actionMap.get(normalize(baseAction))?.length || 0;
  const sceneDuplicates = sceneMap.get(normalize(profile.scene))?.length || 0;
  const costumeDuplicates = costumeMap.get(normalize(profile.costume))?.length || 0;
  if (normalize(baseAction).length > 24 && actionDuplicates >= BLOCKING_DUPLICATE_COUNT) issues.push(`動作描述重複 x${actionDuplicates}`);
  if (normalize(profile.scene).length > 24 && sceneDuplicates >= BLOCKING_DUPLICATE_COUNT) issues.push(`場景描述重複 x${sceneDuplicates}`);
  if (normalize(profile.costume).length > 24 && costumeDuplicates >= BLOCKING_DUPLICATE_COUNT) issues.push(`服裝描述重複 x${costumeDuplicates}`);

  return {
    id: profile.id,
    title: profile.title,
    category: profile.category,
    parentCategory: effectiveParentCategory,
    issues,
    issueCount: issues.length,
  };
}).filter((item) => item.issueCount > 0);

findings.sort((a, b) => b.issueCount - a.issueCount || a.id.localeCompare(b.id));

const countByIssue = new Map();
for (const finding of findings) {
  for (const issue of finding.issues) {
    const issueName = issue.replace(/ x\d+$/, "");
    keyCount.set(issueName, (keyCount.get(issueName) || 0) + 1);
    countByIssue.set(issueName, (countByIssue.get(issueName) || 0) + 1);
  }
}

const issueRows = [...countByIssue.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([issue, count]) => `| ${issue} | ${count} |`)
  .join("\n");

const profileRows = findings
  .slice(0, 80)
  .map((finding) => `| \`${finding.id}\` | ${finding.title} | ${finding.issues.join("；")} |`)
  .join("\n");

const duplicateBlock = (title, entries) => {
  const rows = entries
    .slice(0, 12)
    .map(([key, profiles]) => {
      const ids = profiles.slice(0, 5).map((profile) => `\`${profile.id}\``).join(", ");
      return `| ${profiles.length} | ${ids}${profiles.length > 5 ? ", ..." : ""} | ${key.slice(0, 80)} |`;
    })
    .join("\n");
  return `### ${title}\n\n| 次數 | 代表角色卡 | 重複片段 |\n| ---: | --- | --- |\n${rows || "| 0 | 無 | 無 |"}`;
};

const report = `# 2026-06-12 全角色卡品質審查報告

## 摘要

- 掃描角色卡總數：${WORLD_LAYER_PROFILES.length}
- 需人工審查角色卡：${findings.length}
- 報告目的：只找出需要逐張設計的候選，不批次重寫角色卡。

## 問題類型統計

| 問題 | 數量 |
| --- | ---: |
${issueRows || "| 無 | 0 |"}

## 優先人工審查清單（前 80 張）

| id | title | 問題 |
| --- | --- | --- |
${profileRows || "| 無 | 無 | 無 |"}

${duplicateBlock("重複動作描述", repeatedActions)}

${duplicateBlock("重複場景描述", repeatedScenes)}

${duplicateBlock("重複服裝描述", repeatedCostumes)}

## 建議處理方式

1. 不使用批次重寫。
2. 先從「舊流程詞殘留」「寢宮/床榻硬持物風險」「姿勢可能寫死」開始逐張修。
3. 每張修之前先定義：主題核心、角色身份、場景主視覺、姿勢支撐點、道具邏輯、服裝 Layer 重點、和其他卡的差異。
4. 每完成 5-10 張，執行 \`npm.cmd run check\`。
`;

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");
console.log(JSON.stringify({
  totalProfiles: WORLD_LAYER_PROFILES.length,
  flaggedProfiles: findings.length,
  reportPath,
}, null, 2));
