# AI-TASK

---

## 全專案審查報告 v2

日期：2026-06-02（第二次，Codex 執行後重新掃描）
版本：APP_VERSION `v1.28`（最新 commit：`112e309 Fix role data guards and shorten pose safety prompt`）
狀態：tests **47/47** 通過，git 乾淨

---

## Codex 已完成事項確認

| 任務 | 結果 | 備註 |
|------|------|------|
| 刪除 4 個重複 ROLE_SUGGESTION_ITEMS ID | ✅ 已完成 | `duplicateIds: []` 驗證通過 |
| 新增 id 唯一性測試 | ✅ 已完成 | L219-222 in tests |
| 新增 category 可見性測試（三層判斷） | ✅ 已完成 | L224-238 in tests |
| 縮短 `safePosePriorityText()` | ✅ 已完成 | 現在 L782，約 45 字 |
| 移除重複的長版肩頸安全句 | ✅ 已完成 | buildActionCinematographyText 已清理 |

---

## 此次新發現問題

---

### 🔴 BUG：115 個 ROLE_SUGGESTION_ITEMS 在父分類篩選中完全隱形

**背景**：
- UI 的父分類按鈕（`PARENT_ROLE_CATEGORIES`）透過 `parentCategoryForProfile()` 做 keyword 比對
- 測試的三層判斷第三層用 `item.category.includes(parentLabel)` 放寬了判斷，但 UI 實際用的是 `parentCategoryForProfile()` 的 keyword 比對

**實測結果**：
- 1445 個 category 不在 ROLE_CATEGORIES 的 ROLE_SUGGESTION_ITEMS 中
- 其中 **115 個（26 種 category）** 連 `parentCategoryForProfile()` 都無法比對到父分類
- 這 115 個項目只在「全部」時才看得到，點任何父分類按鈕都不會出現

**26 種真正隱形的 category（抽樣）**：
```
漢代皇朝／富家千金／中國歷代服裝
漢代皇朝／大官之女／中國歷代服裝
漢代皇朝／歌伎／中國歷代服裝
宋代皇朝／富家千金／中國歷代服裝
高級性感歌伎系／中國歷代服裝
宋韻雅宴／點茶畫屏／中國歷代服裝
魏晉風流／錦照瓊席／中國歷代服裝
漢代宮闕／流燈華儀／中國歷代服裝
```

**根本原因**：`categoryClassifier.js` 的「中國歷代服裝」parent 的 keywords 缺少「富家千金」、「大官之女」、「歌伎系」、「漢代」、「宋代」、「魏晉」、「隋宮」、「宮闕」等朝代與身份詞。

**修法（兩擇一）**：

方案 A（推薦）：在 `src/categoryClassifier.js` 的「中國歷代服裝」keywords 加入：
```js
"漢代", "魏晉", "隋", "元代", "明代", "民國",
"宮闕", "雅宴", "雅集", "花朝", "華宴",
"富家千金", "大官之女", "歌伎系", "宮廷名姬",
```

方案 B：同時讓 test 的三層判斷改用 `parentCategoryForProfile()` 做最終實際驗證（而非 string.includes），確保測試與 UI 行為一致。

**驗證**：執行方案 A 後，重跑節點腳本，truly unmatched 應從 115 降到 0。

---

### 🟡 測試第三層判斷與 UI 實際行為不一致

**檔案**：`tests/promptEngine.test.js` L224-238

**問題**：
```js
if ([...PARENT_CATEGORY_LABELS].some((label) => item.category.includes(label))) return false;
```
這行以「category 字串包含 parent label」做放行，但 UI 實際用 `parentCategoryForProfile()` keyword 比對。兩者結果不同（115 個項目通過測試、但在 UI 不會出現在任何父分類下）。

**修法**：測試應同步改為呼叫 `parentCategoryForProfile(item)` 做最終判斷，讓測試與 UI 行為完全一致：
```js
it("keeps role suggestion categories visible through direct or parent category routing", () => {
  const directCategories = new Set(ROLE_CATEGORIES);
  const orphans = ROLE_SUGGESTION_ITEMS.filter((item) => {
    if (directCategories.has(item.category)) return false;
    return !parentCategoryForProfile({
      id: item.id, title: item.label, themeHint: item.label, category: item.category,
    });
  });
  expect(orphans.map((item) => `${item.id}: ${item.category}`)).toEqual([]);
});
```

