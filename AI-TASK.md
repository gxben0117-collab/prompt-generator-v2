# AI-TASK

---

## 全專案審查報告

日期：2026-06-02  
版本：APP_VERSION `v1.28`  
狀態：tests 45/45 通過，git 乾淨，GitHub Pages 已上線

---

## 舊任務對照（2026-05-30 → 已執行狀況）

| 舊建議 | 狀態 | 備註 |
|--------|------|------|
| 合併 `buildFinalIdentityText()` 重複內容（修改 3） | ✅ 已完成 | 現在 L443-448，2 句，清晰 |
| 簡化 `buildFinalActionText()`（修改 4） | ✅ 已完成 | 現在 L475-481，已精簡 |
| 簡化 `buildFinalSceneText()` layeredLens（修改 2） | ✅ 已完成 | directorLens 已縮短 |
| 簡化 `safePosePriorityText()`（修改 1） | ⚠️ 部分 | 函數本身已縮短，但仍 250+ 字且在 `buildActionCinematographyText` 被呼叫 **2 次**（L823、L832），每次輸出重複 |
| 壓縮 Prompt 到 1000-1300 字 | ⚠️ 部分 | 實測簡單案例「大唐西域公主」已降至 **2023 字**，仍超目標 |

---

## 新發現問題（此次全掃描）

---

### 🔴 緊急 BUG：4 個重複 ROLE_SUGGESTION_ITEMS ID

**檔案**：`src/data.js`

**重複的 id**：
- `antarctic-penguin-photo-traveler`（L80 & L2837）
- `giza-sphinx-pyramid-guardian`（L81 & L2838）
- `liberty-harbor-trenchcoat-traveler`（L82 & L2839）
- `taipei-101-cloudline-night-heroine`（L83 & L2840）

**影響**：搜尋與 profile 選取會回傳兩份相同 id 的物件，可能導致套用錯誤角色卡（早期的輕量版本 vs 後期的完整 WORLD_LAYER_PROFILES 版本）。

**修法**：刪除 L80-83 這 4 條舊的輕量條目（只保留 WORLD_LAYER_PROFILES 裡的完整版本）。

---

### 🔴 緊急 BUG：1445 個角色項目的 category 未在 ROLE_CATEGORIES 中

**檔案**：`src/data.js`

**問題 category 字串**：`'金瓶梅／歷史小說名著人物'`

**受影響數量**：`ROLE_SUGGESTION_ITEMS` 中 1445 個項目（金瓶梅系列所有角色）

**影響**：這些角色在「角色大分類」篩選 UI 完全看不到（因為 `ROLE_CATEGORIES` 陣列沒有此字串），使用者無法從分類瀏覽到金瓶梅系列。

**修法**：在 `src/data.js` 的 `ROLE_CATEGORIES` 陣列中加入 `'金瓶梅／歷史小說名著人物'`（建議放在其他「歷史小說名著人物」分類附近）。

---

### 🟡 Prompt 品質：`safePosePriorityText()` 仍被呼叫 2 次

**檔案**：`src/promptEngine.js`

- L781-783：函數定義，輸出 **約 250 字**
- L823：`buildActionCinematographyText()` 有動作時呼叫一次
- L832：`buildActionCinematographyText()` 無動作時呼叫一次

**問題**：每次出圖 `safePosePriorityText()` 都被插入一次，加上 `buildFinalActionText()` 中的 safety 短句，實質上動作安全規則仍重複出現 2 次，共約 500 字。

**方案 A（推薦）**：將 `safePosePriorityText()` 縮短為 ≤ 60 字，只保留核心三點：
```
姿態安全：鎖臉優先；手部、道具不得遮五官；肩頸脊椎骨盆受力合理，避免詭異肢體。
```

**方案 B**：移除 `buildActionCinematographyText()` 對 `safePosePriorityText()` 的呼叫（L823、L832），改由 `buildFinalActionText()` 的 safety 短句統一負責。

---

### 🟡 data.js 體積過大，接近分拆臨界值

**檔案**：`src/data.js`

- **現況**：864 KB，7449 行
- **臨界值**：vite.config.js 設定 chunkSizeWarningLimit 800KB，已超過
- **成長趨勢**：每波新角色卡 +50-100KB

**建議**：
- 近期（不急）：無需立即分拆，但禁止繼續在 data.js 直接新增 WORLD_LAYER_PROFILES 條目
- 中期：下一波新角色卡若要新增，應建立 `eighthWaveProfiles.js` 並在 data.js import，保持模式一致
- 驗證：`npm run test` 中加入 data.js 行數上限斷言（建議 ≤ 7500 行）

