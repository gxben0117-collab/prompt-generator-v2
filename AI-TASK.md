# AI-TASK

---

## 全專案審查報告 v5

日期：2026-06-03
版本：APP_VERSION `v1.28`（最新 commit：`4842859 Expand dynasty role categories and Tang specialty cards`）
執行：Claude 全掃，**未修改任何檔案**

---

## 系統健康總覽

| 檢查項目 | 結果 |
|----------|------|
| tests | ✅ 53/53 通過 |
| lint | ✅ 0 errors |
| build | ✅ 成功（570KB，chunk 警告已知） |
| UI verify | ✅ desktop + mobile，169 controls，0 console errors |
| GitHub Pages | ✅ 最新版已上線 |
| git 狀態 | ✅ 乾淨，與 origin/main 同步 |
| ROLE_SUGGESTION_ITEMS 重複 id | ✅ 0 |
| WORLD_LAYER_PROFILES 重複 id | ✅ 0 |
| ROLE_SUGGESTION_ITEMS 隱形（無父分類） | ✅ 0 |
| WORLD_LAYER_PROFILES 無父分類 | ✅ 0 |
| Ghost ROLE_CATEGORIES | ✅ 0 |

---

## 資料規模（目前）

| 指標 | 數量 |
|------|------|
| ROLE_SUGGESTION_ITEMS | 1,698 |
| WORLD_LAYER_PROFILES | 1,733 |
| ROLE_CATEGORIES | 81 |
| PARENT_ROLE_CATEGORIES | 36 |

---

## 檔案規模

| 檔案 | 行數 | 大小 |
|------|------|------|
| src/data.js | **7,775** | **912KB** |
| src/fifthWaveProfiles.js | 1,810 | 76KB |
| src/seventhWaveProfiles.js | 143（超長行） | 56KB |
| src/promptEngine.js | 1,100 | 72KB |
| src/main.js | 926 | 44KB |
| src/eighthWaveProfiles.js | 458 | 28KB |
| src/fourthWaveProfiles.js | 765 | 40KB |
| src/sixthWaveProfiles.js | 250 | 16KB |
| src/categoryClassifier.js | 438 | 16KB |
| src/searchSynonyms.js | — | 4KB |

---

## 問題與建議

---

### ⚠️ 重要：data.js 已超過行數閾值

**現況**：7,775 行 / 912KB，超過先前設定的 7,600 行建議上限  
**成長**：上次審查（2026-06-02）7,445 行 → 現在 7,775 行，**330 行的增長**  
**原因**：Codex 在 `4842859`、`4f9bc83` 等 commit 中繼續直接在 data.js 新增大唐相關角色卡  
**影響**：
- build 輸出 570KB → 正在逼近 Vite 的 800KB minification 後閾值
- 每次 CI `npm run check` 要轉換更多資料，測試時間從 13 秒增加到 27 秒

**建議**：下一波新角色卡必須走獨立 wave 檔（如 `ninthWaveProfiles.js`），禁止直接擴展 data.js 主體

---

### ⚠️ 重要：父分類 `中國歷代服裝` 只有 1 個 profile

**現況**：PARENT_ROLE_CATEGORIES 有 `中國歷代服裝` 和 `中國歷代服裝／泛朝代總覽` 兩個標籤，但「中國歷代服裝」（不含「泛朝代總覽」）只有 1 個 profile 對應。

**原因**：`ref-temp-pale-pink-hanfu-garden-lady`（category：`中國歷代服裝／淡粉漢服／花庭欄邊`）無法匹配 `中國歷代服裝／泛朝代總覽` 的 keyword，因為它的 category 字串只包含「中國歷代服裝」，而 `parentCategoryForText` 把它匹配到較短的 `中國歷代服裝` 標籤（LEGACY_PARENT_CATEGORY_LABELS 的後備）。

**影響**：UI 點「中國歷代服裝」父分類 filter 只顯示 1 張卡，使用者體驗差

