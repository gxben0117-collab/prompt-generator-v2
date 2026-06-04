# AI-TASK

---

## 全專案審查報告 v6（Claude 邏輯分析版）

日期：2026-06-04
版本：最新 commit `c7a62ec Update AI task handoff status`
執行：Claude Sonnet 4.6，完整掃描 src/、tests/、categoryClassifier、promptEngine、所有 wave 檔，**未修改任何程式碼**

---

### 系統健康

| 項目 | 結果 |
|------|------|
| tests | ✅ **55/55** 通過 |
| lint | ✅ 0 errors |
| build | ✅ 成功（1.17MB，chunk 警告存在） |
| git 狀態 | ✅ 乾淨，與 origin/main 同步 |
| data.js 行數 | ✅ **7,478 行**（低於 7,600 保護閾值） |

---

### 資料規模（v6 最新實測）

| 指標 | 數量 |
|------|------|
| WORLD_LAYER_PROFILES 總計 | **1,826**（v5 為 1,733，成長 93） |
| ROLE_CATEGORIES | 81 |
| PARENT_ROLE_CATEGORIES 定義數 | 36 |
| data.js | 7,478 行 / 917KB |
| dist JS | 1,174KB（+604KB vs v5 的 570KB） |

---

### 父分類 profile 分布（v6 最新實測，node 直接計算）

| 父分類 | 數量 | 狀態 |
|--------|------|------|
| 世界景點旅拍 | 332 | — |
| 中國歷代服裝／泛朝代總覽 | 191 | — |
| 仙俠神話 / 古裝陸劇 | 126 | — |
| 歷史小說名著人物 | 123 | — |
| 魅魔 | 115 | — |
| 唐朝服飾／泛唐風古裝 | 97 | — |
| 現代都市夜景 | 83 | — |
| 西方古典 / 歐陸史詩 | 66 | — |
| 奇幻異世界 / 暗黑王族 | 61 | — |
| 花園童話 / 自然精靈 | 59 | — |
| 武俠江湖 / 戰場女將 | 56 | — |
| 盛唐風月／教坊平康／胡姬樂舞 | 45 | — |
| 東方異域 / 絲路西域 | 45 | — |
| 暗黑墮天使 | 47 | — |
| 世界頂級網紅地標旅拍 | 47 | — |
| 盛唐宮廷考據／大明宮貴妃／史實考據 | 40 | — |
| 水下龍宮海國 | 31 | — |
| 九尾妖狐 | 29 | — |
| 長相思旅拍 | 20 | — |
| 敦煌飛天 | 19 | — |
| 江南旅拍 | 19 | — |
| 民族古城旅拍 | 13 | — |
| 世界地標旅拍 | 12 | ✅（v5 為 5，已補） |
| 東方和風旅拍 | 11 | ✅（v5 為 4，已補） |
| 田園花園旅拍 | 11 | ✅（v5 為 5，已補） |
| 埃及豔后／尼羅河女兒／埃及神話女神 | 10 | ✅（新增） |
| 漢宮禮樂／長信宮燈／漢代仕女考據 | 10 | — |
| 魏晉風骨／洛水女神／清談名姝 | 10 | — |
| 宋韻雅集／汴梁茶香／文人仕女 | 10 | — |
| 明宮織金／牡丹王姬／禮制服制 | 10 | — |
| 清宮旗裝／雪苑貴妃／晚清宮廷寫實 | 10 | — |
| 動漫次文化街拍 | 10 | ✅（v5 為 4，已補） |
| 東方旗袍夜宴 | 10 | ✅（v5 為 4，已補） |
| 賽博機甲 / 科幻戰姬 | 10 | ✅（v5 為 5，已補） |
| 現代都市 / 街拍電影 | 10 | ✅（v5 為 5，已補） |
| **高訂婚紗禮服** | **8** | ⚠️ 仍低於 10 |
| **海岸度假旅拍** | **8** | ⚠️ 仍低於 10 |
| **室內生活寫真** | **7** | ⚠️ 仍低於 10 |
| **花園奇幻／森林精靈／電影童話** | **2** | 🔴 孤兒標籤 |
| **中國神話** | **1** | 🔴 孤兒標籤 |
| **蒸汽奇幻 / 機械王國** | **1** | 🔴 孤兒標籤 |
| **世界花園旅拍** | **1** | 🔴 孤兒標籤 |

---

### 問題分析

---