**注意**：改完測試後，需先完成「方案 A」修 categoryClassifier，否則測試會先失敗。

---

### 🟡 `safePosePriorityText()` 仍被呼叫 2 次（可接受）

**檔案**：`src/promptEngine.js` L823、L831

**狀況**：兩次呼叫分別在 `buildActionCinematographyText()` 的兩個 if/else 分支（有 action vs 無 action），每次出圖只會執行其中一次，**不是真正的重複**。本次確認此設計是合理的，不需要修改。

---

### 🟡 `seventhWaveProfiles.js` 格式異常（56KB / 143 行）

**檔案**：`src/seventhWaveProfiles.js`

**狀況**：
- `wc -l` 顯示 143 行，但 `du -sh` 顯示 56KB
- 平均每行 ~400 bytes，代表使用超長內聯陣列格式（每個 profile 一行，但行極長）
- 這種格式可讀性很低，且 ESLint/格式化工具不容易處理

**建議**：
1. 短期：確認 `npm run lint` 無警告（目前通過）
2. 中期：考慮改寫為多行格式（參考 fourthWaveProfiles.js 的可讀格式），方便 diff review

---

### 🟡 data.js 持續膨脹，已超過 build 閾值

**狀況**：864KB、7445 行，vite chunkSizeWarningLimit=800KB 已超過

**現有緩解措施**：sixthWave / seventhWave 已獨立分檔，data.js 只 import 聚合

**問題**：data.js 內仍有大量直接定義的 WORLD_LAYER_PROFILES 資料，未來若再繼續新增，800KB 閾值問題會持續

**具體建議**：
- 下一波角色卡（如有）建立 `eighthWaveProfiles.js`，pattern 同 sixth/seventh
- 目前不需要強制分拆，但 lint 腳本應加入行數上限 warning（建議 ≤ 7600 行）

---

## Prompt 長度現況（重測）

| 案例 | 長度 | 備註 |
|------|------|------|
| 大唐西域公主（基本） | 2023 字 | |
| 暗黑王族夜宴魅魔 | 2281 字 | 暗黑安全條款加長 |
| 敦煌飛天舞姬（有動作） | 1894 字 | 場景詞短 |
| 都市電影女主（有 sceneEnv） | 1929 字 | |
| 目標（舊設定） | 1000-1300 字 | 目前不建議強行達成 |

**Codex 判斷確認正確**：Prompt 剩餘長度來自不可壓縮的核心安全層（鎖臉、人體骨架、風格、負面詞）。強行壓縮會破壞出圖穩定性，建議維持現狀。

---

## 完整動作清單（供 Codex 執行）

### P0 — 即修（影響 UI 可見性）

#### Task 1：補充 categoryClassifier.js 的「中國歷代服裝」keywords

**檔案**：`src/categoryClassifier.js`

找到「中國歷代服裝」parent（約 L139-165），在 keywords 陣列加入：
```js
"漢代", "魏晉", "隋宮", "元代", "宮闕", "雅宴", "雅集",
"花朝", "花殿", "華宴", "盛節", "富家千金", "大官之女",
"歌伎系", "宮廷名姬", "性感歌伎",
```

**驗證**：執行以下 Node 片段，truly unmatched 應 = 0：
```js
import { ROLE_SUGGESTION_ITEMS, ROLE_CATEGORIES } from './src/data.js';
import { parentCategoryForProfile } from './src/categoryClassifier.js';
const cats = new Set(ROLE_CATEGORIES);
const orphans = ROLE_SUGGESTION_ITEMS.filter(i => !cats.has(i.category)).filter(i => {
  return !parentCategoryForProfile({ id: i.id, title: i.label, themeHint: i.label, category: i.category });
});
console.log('truly unmatched:', orphans.length); // 期望 0
```

---

#### Task 2：修正測試讓它與 UI 行為一致

**檔案**：`tests/promptEngine.test.js`