---

### 🟡 seventhWaveProfiles.js 未被測試覆蓋

**檔案**：`src/seventhWaveProfiles.js`（56KB，本次 Explore 掃描漏看）

**問題**：`tests/promptEngine.test.js` 的現有案例未顯示針對第七波 profile 的驗證，可能有欄位缺失的角色卡未被偵測到。

**建議**：在 `tests/promptEngine.test.js` 中加入第七波 profile 的完整性斷言（所有必要欄位 id, label, category, costume, scene, makeup, layers 存在且非空字串）。

---

### 🟡 `buildSceneVisualDetailText()` 有 9 個 if/else 分支，未測試

**檔案**：`src/promptEngine.js` L785-814

**問題**：這個函數有 9 個 if 分支，依主題文字 regex 決定場景補強文字，但 `tests/promptEngine.test.js` 中目前沒有直接測試此函數任何分支的案例。若 regex pattern 被錯誤修改，測試不會告警。

**建議**：加入以下測試案例（各覆蓋一個分支）：
- 含「飛天」的主題
- 含「唐」的主題
- 含「墮天使」的主題
- 含「賽博」的主題
- 含 sceneEnvironment 的表單

---

### 🟢 `ROLE_SUGGESTION_ITEMS` 缺乏 category 合法性自動驗證

**問題**：新增角色卡後，若 category 字串未在 `ROLE_CATEGORIES` 中登記，目前只能靠 Node 腳本手動偵測（如本次審查才發現「金瓶梅」問題）。

**建議**：在 `tests/promptEngine.test.js` 加入一個測試：
```js
test("所有 ROLE_SUGGESTION_ITEMS 的 category 必須在 ROLE_CATEGORIES 中", () => {
  const cats = new Set(ROLE_CATEGORIES);
  const orphans = ROLE_SUGGESTION_ITEMS.filter(i => !cats.has(i.category));
  expect(orphans).toHaveLength(0);
});
```

類似地，加入 ROLE_SUGGESTION_ITEMS id 唯一性檢查：
```js
test("ROLE_SUGGESTION_ITEMS id 必須唯一", () => {
  const ids = ROLE_SUGGESTION_ITEMS.map(i => i.id);
  expect(new Set(ids).size).toBe(ids.length);
});
```

---

## 完整動作清單（供 Codex 執行）

### P0 — 立即修 BUG

#### Task 1：修除 4 個重複 ROLE_SUGGESTION_ITEMS 條目

**檔案**：`src/data.js`
**動作**：刪除 L80-83 的 4 個輕量條目（`antarctic-penguin-photo-traveler`、`giza-sphinx-pyramid-guardian`、`liberty-harbor-trenchcoat-traveler`、`taipei-101-cloudline-night-heroine`）
**驗證**：`npm run test` 通過，搜尋這 4 個 id 各只回傳 1 筆

---

#### Task 2：補上「金瓶梅／歷史小說名著人物」分類

**檔案**：`src/data.js`
**動作**：在 `ROLE_CATEGORIES` 陣列中加入 `"金瓶梅／歷史小說名著人物"`，位置建議放在「三國演義」或「紅樓夢」附近
**驗證**：執行 Task 2 後，Node 指令 `orphans.length === 0`

---

### P1 — 高優先級

#### Task 3：加入 data.js 資料完整性自動測試

**檔案**：`tests/promptEngine.test.js`
**動作**：在現有測試套件中加入以下 2 個測試：
1. `ROLE_SUGGESTION_ITEMS id 唯一性`
2. `ROLE_SUGGESTION_ITEMS category 必須在 ROLE_CATEGORIES 中`

**目的**：防止 Task 1 & 2 的問題再次出現

---

#### Task 4：縮短 `safePosePriorityText()` 並移除其中一次呼叫

**檔案**：`src/promptEngine.js`

步驟：
1. 將 L781-783 的 `safePosePriorityText()` 縮短為：
   ```
   姿態安全：鎖臉、五官比例優先；手部、道具不得遮五官；肩頸脊椎骨盆受力合理，避免詭異肢體與呆立。
   ```
2. 確認 L823 與 L832 只需保留其中一處呼叫（有 action 路徑 vs 無 action 路徑各一），不要兩處都有