#### 🔴 P0：4 個孤兒父分類標籤（共 5 個 profile 被隱藏）

**發現**：`parentCategoryForProfile()` 對以下 4 個標籤返回有值，但這 4 個標籤 **不存在於 `PARENT_ROLE_CATEGORIES` 陣列**，因此沒有 UI filter 按鈕：

| 孤兒標籤 | profile 數 |
|----------|-----------|
| 花園奇幻／森林精靈／電影童話 | 2 |
| 中國神話 | 1 |
| 蒸汽奇幻 / 機械王國 | 1 |
| 世界花園旅拍 | 1 |

**影響**：這 5 個 profile 只在「全部」分類下可見，點任何 filter 都找不到。這是靜默的 UI 隱藏問題，現有測試不會抓到（test 只驗 `parentCategory !== null`，不驗是否存在於 PARENT_ROLE_CATEGORIES）。

**根因**：某些舊 profile 的 `profile.parentCategory` 欄位使用了已廢棄的標籤名，或是歷史遺留的 legacy 分類字串；inference 未能覆寫，fallback 直接返回舊值。

**修法選項**：
- 選項 A（推薦）：找出這 5 個 profile，將 `parentCategory` 欄位修正為現有 PARENT_ROLE_CATEGORIES 中最接近的標籤。
- 選項 B：把這 4 個孤兒標籤加入 PARENT_ROLE_CATEGORIES，但這會新增 4 個幾乎空的 filter 按鈕，使用者體驗差。

**測試補強**：現有測試只驗 non-null，需補一個測試確保每個 profile 的 parentCategory 存在於 PARENT_ROLE_CATEGORIES：
```js
it("every world layer profile maps to a valid PARENT_ROLE_CATEGORIES entry", () => {
  const validLabels = new Set(PARENT_ROLE_CATEGORIES.map(p => p.label));
  const orphans = WORLD_LAYER_PROFILES.filter(p => {
    const cat = parentCategoryForProfile(p);
    return cat && !validLabels.has(cat);
  });
  expect(orphans.map(p => `${p.id}: ${parentCategoryForProfile(p)}`)).toEqual([]);
});
```

---

#### ⚠️ P1：tenthWaveProfiles 未命中 `parentCategoryForProfile()` 快速路徑

**發現**：`categoryClassifier.js L425` 的快速路徑只覆蓋 `ref-temp-`、`eighth-`、`ninth-` 開頭的 id：

```js
if ((profile?.id?.startsWith("ref-temp-") || profile?.id?.startsWith("eighth-") || profile?.id?.startsWith("ninth-")) && profile.parentCategory) {
```

`tenthWaveProfiles.js` 的 id 以 `style-ref-` 開頭，**不命中此路徑**，每次呼叫都執行完整的 inference + 關鍵字比對後才 fallback 到 `profile.parentCategory`。

**影響**：
1. **效能**：每個 tenth wave profile 每次調用都要跑完整 inference（WORLD_LAYER_PROFILES 有 1826 筆，UI 初始化時有大量呼叫）。
2. **脆弱性**：若 inference 意外命中高優先 PRIORITY_PARENT_CATEGORY_LABELS，會蓋過正確的 `profile.parentCategory`。例如 `style-ref-flower-window-qipao` 的文字含「牡丹、旗袍」，有機率被 inference 歸到「中國歷代服裝／泛朝代總覽」或「東方旗袍夜宴」而非正確的「現代都市 / 街拍電影」。

**修法**：在快速路徑加入 `"tenth-"` 或 `"style-ref-"` 前綴：
```js
if (
  (profile?.id?.startsWith("ref-temp-") ||
   profile?.id?.startsWith("eighth-") ||
   profile?.id?.startsWith("ninth-") ||
   profile?.id?.startsWith("tenth-") ||
   profile?.id?.startsWith("style-ref-")) &&
  profile.parentCategory
) {
```
**風險**：極低，只是讓快速路徑更早命中，邏輯不變。

---

#### ⚠️ P1：3 個父分類仍低於 10 張

| 父分類 | 目前 | 需補 |
|--------|------|------|
| 室內生活寫真 | 7 | +3 |
| 高訂婚紗禮服 | 8 | +2 |
| 海岸度假旅拍 | 8 | +2 |

以上請新增到 tenthWaveProfiles.js 或 eleventhWaveProfiles.js，不要塞回 data.js。

---

#### ⚠️ P1：build 輸出 1.17MB，大幅超過 Vite 800KB 閾值