將 L224-238 的測試改為只用 `parentCategoryForProfile()` 做最終判斷（移除 `includes(label)` 放寬層）：
```js
it("keeps role suggestion categories visible through direct or parent category routing", () => {
  const directCategories = new Set(ROLE_CATEGORIES);
  const orphans = ROLE_SUGGESTION_ITEMS.filter((item) => {
    if (directCategories.has(item.category)) return false;
    return !parentCategoryForProfile({
      id: item.id,
      title: item.label,
      themeHint: item.label,
      category: item.category,
    });
  });
  expect(orphans.map((item) => `${item.id}: ${item.category}`)).toEqual([]);
});
```

**注意**：Task 1 必須先完成，否則此 Task 會讓測試失敗。

**驗證**：`npm run test` 47/47 通過（不減少）。

---

### P1 — 中優先級

#### Task 3：seventhWaveProfiles.js 格式化（可選）

**檔案**：`src/seventhWaveProfiles.js`

使用 Prettier 或手動重格式化，讓每個 profile 欄位多行顯示，方便日後 code review。

---

#### Task 4：lint.mjs 加入 data.js 行數保護

**檔案**：`scripts/lint.mjs`（或 `tests/promptEngine.test.js`）

加入 data.js 行數斷言：
```js
import { readFileSync } from 'fs';
const lines = readFileSync('./src/data.js', 'utf8').split('\n').length;
if (lines > 7600) throw new Error(`data.js 已超過 7600 行（目前 ${lines} 行），請考慮拆分至新的 wave profiles 檔案。`);
```

---

## 已排除不需要修的事項

| 事項 | 結論 |
|------|------|
| `safePosePriorityText` 被呼叫 2 次 | ✅ 合理（if/else 兩個 branch，每次只執行一次） |
| 1445 個「orphan」category（大部分） | ✅ 實際上透過 parentCategoryForProfile 可正確歸類，只有 115 個是真正問題 |
| Prompt 壓縮到 1000-1300 字 | ❌ 不建議（會破壞核心安全層，目前 1894-2281 字已是合理區間） |
| data.js 立即分拆 | ⏸ 暫緩（不阻斷上架，留待下一波角色卡時機） |

---

## 目前完整檔案規模

| 檔案 | 行數 | 大小 |
|------|------|------|
| src/data.js | 7445 | 864KB |
| src/fifthWaveProfiles.js | 1810 | 76KB |
| src/seventhWaveProfiles.js | 143（超長行）| 56KB |
| src/promptEngine.js | 1055 | 68KB |
| src/main.js | 921 | 44KB |
| src/fourthWaveProfiles.js | 765 | 40KB |
| src/sixthWaveProfiles.js | 250 | 16KB |
| src/categoryClassifier.js | 356 | 16KB |
| src/coreSpec.js | — | 12KB |

---

## 關鍵函數位置（Codex 修改後更新）

| 函數 | 行號（約） |
|------|-----------|
| `buildChatGptInstruction()` | L1001 |
| `buildFinalIdentityText()` | L443 |
| `buildFinalCostumeText()` | L450 |
| `buildFinalSceneText()` | L466 |
| `buildFinalActionText()` | L475 |
| `safePosePriorityText()` | L781（縮短後） |
| `buildSceneVisualDetailText()` | L785 |
| `buildActionCinematographyText()` | L817 |
| `expandSceneToDirectorFields()` | L941 |

---

## 歷史記錄

### 2026-05-30 深度分析（Claude Opus 4.7）

判斷 Prompt 重複率 30-40%，建議壓縮 `buildChatGptInstruction` 至 1000-1300 字。

主要建議：
- ✅ 合併 `buildFinalIdentityText()` 重複內容 → 已完成
- ✅ 簡化 `buildFinalActionText()` → 已完成
- ✅ 簡化 `buildFinalSceneText()` layeredLens → 已完成
- ✅ 縮短 `safePosePriorityText()` → 已完成（Codex）

### 2026-06-02 Codex 執行結果

- 4 個重複 ID → 已刪除
- 2 個新測試（id 唯一性 + category 可見性）→ 已加入
- `safePosePriorityText()` → 已縮短為 45 字
- tests: 45 → **47** 通過
- Prompt 長度：2317 → **1894-2281** 字（依主題而異）

### 2026-06-02 第二次審查（此次）