**預期節省**：每次 prompt 減少約 200-250 字
**驗證**：`npm run test` 通過，實測簡單案例輸出 ≤ 1800 字

---

### P2 — 中優先級

#### Task 5：seventhWaveProfiles.js 完整性測試

**檔案**：`tests/promptEngine.test.js`
**動作**：加入 SEVENTH_WAVE_PROFILE_DEFS 欄位完整性斷言，參考現有 fourthWave/fifthWave 測試格式

---

#### Task 6：`buildSceneVisualDetailText()` 分支覆蓋測試

**檔案**：`tests/promptEngine.test.js`
**動作**：加入針對各 regex 分支的 buildChatGptInstruction 整合測試（飛天、唐宮廷、墮天使、賽博、含 sceneEnvironment）

---

### P3 — 低優先級

#### Task 7：data.js 行數上限保護

**動作**：在 `tests/promptEngine.test.js` 加入行數斷言，或在 `scripts/lint.mjs` 加入文件大小檢查（warn when > 7500 lines）

---

## 目前檔案規模（供 Codex 參考）

| 檔案 | 行數 | 大小 |
|------|------|------|
| src/data.js | 7449 | 864KB |
| src/fifthWaveProfiles.js | 1810 | 76KB |
| src/seventhWaveProfiles.js | — | 56KB |
| src/promptEngine.js | 1057 | 68KB |
| src/main.js | 921 | 44KB |
| src/fourthWaveProfiles.js | 765 | 40KB |
| src/sixthWaveProfiles.js | — | 16KB |
| src/categoryClassifier.js | 356 | 16KB |
| src/coreSpec.js | — | 12KB |

---

## 關鍵函數位置（promptEngine.js）

| 函數 | 行號 |
|------|------|
| `buildChatGptInstruction()` | L1001 |
| `buildFinalIdentityText()` | L443 |
| `buildFinalCostumeText()` | L450 |
| `buildFinalSceneText()` | L466 |
| `buildFinalActionText()` | L475 |
| `safePosePriorityText()` | L781 |
| `buildSceneVisualDetailText()` | L785 |
| `buildActionCinematographyText()` | L817 |
| `expandSceneToDirectorFields()` | L941 |
| `normalizeForm()` | L153 |
| `DEFAULT_FORM` | L71 |

---

## Prompt 長度實測（2026-06-02）

| 案例 | 長度 |
|------|------|
| 大唐西域公主（基本欄位） | 2023 字 |
| 目標（舊 AI-TASK 設定） | 1000-1300 字 |
| 完成 Task 4 後預估 | ~1700-1800 字 |

---

## Prompt 精簡方案（2026-05-30，仍待完整執行）

日期：2026-05-30

### 背景

目前 `buildChatGptInstruction` 產出的真人電影級奇幻海報 Prompt 偏長，實測「長安燈階・慢板歌姬」類型輸出約 2317 字元。

重複集中在：

- 臉部身份鎖定
- 真人 / 原始 / 正面看鏡頭
- 手部不得遮臉
- 人體骨架與肩頸受力
- 場景近景 / 中景 / 遠景
- 避免呆站與姿態安全

實測同類型輸出關鍵詞分布：

- `臉`：24 次
- `真人`：15 次
- `原始`：7 次
- `正面`：7 次
- `手`：8 次
- `遮`：4 次
- `場景`：7 次
- `遠景`：5 次

判斷：目前保護規則足夠，但重複太多，可能造成 Prompt dilution，削弱角色卡、服裝、場景與動作的權重。

### 推薦方案 A

先只壓縮 `buildChatGptInstruction` 的最終輸出，不改母版資料、不改角色卡資料、不大改 `buildPrompt`。

目標：

- 將最終 ChatGPT 指令壓到約 1000-1300 字
- 保留鎖臉、人體骨架、服裝、場景、動作、光影、負面詞
- 每種安全規則只出現一次
- 保留「ChatGPT 可依主題角色自由設計」的概念，但改成短句

### 建議保留的短句

真人身份鎖定：

> 真人身份鎖定：保留上傳照片原始臉型、眼型、鼻型、嘴型、下顎線、五官比例、成熟年齡感、自然不對稱與真實皮膚紋理；不換臉、不生成新演員臉、不美化成 AI 美女或網紅臉。髮型與髮飾可配合角色微調，但不得改變臉型、髮際線與真人辨識度。

真實人體骨架：