**現況**：dist JS 從 v5 的 570KB 成長到 1,174KB，主要來自 ninth/tenth wave 大量角色卡資料。

**影響**：每次載入要傳輸超過 1MB JS，在慢速網路或手機上首次載入體感明顯。

**選項**：
- A（短期可行）：把 WORLD_LAYER_PROFILES 資料分割為多個 JSON 檔案，UI 初始化時再按需 fetch。實作難度中等，對現有邏輯改動較大。
- B（中期）：Vite code splitting，把各 wave profile 設為 dynamic import，首頁只載入核心 promptEngine + UI，資料在用到時再 lazy load。
- C（暫時可接受）：繼續接受警告，不做改動，作為已知技術債。目前功能正常，上線不阻塞。

---

#### ℹ️ P2：seventhWaveProfiles.js 超長行格式

`seventhWaveProfiles.js`：138 行 / 54KB，每行為超長陣列字串。可正常運作但 git diff 幾乎無法閱讀。建議下次重構時拆成多行物件格式（和 tenthWaveProfiles 一致）。非緊急。

---

#### ℹ️ 已確認正常的項目

| 項目 | 結論 |
|------|------|
| data.js 行數保護 | ✅ 測試存在（tests/promptEngine.test.js L219），目前 7,478 行通過 7,600 上限 |
| ref-temp-pale-pink-hanfu-garden-lady | ✅ parentCategory 已修正，歸入中國歷代服裝／泛朝代總覽 |
| 重複 id | ✅ 測試覆蓋，0 重複 |
| Ghost ROLE_CATEGORIES | ✅ 測試覆蓋 |
| safePosePriorityText 呼叫 2 次 | ✅ if/else 各一次，合理設計 |
| promptEngine.js 行數 | ✅ 1,008 行（從 1,100 降低，趨勢良好） |

---

### 建議執行順序

```
P0（即修）：
1. 找出 5 個孤兒 profile（中國神話×1、蒸汽奇幻×1、世界花園旅拍×1、花園奇幻×2）
   → 修正它們的 parentCategory 到正確的現有標籤
2. 補 test：驗所有 profile 的 parentCategory 存在於 PARENT_ROLE_CATEGORIES

P1（本輪完成）：
3. 在 parentCategoryForProfile() 快速路徑加入 tenth-/style-ref- 前綴
4. 補足室內生活寫真（+3）、高訂婚紗禮服（+2）、海岸度假旅拍（+2）
   → 放入 tenthWaveProfiles.js 或新建 eleventhWaveProfiles.js

P2（評估後決定）：
5. 評估 build 拆包策略（lazy load wave 資料 vs 繼續接受 1.17MB 技術債）
6. seventhWaveProfiles.js 改多行格式（低優先，下次大重構時順帶）
```

---

### 函數位置（v6 更新）

| 函數 | 位置 |
|------|------|
| `buildChatGptInstruction()` | promptEngine.js L1044（約） |
| `parentCategoryForProfile()` 快速路徑 | categoryClassifier.js L425 |
| `PARENT_ROLE_CATEGORIES` | categoryClassifier.js L5 |
| `PRIORITY_PARENT_CATEGORY_LABELS` | categoryClassifier.js L349 |
| `DATA_JS_LINE_LIMIT` | tests/promptEngine.test.js L28 |
| data.js 行數保護 test | tests/promptEngine.test.js L219 |

---

*報告由 Claude Sonnet 4.6 生成，2026-06-04，未修改任何程式碼*

---

## 2026-06-04 最新交接狀態（給 Claude / Codex）

### 目前真實狀態

- 最新 commit：`d53118f Add style reference role-card report`
- 已上架：GitHub Pages workflow `Deploy to GitHub Pages` 最後一輪成功
- 線上網址：`https://gxben0117-collab.github.io/prompt-generator-v2/`
- 工作區狀態：乾淨，沒有 staged / untracked 檔案
- `src/tenthWaveProfiles.js` 已提交：`8836ccd Add missing tenth wave profile data`
- 風格範例報告已提交：`d53118f Add style reference role-card report`

### 2026-06-04 已完成事項