**建議**：
- 選項 A：把這張 ref-temp profile 的 category 改成 `中國歷代服裝／泛朝代總覽` 系統下的值
- 選項 B：移除 `中國歷代服裝`（純字串版）的 LEGACY 對應，讓所有中國歷代服裝 profile 統一歸到「泛朝代總覽」

---

### ⚠️ 父分類分布極度不均衡

**現況**：

| 父分類 | profile 數 |
|--------|-----------|
| 世界景點旅拍 | 331 |
| 中國歷代服裝／泛朝代總覽 | 189 |
| 仙俠神話 / 古裝陸劇 | 126 |
| 歷史小說名著人物 | 123 |
| 魅魔 | 115 |
| ... | ... |
| 中國歷代服裝 | **1** |
| 動漫次文化街拍 | **4** |
| 東方和風旅拍 | **4** |
| 東方旗袍夜宴 | **4** |
| 田園花園旅拍 | **5** |
| 賽博機甲 / 科幻戰姬 | **5** |
| 現代都市 / 街拍電影 | **5** |
| 世界地標旅拍 | **5** |

**建議**：補卡優先順序（每個父分類至少 10 張才有選擇意義）：
1. 中國歷代服裝（修 bug，見上條）
2. 動漫次文化街拍（+6）
3. 東方和風旅拍（+6）
4. 東方旗袍夜宴（+6）

---

### ℹ️ `safePosePriorityText()` 仍被呼叫 2 次（L868, L876）

**狀況**：函數本身已縮短為 45 字，但在 `buildActionCinematographyText()` 的兩個分支（有/無動作）各呼叫一次，屬於合理的 if/else 設計，每次出圖只執行一次。**不需要修改**，確認此為已知且合理的設計。

---

### ℹ️ Prompt 長度現況（本次實測）

| 案例 | 長度 |
|------|------|
| 大唐西域公主（基本） | 2,070 字 |
| 暗黑王族夜宴魅魔 | 2,365 字 |
| 敦煌飛天舞姬（有動作） | 1,936 字 |
| 都市電影女主（有場景） | 1,982 字 |
| 西方古典希臘女神（有動作） | 2,006 字 |
| **平均** | **2,072 字** |
| UI 實測（verify:ui） | 2,624–2,625 字 |

**結論**：維持在 2,000–2,400 字合理區間，不建議再壓縮。

---

## 完整動作清單（供 Codex 執行）

### P0 — 即修（UI 顯示問題）

#### Task 1：修正 `ref-temp-pale-pink-hanfu-garden-lady` 的父分類對應

**問題**：這張 ref-temp profile 的 category 是 `中國歷代服裝／淡粉漢服／花庭欄邊`，導致父分類分類器匹配到舊的「中國歷代服裝」標籤而不是「中國歷代服裝／泛朝代總覽」。

**修法**：在 `src/data.js` 找到這個 profile，明確加上 `parentCategory: "中國歷代服裝／泛朝代總覽"` 欄位。

**驗證**：
```js
import { WORLD_LAYER_PROFILES } from './src/data.js';
import { parentCategoryForProfile } from './src/categoryClassifier.js';
const p = WORLD_LAYER_PROFILES.find(p => p.id === 'ref-temp-pale-pink-hanfu-garden-lady');
console.log(parentCategoryForProfile(p)); // 期望：中國歷代服裝／泛朝代總覽
```

---

### P1 — 高優先級（資料健康）

#### Task 2：強制新增角色卡走 `ninthWaveProfiles.js`

**問題**：data.js 已 7,775 行（超過 7,600 行閾值），Codex 仍在直接對 data.js 主體新增資料。

**修法**：
1. 建立 `src/ninthWaveProfiles.js`（格式同 eighthWaveProfiles.js）
2. 在 `src/data.js` import 並接入 WORLD_LAYER_PROFILES 聚合
3. 往後所有新角色卡移至 ninthWaveProfiles.js

**驗證**：`data.js` 行數回到 7,600 行以下。

---

#### Task 3：補足分布偏低的父分類

**目標**：每個父分類至少 10 個 profile（放到 ninthWaveProfiles.js）