> 真實人體骨架：平衡肩寬、鎖骨、胸腔厚度、軀幹深度、骨盆比例、四肢比例與人體重心；避免頭大、肩窄、軀幹壓縮、脖子扭曲或 AI 娃娃比例。

姿態安全：

> 姿態安全：臉部正面或微側正面清楚可辨識；手部、披帛與道具不得遮五官；肩頸、頭部、脊椎、骨盆與四肢受力合理；避免呆站與詭異肢體。

自由設計短句：

> 場景、道具、姿勢、特效與氣氛需依分類、主題、角色與情節設計，不套用固定道具或固定站姿。

場景格式建議：

> 場景：長安花庭燈階。前景花枝、宮燈與飄紗壓鏡，中景歌姬踏階停步，遠景彩亭、夜宴屏風與深層宮廊建立空間縱深；背景不放路人或隨機群演。

光影格式建議：

> 光影：亮場花宴主光與宮燈補光。臉部明亮且保留真人皮膚紋理，眼睛有自然 catchlight；絲綢、珠寶與薄紗呈現細膩高光與 sparkle highlights，畫面夢幻通透但保持真實攝影質感。

### 不建議直接刪除的內容

不要完全刪掉「根據分類、主題、角色身份與情節設計」的概念。

原因：使用者已明確要求人物動作、場景、道具、姿勢、特效、氣氛都應該依主題與角色自由設計，避免固定拿杯子、固定站姿、固定場景素材。此規則應縮短，而不是移除。

### 可選方案

方案 A：只壓縮 `buildChatGptInstruction`。推薦，影響最小。

方案 B：同步壓縮 `buildPrompt` 與 `buildChatGptInstruction`。影響較大，需要更新更多測試。

方案 C：新增「精簡模式 / 詳細模式」切換。可比較出圖，但 UI 與測試複雜度較高。

### 待決策

- 是否採用方案 A
- 目標長度要控制在 1000-1300 字，或更短到 900-1100 字
- 是否保留完整負面詞，或也同步精簡負面詞

---

## Claude Opus 4.7 深度分析報告

日期：2026-05-30

### 實測案例分析

**測試 Prompt**：「長安燈階・慢板歌姬」類型
**當前長度**：約 2317 字元
**重複率**：30-40%

### 重複內容定位

#### 1. 臉部身份鎖定（重複 6+ 次）

**出現位置**：
- 第 2 行：「保留上傳照片中的原始真人臉部身份」
- 第 3 行：「保留原始臉型、原始眼型、原始鼻型、原始嘴型」
- 第 4 行：「髮型可配合角色微調...但不得改變臉型」
- 妝容段：「保留上傳真人原始臉型、眼型、鼻型、嘴型」
- 動作段：「鎖臉、五官比例、頭身比例優先」

**問題**：同一概念重複描述，造成 Prompt dilution

**建議**：合併為一段
```
真人身份鎖定：保留上傳照片原始臉型、眼型、鼻型、嘴型、下顎線、五官比例、成熟年齡感、自然不對稱與真實皮膚紋理，不換臉、不生成新演員臉、不美化成 AI 美女或網紅臉。
```

#### 2. 「臉部正面看向鏡頭」（重複 6 次）

**出現位置**：
- 第 3 行：「臉部正面或微側正面看向鏡頭」
- 動作段：「臉部保持正面或微側正面看向鏡頭」
- 動作段：「臉部正面或微側正面清楚看向鏡頭」
- 姿態優先規則：「五官必須完整可辨識」

**建議**：只保留一次
```
臉部正面或微側正面看向鏡頭，五官完整清晰可辨識。
```

#### 3. 人體比例描述（重複）

**出現位置**：
- 開頭：「平衡肩寬、真實鎖骨、胸腔厚度、軀幹深度、骨盆比例」
- 動作段：「肩頸、胸腔、骨盆、雙腳重心」
- 動作模板：「符合真實成年人體結構」

**建議**：合併為一段
```
真實人體骨架：平衡肩寬、鎖骨、胸腔厚度、軀幹深度、骨盆比例、四肢比例與人體重心，避免頭大、肩窄、軀幹壓縮或 AI 娃娃比例。
```

#### 4. 手不能遮臉（重複 4 次）

**建議**：一句話即可
```
手部、披帛與道具不得遮擋五官。
```

#### 5. `safePosePriorityText()` 過度冗長（約 250 字）

**函數位置**：`src/promptEngine.js` L781
**被呼叫處**：L823、L832（每次出圖都被插入一次）