- 「世界頂級網紅地標旅拍」新增 20 組角色卡。
- 新增父分類：「埃及豔后／尼羅河女兒／埃及神話女神」。
- 埃及分類新增 10 組內建角色卡。
- `ref-temp-pale-pink-hanfu-garden-lady` 的 P0 父分類問題已修正，測試確認會歸入「中國歷代服裝／泛朝代總覽」。
- `src/tenthWaveProfiles.js` 已納入 git，遠端部署不再缺檔。
- `docs/reports/2026-06-04-style-reference-role-cards.md` 已納入 git。

### 最新驗證

- `npm run check` 已通過：
  - `sync:spec` 通過
  - `lint` 0 errors
  - `vitest` 55/55 通過
  - `build` 成功
  - `verify:ui` desktop + mobile 成功，0 console errors，無 horizontal overflow
- GitHub Pages 部署成功。

### 已知但不阻塞上架

- Vite build 仍有 chunk > 800KB 警告。
- dist JS 約 1.17MB，主要來自 ninth/tenth wave 與大量角色卡資料。
- 這是效能與拆包優化議題，不是目前上架阻塞。

### 下一輪建議待辦

1. 補低量父分類角色卡，優先順序：
   - 動漫次文化街拍：至少 +6
   - 東方和風旅拍：至少 +6
   - 東方旗袍夜宴：至少 +6
2. 後續新增角色卡請繼續放到獨立 wave 檔，不要直接塞回 `src/data.js` 主體。
3. 若要處理 chunk 警告，可評估資料拆包、lazy load 或角色卡資料外部化。
4. 若要加 `data.js` 行數保護，請先重新評估目前已搬遷後的實際行數與合理門檻；舊報告裡的 7,600/7,800 門檻已不完全反映最新資料架構。

### 舊報告注意事項

下方「全專案審查報告 v5」是 2026-06-03 的歷史紀錄，部分內容已過期：

- 最新 commit 不再是 `4842859` 或 `8a1efab`，而是 `d53118f`。
- `src/tenthWaveProfiles.js` 已經 commit，不再是未追蹤檔。
- `docs/reports/2026-06-04-style-reference-role-cards.md` 已經 commit，不再是未追蹤檔。
- P0 bug 已修。
- GitHub Pages 已成功部署最新版。

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

---

## 角色卡檔案結構重整討論稿（Codex 提案）

日期：2026-06-04
提案者：Codex
最新已推送 commit：`a222a06 Fix parent category coverage and low-count cards`

---

### 先更新現況，避免沿用舊報告誤判

`a222a06` 已處理 Claude v6 報告中的主要 P0/P1 資料問題：

- 父分類 orphan 已修正：所有 `parentCategoryForProfile(profile)` 結果都會落在 `PARENT_ROLE_CATEGORIES` 既有 UI 大分類。
- 新增測試：`every world layer profile maps to a visible parent category filter`，防止角色卡被靜默藏在「全部」底下。
- 舊標籤相容：
  - `世界地標旅拍` -> `世界景點旅拍`
  - `中國歷代服裝` -> `中國歷代服裝／泛朝代總覽`，但泛朝代卡仍允許關鍵字推斷到泛唐、考據、江南等更準分類。
- `style-ref-*`、`tenth-*` 已納入可信父分類 fast path。
- 低量分類已補：
  - `室內生活寫真` +3
  - `高訂婚紗禮服` +2，且部分 style-ref 禮服卡已轉入此分類
  - `海岸度假旅拍` +2
- 驗證結果：
  - `npm run test`：56/56 通過
  - `npm run check`：通過
  - GitHub Pages：部署成功

注意：目前工作區仍可能有未提交的 `AI-TASK.md`、`src/coreSpec.js`、`核心資料/核心咒語規範.md` 變更；重整角色卡前請先確認不要混入無關提交。

---

### 是否需要重整角色卡檔案結構？

結論：可以開始，但要採用低風險分批搬家。

目前 `data.js` 已靠 wave 檔減壓，但 `eighthWaveProfiles.js`、`ninthWaveProfiles.js`、`tenthWaveProfiles.js` 這種時間序命名開始不利於維護：

- 後續找卡片要靠記憶「哪一波新增」，不是靠主題。
- 新增卡片容易塞進最新 wave，久了會混雜地標、婚紗、室內、style reference、埃及等不同資料。
- bundle 已有 Vite chunk warning，資料集中度會繼續增加後續拆分成本。
- 不同 AI 協作時容易改錯區塊，或新增重複 / orphan parentCategory。

---

### 建議重整原則

第一階段只搬檔案與整理 import/export，不修改角色卡內容，不同時做文案優化。

目標是「行為等價」：