| 父分類 | 目前 | 需補 |
|--------|------|------|
| 動漫次文化街拍 | 4 | +6 |
| 東方和風旅拍 | 4 | +6 |
| 東方旗袍夜宴 | 4 | +6 |
| 田園花園旅拍 | 5 | +5 |
| 賽博機甲 / 科幻戰姬 | 5 | +5 |
| 現代都市 / 街拍電影 | 5 | +5 |
| 世界地標旅拍 | 5 | +5 |

---

### P2 — 測試覆蓋補強

#### Task 4：加入 data.js 行數上限保護

**修法**（加到 `tests/promptEngine.test.js` 或 `scripts/lint.mjs`）：
```js
import { readFileSync } from 'fs';
const lines = readFileSync('./src/data.js', 'utf8').split('\n').length;
if (lines > 7800) throw new Error(`data.js 超過 7800 行（${lines} 行），新增資料請使用 ninthWaveProfiles.js`);
```

---

## 關鍵函數位置（目前）

| 函數 | 位置 |
|------|------|
| `buildChatGptInstruction()` | promptEngine.js L1044 |
| `buildFinalIdentityText()` | promptEngine.js L446 |
| `buildFinalCostumeText()` | promptEngine.js L453 |
| `buildFinalSceneText()` | promptEngine.js L469 |
| `buildFinalActionText()` | promptEngine.js L478 |
| `safePosePriorityText()` | promptEngine.js L826 |
| `buildActionCinematographyText()` | promptEngine.js L862 |
| `expandSceneToDirectorFields()` | promptEngine.js L984 |
| `parentCategoryForProfile()` | categoryClassifier.js L354+ |
| `normalizeForSearch()` | searchSynonyms.js L34 |
| ROLE_CATEGORIES | data.js L17 |
| PARENT_ROLE_CATEGORIES | categoryClassifier.js L5 |

---

## 已確認不需要修的事項

| 事項 | 結論 |
|------|------|
| safePosePriorityText 被呼叫 2 次 | ✅ if/else 各一次，合理設計 |
| Prompt 壓縮到 1,000–1,300 字 | ❌ 不建議，核心安全層不可壓縮 |
| WORLD_LAYER_PROFILES 全部有父分類 | ✅ 除 Task 1 外全部正常 |
| 重複 id | ✅ 0 個 |

---

## 近期 Commit 摘要（2026-06-01 起，共 20 個）

- **4842859** Expand dynasty role categories and Tang specialty cards（最新）
- **d846cf7** Update UI verification for Tang category filters
- **c3e27b5** Expose Tang specialty categories in UI filters
- **4f9bc83** Add Tang court research and entertainment role cards
- **b2c2214** Rebuild standalone HTML after succubus prompt update
- **de546b3** Revert sleepwear terms except category name; keep fabric description
- **312e25a** Replace sleepwear terms with formal dress vocabulary in succubus prompts
- **57ff998** Fix eighth-wave category routing test and ship full check
- **0857c41** Speed up world profile parent guard

---

*生成時間：2026-06-03，Claude Sonnet 4.6，未修改任何程式碼*

---

## Codex 審核意見（2026-06-03）

整體判斷：Claude 的方向可以採用，但執行時需要微調，避免把相容性問題和資料搬遷問題混在一起。

### 同意採用

1. `src/data.js` 已經過大，之後新增角色卡應改走獨立 wave 檔，例如 `src/ninthWaveProfiles.js`。
2. 低數量父分類補到至少 10 張是合理的 UI 改善，分類只有 4-5 張時使用體驗偏空。
3. `ref-temp-pale-pink-hanfu-garden-lady` 可明確指定 `parentCategory: "中國歷代服裝／泛朝代總覽"`，屬於低風險小修。
4. 加入 `data.js` 行數上限保護是合理的，能防止未來繼續把大型資料塞回主檔。

### 需要修正的判斷