- 發現 115 個 ROLE_SUGGESTION_ITEMS 在父分類篩選中真正隱形（Task 1、2）
- 確認 safePosePriorityText 雙次呼叫是合理設計
- 確認測試的第三層判斷（string.includes）與 UI 行為不完全一致
- 確認 Prompt 壓縮目標不需要強行達成

---

## Codex 後續處理結果 v2（2026-06-02）

執行者：Codex  
處理範圍：依 Claude v2 報告修正父分類可見性與測試一致性，不碰 prompt 母板、不重構資料檔。

### 已完成

#### 1. 補強「中國歷代服裝」父分類 keywords

已更新 `src/categoryClassifier.js` 的 `中國歷代服裝` parent keywords，加入朝代、宮廷空間與身份詞：

- `漢代`
- `宋代`
- `魏晉`
- `隋宮`
- `元代`
- `明代`
- `宮闕`
- `宮燈華裳`
- `雅宴`
- `雅集`
- `花朝`
- `花殿`
- `華宴`
- `盛節`
- `富家千金`
- `大官之女`
- `歌伎`
- `歌伎系`
- `宮廷名姬`
- `性感歌伎`

#### 2. 修正 category 可見性測試，讓測試與 UI 行為一致

已更新 `tests/promptEngine.test.js`：

- 移除 `item.category.includes(parentLabel)` 的放寬判斷。
- 最終可見性改以 `parentCategoryForProfile()` 為準，與 UI 父分類按鈕使用同一套邏輯。
- 因此此測試現在能抓到「字串看似有父分類，但 UI keyword 實際比不到」的問題。
- 此測試資料量較大，已將單測 timeout 設為 20000ms。

### 複核結果

使用實際 UI 分類器核對：

```text
trulyUnmatched: 0
categoryCount: 0
sample: []
```

測試結果：

```text
npm.cmd run test
47 tests passed
```

### CI 追修

第一次推送 `05f0d7f` 後，GitHub Actions 在嚴格 category 可見性測試超時。根因不是分類失敗，而是測試逐筆對 1500+ ROLE_SUGGESTION_ITEMS 重複執行 parentCategoryForProfile，GitHub runner 較慢導致 20s timeout。

已追修 `tests/promptEngine.test.js`：先依 category 取代表項目，再以 parentCategoryForProfile 驗證每種 category 的 UI 父分類可見性。測試語意不放寬，仍與 UI 行為一致，但避免同一 category 重複計算。

追修後：

```text
npm.cmd run test
47 tests passed

npm.cmd run check
passed
```

---

## Codex 再次全專案檢查與重新上架紀錄（2026-06-02）

執行者：Codex  
基準 commit：`d968883 Speed up category routing guard test`

### 本輪目的

依使用者要求，再執行一次完整專案檢查；若無問題，更新此交接檔並重新推送上架。

### 本輪檢查結果

```text
npm.cmd run check
passed
```

包含：

- `sync:spec`：通過，已同步 `src/coreSpec.js`
- `lint`：通過
- `test`：47 tests passed
- `build`：通過，已重建 standalone `index.html`
- `verify:ui`：通過
  - desktop：153 controls、無 horizontal overflow、consoleErrors 0
  - mobile：153 controls、無 horizontal overflow、consoleErrors 0

### 注意事項

仍有既有 Vite 大 chunk warning：

```text
Some chunks are larger than 800 kB after minification.
```

此為目前單頁資料量大的已知提醒，不阻斷輸出與上架。未在本輪處理 data.js 分拆。

### 結論

本輪沒有新增功能變更；只做再次全專案驗證、更新 AI-TASK.md，並準備重新上架。

### Codex 補充說明

Claude v2 報告提到 115 個真正隱形項目；Codex 以目前 repo 狀態重測時為 74 個、18 種 category。修正後已歸零。差異推測來自掃描版本或判斷條件不同，但問題方向成立。

本輪未處理項目：

- `seventhWaveProfiles.js` 格式化：暫緩，避免產生大 diff。
- `data.js` 行數保護：暫緩，可於下一波大量新增角色卡前加入。
- prompt 長度壓縮：維持現狀，不再硬壓，以免破壞鎖臉與真人骨架安全層。