**建議縮短為**：
```javascript
function safePosePriorityText() {
  return "姿態安全：鎖臉、五官比例優先；手部、道具不得遮五官；肩頸脊椎骨盆受力合理，避免詭異肢體與呆立。";
}
```

### 優化效果預估（含已完成項目後的現況）

| 項目 | 2026-05-30 當前 | 已完成後現況 | 完成 Task 4 後 |
|------|----------------|------------|--------------|
| 身份鎖定 | ~180 字 | ~100 字 ✅ | ~100 字 |
| 姿態優先規則 | ~250 字 × 2次 | ~250 字 × 2次 ⚠️ | ~60 字 × 1次 |
| 場景描述 | ~300 字 | ~120 字 ✅ | ~120 字 |
| 動作描述 | ~400 字 | ~200 字 ✅ | ~200 字 |
| 光影描述 | ~150 字 | ~120 字 | ~120 字 |
| **總計** | **~2317 字** | **~2023 字** | **~1700 字** |

---

## Codex 後續處理結果（2026-06-02）

執行者：Codex  
狀態：已依 Codex 複核後的保守方案處理，等待/已完成全專案檢查與上架流程。

### 已完成

#### 1. 修正 4 個重複 ROLE_SUGGESTION_ITEMS ID

已刪除 `src/data.js` 前段 4 筆舊輕量條目，只保留後段完整 WORLD_LAYER_PROFILES 版本：

- `antarctic-penguin-photo-traveler`
- `giza-sphinx-pyramid-guardian`
- `liberty-harbor-trenchcoat-traveler`
- `taipei-101-cloudline-night-heroine`

複核指令結果：`duplicateIds: []`

#### 2. 加入資料守門測試

已在 `tests/promptEngine.test.js` 加入：

- `ROLE_SUGGESTION_ITEMS id` 唯一性檢查
- `ROLE_SUGGESTION_ITEMS category` 可見性檢查

注意：Claude 原報告中「1445 個角色項目的 category 未在 ROLE_CATEGORIES 中」判斷方向需要修正。實際 UI 已使用 `PARENT_ROLE_CATEGORIES` / `parentCategoryForProfile()` 做父分類路由，很多 category 是合法細分類，例如 `...／中國歷代服裝`、`...／歷史小說名著人物`。因此測試採用「直接分類、舊式父分類、或可透過父分類器歸類」三層判斷，避免把正常細分類誤判為錯誤。

#### 3. 精簡 `safePosePriorityText()`

已將長版姿態安全規則縮短為：

```text
姿態安全：鎖臉與五官比例優先；手部、紗與道具不得遮五官；肩頸脊椎骨盆受力合理，避免詭異肢體與呆立。
```

同時移除 `buildActionCinematographyText()` 中與新短句重複的長版肩頸/骨盆/手部安全句。

#### 4. 更新回歸測試

已更新既有測試期待值，改為檢查新短句，並確認舊長版清單不再回到最終 ChatGPT 指令。

### 複核結果

目前已完成的局部驗證：

- `npm.cmd run test`：47 tests passed
- 重複 id 檢查：0
- 抽樣 prompt 關鍵詞：
  - 不再包含 `姿態優先規則`
  - 不再包含 `只在主題明確需要時才使用杯...`
  - 保留 `姿態安全`

抽樣長度：

| 案例 | 長度 |
|------|------|
| 大唐西域公主 | 2072 |
| 高亮商業古裝海報 | 2269 |
| 暗黑王族豐滿體態 | 2760 |
| 科幻機甲 | 2035 |

### Codex 判斷

Prompt 長度未降到 Claude 預估的 1700-1800，原因是目前長度主要還包含固定母板、鎖臉、人體骨架、風格/光影、安全負面詞等保護層。這些層與本專案「真人鎖臉優先」核心目標直接相關，因此本次不做激進刪減，不硬壓到 1000-1300 字。

後續若要再壓縮，建議另開一輪，專門比較「精簡模式 / 詳細模式」對出圖穩定性的影響，而不是直接砍母板或負面詞。

### 暫緩項目

- `data.js` 拆檔：暫緩。現有大 chunk warning 不阻斷上架，下一波大量角色卡再改用 `eighthWaveProfiles.js` 類型分拆。
- `seventhWaveProfiles.js` 深度完整性測試：可做，但不是本次上架阻斷項。
- `buildSceneVisualDetailText()` 9 分支逐一測試：可做，但不是本次 P0/P1。