1. Task 1 的成因描述不完全精準。`ref-temp-*` profile 在 `parentCategoryForProfile()` 中有特殊邏輯，若有 `profile.parentCategory` 會直接返回它；因此最穩的修法是明確更新該 profile 的 `parentCategory`，而不是移除 legacy 對應。
2. Task 2 說建立 `ninthWaveProfiles.js` 後 `data.js` 行數會回到 7,600 以下，這點不會自動成立。只有建立新檔並接入聚合，`data.js` 不會變短；若要低於 7,600 行，必須把近期新增的大段角色卡搬出 `data.js`。
3. 不建議移除 `LEGACY_PARENT_CATEGORY_LABELS` 裡的舊分類對應，因為舊資料與臨時參考卡仍可能依賴相容層。

### 建議執行順序

1. 先做 P0：修 `ref-temp-pale-pink-hanfu-garden-lady` 的父分類。
2. 建立 `src/ninthWaveProfiles.js`，並在 `src/data.js` 接入 `WORLD_LAYER_PROFILES` 聚合。
3. 之後所有新補卡全部放入 `ninthWaveProfiles.js`，不要再直接擴展 `data.js` 主體。
4. 補足低數量分類到至少 10 張。
5. 加入 `data.js` 行數保護。門檻建議先設 `7800`；若堅持 `7600`，需先做既有資料搬遷。

### 結論

可採用 Claude 報告的大方向，但建議執行策略改為：

`小修分類 -> 建 ninth wave -> 新卡走新檔 -> 補低量分類 -> 加行數保護`

不建議以移除 legacy 對應作為修 bug 的主要手段，優先維持舊資料相容性。

---

## Claude 二次意見（2026-06-03）

### 同意 Codex 的修正

**「建 ninthWaveProfiles.js 不會讓 data.js 自動縮短」**——這個更正重要。我的 Task 2 原本寫法讓人誤以為只要建新檔就夠了。要讓 data.js 真正縮短，必須把最近幾個 commit（`4842859`、`4f9bc83`）直接新增進 data.js 的大唐角色卡段落**搬移**到 ninth wave，才是真正的分拆。否則只是「往後不再加」，當前超閾問題依然存在。

### 與 Codex 不同的判斷

**關於「不建議移除 LEGACY 對應」**——Codex 偏保守，我認為這裡應該修乾淨。

理由：
- `LEGACY_PARENT_CATEGORY_LABELS` 是給 UI filter 按鈕用的，「中國歷代服裝」這個 filter 點下去只顯示 **1 張卡**，這是使用者看得到的明顯壞體驗
- 涉及的那 1 張 ref-temp profile（`ref-temp-pale-pink-hanfu-garden-lady`）本來就是臨時展示用途，不是生產核心資料
- 只加 `parentCategory` 欄位讓舊標籤繼續存在，等於問題沒真正解決，日後還可能再長出其他 1 張卡的孤立 filter

建議**修法**：加 `parentCategory: "中國歷代服裝／泛朝代總覽"` 到該 profile，**同時**把 LEGACY_PARENT_CATEGORY_LABELS 中的 `"中國歷代服裝"` 移除，讓它不再出現在 UI filter 列表。風險極低，影響範圍僅限這 1 張卡。

### 最終建議執行順序（整合兩方意見）

```
1. 搬遷 data.js 中近期新增的大唐段落 → ninthWaveProfiles.js
   （讓 data.js 真正低於 7,600 行）

2. 建立 ninthWaveProfiles.js 框架並接入 data.js import

3. 修 ref-temp-pale-pink-hanfu-garden-lady：
   - 加 parentCategory: "中國歷代服裝／泛朝代總覽"
   - 移除 LEGACY_PARENT_CATEGORY_LABELS 中的孤立「中國歷代服裝」

4. 補低量父分類角色卡至 ninthWaveProfiles.js（各至少 10 張）
   優先：動漫次文化街拍、東方和風旅拍、東方旗袍夜宴

5. 加 data.js 行數保護（閾值 7,600）
```

### 一句話結論

搬遷資料是核心，光建新檔沒用；ref-temp 的 legacy 對應應該一起修乾淨，不要讓 1 張卡的 filter 繼續出現在 UI 裡。