- `WORLD_LAYER_PROFILES` 總資料內容不應減少。
- `ROLE_SUGGESTIONS`、UI 分類、搜尋、`parentCategoryForProfile` 結果維持既有測試通過。
- 搬完後必須跑 `npm run test`、`npm run check`。
- 若 `index.html` 因 build 重建而更新，與本次結構調整一起提交。

---

### 建議新目錄

```text
src/profiles/
  index.js
  styleReferenceProfiles.js
  landmarkProfiles.js
  egyptianProfiles.js
  lifestyleProfiles.js
  bridalAndCoastalProfiles.js
  modernStreetProfiles.js
  fantasyProfiles.js
  historicalChinaProfiles.js
```

`src/profiles/index.js` 作為唯一出口，建議直接聚合：

```js
import { STYLE_REFERENCE_PROFILES } from "./styleReferenceProfiles.js";
import { LANDMARK_PROFILES } from "./landmarkProfiles.js";
import { EGYPTIAN_PROFILES } from "./egyptianProfiles.js";

export const EXTRA_WORLD_LAYER_PROFILES = [
  ...STYLE_REFERENCE_PROFILES,
  ...LANDMARK_PROFILES,
  ...EGYPTIAN_PROFILES,
];
```

`data.js` 之後只 import 一個 profiles 出口，避免同時 import 多個 wave 檔：

```js
import { EXTRA_WORLD_LAYER_PROFILES } from "./profiles/index.js";
```

---

### 第一批建議搬移範圍

先搬邊界最清楚的類型，不碰歷史大型資料：

1. `styleReferenceProfiles.js`
   - 所有 `style-ref-*`
   - 所有 `ref-style-example-*`
   - 可視情況包含 `ref-temp-*`，但建議第二批再搬，避免第一批太大。

2. `landmarkProfiles.js`
   - `world-landmark-diverse-*`
   - `iconic-landmark-*` 或世界地標 / 世界頂級網紅地標相關卡片
   - 舊 `世界地標旅拍` 卡片保留 legacy map，不急著逐張改。

3. `egyptianProfiles.js`
   - `egyptian-*` 或 `EGYPTIAN_MYTH_QUEEN_PROFILES`
   - 父分類固定：`埃及豔后／尼羅河女兒／埃及神話女神`

4. `lifestyleProfiles.js`
   - `室內生活寫真`
   - 可含最近新增的 `style-ref-indoor-*`

5. `bridalAndCoastalProfiles.js`
   - `高訂婚紗禮服`
   - `海岸度假旅拍`
   - 可含最近新增的 `style-ref-bridal-*`、`style-ref-coastal-*`

---

### 舊 wave 檔處理方式

不要第一時間刪掉所有 wave 檔。

建議流程：

1. 新增 `src/profiles/` 與新分類檔。
2. 將目標卡片搬出 wave 檔。
3. 更新 `data.js` import，改吃 `profiles/index.js`。
4. 跑測試確認等價。
5. 如果某個 wave 檔已空，先改成 re-export 或保留註解空殼一版，避免其他 AI 還有舊引用。
6. 第二個 commit 再清掉確認無引用的空 wave 檔。

---

### 必加測試 / 防線

建議在結構重整同時補資料 schema 測試：

- 所有 profile `id` 不重複。
- 所有 profile `parentCategory` 必須能映射到 `PARENT_ROLE_CATEGORIES`。
- 所有 profile 必須有 `title`、`category`、`parentCategory`、`themeHint`。
- 所有 profile 必須有 10 層 `layers`。
- 不允許新增 orphan parent labels。
- 若檔案拆分後，可以加一個 smoke test 確認 `profiles/index.js` 匯出的數量等於各分檔總和。

---

### 不建議現在做的事

- 不要同時改角色卡文案、分類器邏輯、檔案結構。
- 不要直接大規模刪 wave 檔。
- 不要現在做 Vite chunk splitting；先把資料來源整理好，再處理 bundle。
- 不要新增幾乎空的 UI 大分類來解決舊標籤，應優先把資料正規化或使用 legacy map。

---

### 建議 commit 節奏

1. `Create profile modules and move style reference cards`
2. `Move landmark and Egyptian profile groups`
3. `Move lifestyle bridal and coastal profile groups`
4. `Add profile schema validation tests`
5. 視情況再做：`Remove unused wave profile shims`

每個 commit 都必須通過：

```bash
npm run test
npm run check
```
