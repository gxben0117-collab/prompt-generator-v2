# AI-TASK

---
## 全專案出圖咒語邏輯檢查報告（2026-06-07）

### 檢查目標
檢查全專案程式邏輯、角色卡資料、實際產出咒語與 ChatGPT 包裝指令，確認是否有「不是給出圖模型看的文字」混入，例如報告、程式、函數、debug、AI-TASK、Claude、工程說明、流程註解，或過度像工作指令而不是畫面描述的內容。

### 實測健康狀態
本次已執行 `npm.cmd run check`：

| 項目 | 結果 |
| --- | --- |
| sync:spec | 通過，`src/coreSpec.js` 同步 6,639 chars |
| lint | 通過，0 errors |
| tests | 通過，59/59 |
| build | 通過 |
| verify:ui desktop | 通過，171 controls，0 console errors，無水平溢出 |
| verify:ui mobile | 通過，171 controls，0 console errors，無水平溢出 |
| bundle | `assets/index-M62ro2yB.js` 約 1,457.13 KB，gzip 約 456.25 KB，仍有大 chunk warning |

### 程式與資料掃描結論
1. 角色卡資料中未發現 `AI-TASK`、`Claude`、`Sonnet`、`報告`、`程式`、`函數`、`debug`、`console`、`undefined`、`null` 等明顯非出圖資料污染。
2. `WORLD_LAYER_PROFILES` 總數目前為 2,202。
3. 全部 2,202 張角色卡的 `sceneAction` 都包含 `全角色卡品質補強`。
4. 全部 2,202 張角色卡的 `sceneAction` 都包含 `ChatGPT`。
5. 全部 2,202 張角色卡的 `sceneAction` 都包含 `不預設拿...` 類規則文字。
6. `buildPrompt()` 對一般手填主題不會輸出 `不要照抄`，但當角色卡 `sceneAction` 進入表單時，會把 `ChatGPT` 這類流程詞一起帶進出圖咒語。
7. `buildChatGptInstruction()` 會輸出 `不要照抄角色卡近中遠原句`，這是偏流程/工作指令，不是純畫面描述。

### 重要判斷
目前沒有發現報告文字、程式碼文字或 AI-TASK 內容直接污染出圖咒語，這點是安全的。

但有一個新的品質問題：為了控制姿態邏輯，程式把「全角色卡品質補強」直接追加到每張角色卡的 `sceneAction` 裡。這讓產出咒語雖然邏輯更穩，但文字中會出現 `ChatGPT 依...設計`、`全角色卡品質補強`、`不預設拿...` 這類偏系統控制/流程管理的語句。它們不是錯誤，也能引導 ChatGPT，但不是最乾淨的出圖用畫面文字。

### P0 問題：角色卡 sceneAction 被流程文字污染
目前 `src/data.js` 的 `actionQualityGuardText(profile)` 會回傳：

- `全角色卡品質補強：姿態由 ChatGPT...`
- `不預設拿著酒杯、權杖、兵器或燭台`
- `不預設拿道具`

這些文字應該改成更像「畫面導演語言」：

- 不要寫 `ChatGPT`。
- 不要寫 `全角色卡品質補強`。
- 少用「不預設」這種系統策略詞。
- 改成直接描述畫面約束，例如：
  - `姿態依角色身份、場景支撐點、情節與構圖自然成立。`
  - `道具優先作為陳設、光源、前景或支撐點；只有主題明確需要時才由人物拿在手上。`
  - `手部、披帛、髮絲與道具不得遮擋五官。`

### P1 問題：ChatGPT 包裝指令仍有流程話術
`src/promptEngine.js` 的 `buildFinalSceneText()` 目前含：

`不要照抄角色卡近中遠原句`

這句意思正確，但偏工作流程，不是畫面咒語。建議改成：

`背景近景 / 中景 / 遠景需依本次主題重新組合，避免機械重複角色卡原句。`

或更純出圖：

`近景、中景與遠景保持本次主題專屬的敘事層次與空間變化。`

### P1 問題：buildPrompt 仍保留欄位式輸出
`buildPrompt()` 目前保留：

- `【輸出格式】`
- `分類：`
- `主題：`
- `服裝：`
- `妝容：`
- `場景：`
- `動作：`
- `光影：`

這些不是報告/程式文字，而是穩定 prompt 結構。它們可接受，但如果目標是「最像直接丟給生圖模型的自然咒語」，可考慮增加一個「純咒語模式」，輸出無標題、無欄位名、直接連續描述。

不建議現在直接移除，因為現有測試與 UI 都依賴這種五欄式結構；應作為可選模式，不要破壞現有模式。

### P2 技術債：bundle 持續變大
目前 build 後 JS chunk 約 1,457 KB，gzip 約 456 KB。功能不阻塞，但角色卡資料持續增加，建議後續規劃：

1. profiles 分檔 lazy load。
2. 角色卡資料 JSON 外部化。
3. 搜尋索引與完整 profile 分離。

### 建議修正順序
1. **P0：清理 `actionQualityGuardText()` 的非出圖詞**
   - `全角色卡品質補強` 改成 `姿態導演` 或直接不加標題。
   - `ChatGPT 依...` 改成 `姿態依...自然成立`。
   - `不預設拿...` 改成 `道具優先作陳設、光源、前景或支撐點，僅在主題明確需要時手持`。
2. **P0：保留現有防呆站、防亂持物邏輯**
   - 不要退回固定姿勢。
   - 不要粗暴刪除合理持物場景。
3. **P1：改 `buildFinalSceneText()` 的 `不要照抄...`**
   - 改成畫面語言，不用工作流程語氣。
4. **P1：新增測試**
   - `WORLD_LAYER_PROFILES` 的輸出欄位不得含 `ChatGPT`、`全角色卡品質補強`。
   - `buildChatGptInstruction()` 不得含 `不要照抄`。
   - 寢宮持杯清理、吧台持杯保留的測試仍要保留。
5. **P2：規劃純咒語模式**
   - 現有五欄式 prompt 保留。
   - 新增「純出圖咒語」輸出模式，移除欄位標題與流程文字。

### 我的結論
目前專案邏輯健康、測試通過、角色卡資料沒有混入報告或程式碼污染。但從「出圖用文字純度」來看，`sceneAction` 裡的 `ChatGPT`、`全角色卡品質補強`、`不預設拿...` 應視為下一輪優先優化。最佳做法不是刪掉防護，而是把它們改寫成畫面導演語言，讓 prompt 看起來像攝影/構圖描述，而不是系統工作流程說明。

---
## 姿態動作生成策略決策（2026-06-07，最新執行方向）

### 結論
姿態動作不應該每張角色卡都寫死，也不應該用批次模板硬塞「持酒杯、持權杖、提燈、端盞」。正確方向是：**讓 ChatGPT 依角色主題、場景、身份、服裝、情節與鏡頭構圖自行發揮姿勢**，但系統必須提供「姿態邏輯邊界」與「反呆站規則」。

也就是：角色卡負責定義人、衣服、場景、氣質、可用道具、不可亂用的道具；實際動作由 ChatGPT 發揮。除非主題或場景明確指名動作與道具，例如酒吧可持酒杯、戰場可持武器、祭司可持法器、茶席可端茶盞，否則不要預設每張都手持道具。

### 為什麼這樣做
目前問題不是「酒杯」本身，而是程式把道具與手部動作綁太緊。酒杯在吧台合理，茶盞在茶席合理，權杖在祭儀合理；但寢宮、睡衣、旗袍、私密內殿、床榻、軟榻類場景若每張都拿杯子或硬道具，就會變得很怪。

同時，如果完全不給姿態引導，ChatGPT 很容易退回無聊站立、證件照站姿、呆板正面站姿。所以應該採用「開放式姿態發揮 + 場景支撐點 + 反呆站限制」的策略。

### 新姿態原則
1. **預設不指定固定動作**：角色卡不要預設「一手持 X、一手扶 Y」作為常規句型。
2. **讓 ChatGPT 自行設計姿勢**：輸出咒語應改成「ChatGPT 需依場所、角色身份、服裝結構、情節與鏡頭構圖，設計自然、有支撐點、不呆站的姿勢」。
3. **除非場景明確需要，否則不預設持物**：道具可作為床邊、桌面、前景、背景、身側陳設、光源、支撐點或角色記憶點，不一定要拿在手上。
4. **阻止無聊站立**：要求姿勢必須有明確支撐點或動作理由，例如扶欄、倚窗、撩簾、坐榻沿、扶床柱、踏階、整理披帛、轉身回眸、行走中停步、扶桌邊、倚靠椅背、坐在床榻或王座邊緣。
5. **身體合理優先**：肩頸、胸腔、骨盆、膝踝、腳掌重心、服裝布料受力必須合理；手、披帛、髮絲與道具不得遮五官。
6. **主題優先於道具**：道具服務角色與場景，不可讓道具變成每張圖的固定手部模板。

### 程式修正方向
#### P0：先改生成邏輯，不先批次硬改所有卡
1. 修改 `profileFactory.js` 第 8 層道具句：
   - 現在：`${prop}作為角色記憶點，與手部動作自然互動`
   - 建議改為：`${prop}作為角色記憶點，可依場景作為手持、支撐點、桌面、床邊、前景、背景或近景道具，不必固定拿在手上`

2. 在 `enrichSceneAction()` 前加入或整合 `normalizeSceneActionProps(profile)`：
   - 只處理明顯衝突，不把所有動作批次變同一套。
   - 寢宮 / 寵妃 / 睡衣 / 旗袍 / 床榻 / 軟榻場景，若原始動作出現 `持酒杯`、`持酒盞`、`端盞`、`托盞`，改成「酒杯/酒盞置於床邊小几、桌面、前景托盤或背景陳設」。
   - 若出現 `提燈`、`手持燭台`，改成「宮燈/燭台作為床邊或場景光源」。
   - 若出現 `持權杖`、`扶權杖`，除非角色是祭司、女王、戰鬥、儀式或王座主題，否則改成「權杖靠在身側、王座旁或作為背景陳設」。

3. 修改 `actionQualityGuardText()` 的寢宮類文字：
   - 不要再列一堆固定姿勢作為唯一優先。
   - 改成：要求 ChatGPT 自行依寢宮、床榻、帷帳、軟枕、妝台、窗邊、王座等支撐點設計姿態，避免呆站，且不必持酒杯、權杖、兵器或燭台。

4. 補強 `isBedchamberConsortProfile()`：
   - 加入 `睡衣`、`私房`、`臥室`、`床邊` 等容易漏網字。

#### P1：再做資料清理
1. 人工清理 74 組寢宮持杯與 16 組硬道具動作。
2. 清理時不要全部改成同一種姿勢，要依每張卡主題微調：有些扶榻、有些撩簾、有些倚枕、有些坐榻沿、有些整理披袍、有些扶妝台。
3. 保留合理持物場景：吧台、宴會、茶席、戰場、祭儀、魔法施法、旅拍相機等。

### 推薦輸出句型
可放進產出咒語品質補強：

> 姿態由 ChatGPT 依角色身份、場所、情節、服裝結構與鏡頭構圖自行設計；必須避免無聊站立、證件照站姿與無支撐呆站。人物可利用床榻、椅背、欄杆、窗台、妝台、王座、階梯、帷幕、披帛、桌邊或場景物件形成自然支撐點；除非主題明確需要，否則不預設手持酒杯、權杖、兵器、燭台或其他道具。手部、髮絲、披帛與道具不得遮擋五官，身體比例、重心與布料受力必須符合真實成年人體結構。

### 我的判斷
這個方向比「每張卡指定動作」更好。因為角色卡數量已經很多，如果每張都硬寫動作，容易變成另一種重複；讓 ChatGPT 發揮姿態，搭配明確反呆站與反亂持物規則，才能讓出圖更自然、更有變化，也更符合不同主題。

下一步應先實作 P0 的三個邏輯修正，再跑 `npm.cmd run check`，確認輸出咒語不再互相矛盾。

---
## 全專案檢查報告 v9（Claude 邏輯 + 咒語內容品質版）

日期：2026-06-07
執行：Claude Sonnet 4.6，npm run check 實測 + promptEngine / data.js / profiles 完整掃描，**未修改任何程式碼**

---

### 系統健康

| 項目 | 結果 |
|------|------|
| tests | ✅ **59/59** 通過（比 v8 多 1 個，新增測試） |
| lint | ✅ 0 errors |
| sync:spec | ✅ 6,639 chars |
| build | ✅ 成功（chunk ⚠️ 見下方） |
| verify:ui desktop | ✅ 171 controls, 0 errors, 2,705 字 |
| verify:ui mobile | ✅ 171 controls, 0 errors, 2,704 字 |

---

### ⚠️ Bundle 持續增長（趨勢警告）

| 版本 | dist JS | gzip | standalone HTML |
|------|---------|------|----------------|
| v1.29（06-05） | 1,210 KB | 392 KB | 612 KB |
| v8（06-07 早） | 1,436 KB | 449 KB | 717 KB |
| v9（06-07 今） | **1,457 KB** | **456 KB** | **728 KB** |

每次補卡都會增長，目前已是 v5（570 KB）的 **2.5 倍**。無功能阻塞，但建議本輪評估拆包策略。

---

### 咒語架構確認（重要前提）

本系統咒語並非直接送給圖像 AI，而是送給 **ChatGPT** 作為指令文件，由 ChatGPT 解讀後出圖。因此：

- **中文指令句**（必須、不得、請、避免）是刻意設計給 ChatGPT 讀的，功能上正確
- `coreSpec.js` 透過 `getHiddenSystemPrompt()`（約行 278）作為**隱藏系統提示**傳入，未混入 `buildChatGptInstruction()` 輸出 ✅
- 最終咒語 = 系統提示（coreSpec）＋ 使用者指令（buildChatGptInstruction 輸出）

以下分析以「是否造成 ChatGPT 解讀矛盾或指令混亂」為判斷標準。

---

### 咒語輸出流程（buildChatGptInstruction 拼接順序）

| 順序 | 段落 | 函數 | 行號 |
|------|------|------|------|
| 1 | 開場白（鎖臉指示） | 直接字串 | ~1064 |
| 2 | 身份控制 | buildFinalIdentityText() | ~446 |
| 3 | 分類｜主題｜風格 | 推導邏輯 | ~1068 |
| 4 | 構圖 | buildFinalCompositionText() | ~1072 |
| 5 | 服裝 | buildFinalCostumeText() | ~453 |
| 6 | 妝容 | buildFinalMakeupText() | ~643 |
| 7 | 場景 | buildFinalSceneText() | ~469 |
| 8 | 動作 | buildFinalActionText() | ~478 |
| 9 | 光影 | buildFinalLightingText() | ~486 |
| 10 | 負面 | buildFinalNegativeText() | ~514 |

---

### 指令句統計（功能性，無廢文）

咒語中的指令句全部具備功能意圖，ChatGPT 有效解讀，無需刪除：

| 行號 | 關鍵詞 | 代表句摘要 | 評估 |
|------|--------|---------|------|
| 308 | 不得 | 不得分離成胸罩內褲或情趣內衣套裝 | ✅ 合理限制 |
| 316–318 | 請 / 不得 | 若沒上傳圖片請先建立 AI 角色 / 不得漂移成多張臉 | ✅ 合理 |
| 357 | 必須 | 夜宴魅姬式動作必須配合本次主題自由設計 | ✅ 合理 |
| 391, 405 | 避免 | 避免自動特寫 / 避免裁頭裁手截斷全身 | ✅ 合理 |
| 471 | 請 / 不要 | 請依主題重新設計；不要照抄角色卡近中遠原句 | ✅ 合理 |
| 473–481 | 不得 | 背景不得出現路人或群演 / 不得遮五官 | ✅ 合理 |
| 502–713 | 避免（多次） | 避免灰暗低光、塑膠 HDR、AI 換臉感 | ✅ 合理 |
| 720 | 必須 | 必須具備 single-protagonist cinematic composition | ✅ 合理 |
| 773 | 必須 / 不做 | 必須有支撐點互動，不做筆直站正中 | ✅ 合理 |

**結論：所有指令句均有效，非廢文，無需清除。**

---

### 🔴 真正的邏輯衝突：矛盾指令（核心問題）

這才是影響出圖品質的根本問題——**同一段輸出同時存在兩個矛盾指令**：

#### 情境 A：寢宮寵妃 sceneAction 含持杯，但補強說不持杯

```
原始 sceneAction:     "側臥床榻，一手低持酒盞，眼神慵懶"
enrichSceneAction 後: "側臥床榻，一手低持酒盞，眼神慵懶；
                       全角色卡品質補強：...不預設拿著酒杯、權杖..."
```

ChatGPT 同時看到「持酒盞」（前）和「不預設拿酒杯」（後），可能優先抓較早的那句 → 仍出現持杯。

#### 情境 B：「全角色卡品質補強：」標籤本身是系統控制標籤

```
全角色卡品質補強：姿態由 ChatGPT 依寢宮支撐點...
```

這個標籤字串是系統控制標記，不是圖像描述語言。ChatGPT 可能降低其執行優先權，視為說明句而非指令句。

---

### 程式邏輯問題彙整

#### 問題 1：profileFactory.js 第 75 行道具句

```js
`${prop}作為角色記憶點，與手部動作自然互動`
```

強迫所有道具往手持方向靠。**尚未修改。**

#### 問題 2：enrichSceneAction() 追加策略（矛盾指令根因）

```js
return [normalizedAction, upgradeText, actionQualityGuardText(profile)]
  .filter(Boolean).join("；");
```

品質補強追加在原始 sceneAction 後，無法覆蓋原始持物動作。`normalizeSceneActionProps()` 應在組裝前先清理持物。**函數目前尚未建立。**

#### 問題 3：isBedchamberConsortProfile() 正則漏洞

```js
/寢宮|寵妃|床榻|臥榻|軟榻|王榻|睡衣寵妃|旗袍寵妃|魅魔寵妃|宮燈寵妃/
```

「睡衣」單字未在清單，profile title 為「現代睡衣」不帶「寵妃」時漏網。

#### 問題 4：寢宮版 actionQualityGuardText() 語氣比通用版更軟

- 寢宮版：`除非主題明確需要，否則不預設拿著...`（語氣柔和，ChatGPT 容易忽略）
- 通用版：`非主題需要不預設拿道具`（語氣較強）
- 寢宮保護應更強，反而更軟。

#### 問題 5：profiles layers 格式不統一

| 檔案 | layers 長度 | 備註 |
|------|----------:|------|
| handcraftedConsortProfiles.js | 8 項 | 自由中文描述 |
| darkRoyalProfiles.js | 9 項 | 含「K」罩杯字串 |
| styleReferenceProfiles.js | 10 項 | 較細分（含燈光）|

目前測試有 schema 保護，不阻塞功能，但格式不一致。

---

### 已確認正常的項目

| 項目 | 結論 |
|------|------|
| coreSpec 與 system prompt 分離 | ✅ getHiddenSystemPrompt() 獨立傳送，未混入咒語 |
| 重複 id | ✅ 0 個 |
| orphan parentCategory | ✅ 0 個 |
| 指令句功能性 | ✅ 全部有功能意圖，無廢文 |
| profiles layers 格式 | ✅ 一致為字串陣列，無物件混入 |
| 59 個測試全過 | ✅ |
| inferActionCueTexts() 寢宮特例 | ✅ 寢宮判定成立時直接回傳床榻姿態，跳過關鍵字推斷 |
| coreSpec.js 不混入 buildChatGptInstruction | ✅ 確認通過 getHiddenSystemPrompt() 獨立分離 |

---

### 建議執行優先順序（v9 整合）

#### P0（邏輯衝突，直接影響出圖品質）

1. **建立 `normalizeSceneActionProps(profile)`**（在 `enrichSceneAction()` 組裝前執行）：
   - 寢宮類遇到 `持酒杯|持酒盞|端盞|托盞|持杯` → 改為「酒盞置於床邊小几」
   - 寢宮類遇到 `提燈|持燭台|手持宮燈` → 改為「宮燈作床邊光源」
   - 寢宮類遇到 `持權杖|扶權杖` → 改為「權杖靠床榻側邊」

2. **修改 `profileFactory.js` 第 75 行**：
   - 現在：`${prop}作為角色記憶點，與手部動作自然互動`
   - 改為：`${prop}可依場景作為手持、支撐點、桌面、床邊、前景或近景道具，不必固定拿在手上`

3. **強化 `isBedchamberConsortProfile()` 正則**：補入「睡衣|私房|臥室」

4. **強化寢宮版 actionQualityGuardText() 措辭**：把「除非主題明確需要，否則不預設」改為更強語氣

#### P1（資料清理）

5. 人工清理 `handcraftedConsortProfiles.js` 原始 sceneAction（74 組持杯 + 16 組硬道具）

#### P2（技術債）

6. 評估 bundle 拆包：dist 已達 1,457 KB

---

### 函數位置（v9 更新）

| 函數 | 位置 |
|------|------|
| `buildChatGptInstruction()` | `src/promptEngine.js` 約行 1051 |
| `buildFinalIdentityText()` | `src/promptEngine.js` 約行 446 |
| `buildFinalSceneText()` | `src/promptEngine.js` 約行 469 |
| `buildFinalActionText()` | `src/promptEngine.js` 約行 478 |
| `getHiddenSystemPrompt()` | `src/promptEngine.js` 約行 278 |
| `createCuratedRoleProfile()` 第 8 層 | `src/profileFactory.js` 行 75 |
| `inferActionCueTexts()` | `src/data.js` 約行 7074 |
| `isBedchamberConsortProfile()` | `src/data.js` 約行 7105 |
| `actionQualityGuardText()` | `src/data.js` 約行 7132（寢宮版約行 7172） |
| `enrichSceneAction()` | `src/data.js` 約行 7141（新版約行 7180） |
| `normalizeSceneActionProps` | ❌ 尚未建立 |
| `propInteractionPolicy` | ❌ 尚未建立 |

---

*報告由 Claude Sonnet 4.6 生成，2026-06-07，未修改任何程式碼*

---
## 全專案檢查報告 v8（Claude 邏輯分析版）

日期：2026-06-07
執行：Claude Sonnet 4.6，npm run check 實測 + 完整程式碼掃描，**未修改任何程式碼**

---

### 系統健康

| 項目 | 結果 |
|------|------|
| tests | ✅ **58/58** 通過 |
| lint | ✅ 0 errors |
| sync:spec | ✅ 6,639 chars |
| build | ✅ 成功（chunk ⚠️ 見下方） |
| verify:ui desktop | ✅ 171 controls, 0 errors, 2,705 字 |
| verify:ui mobile | ✅ 171 controls, 0 errors, 2,704 字 |

---

### ⚠️ dist JS 已從 1,210 KB 暴增至 1,436 KB

| 版本 | dist JS | gzip |
|------|---------|------|
| v1.29（06-05） | 1,210 KB | 392 KB |
| 今日（06-07） | **1,436 KB** | **449 KB** |
| 增幅 | **+226 KB** | **+57 KB** |

推測來自 `Add handcrafted consort profile collections`。目前不阻塞功能，但已是 v5（570 KB）的 2.5 倍，建議評估 lazy load 時機。

---

### 道具持物問題（關鍵字命中統計）

掃描範圍：`src/profiles/` 全部 11 個檔案

| 關鍵字 | 命中數 | 風險等級 |
|--------|------:|---------|
| 宮燈 | 271 | 需分辨（場景道具 vs 手持） |
| 手持 | 157 | 需分辨 |
| 酒杯 | 66 | 高風險 |
| 茶盞 | 43 | 中風險（需看場景） |
| 酒盞 | 34 | 高風險 |
| 燭台 | 29 | 高風險 |
| 權杖 | 16 | 中高風險 |
| 持酒 | 15 | 高風險 |
| 提燈 | 12 | 中風險 |
| 持權杖 | 2 | 高風險 |
| 持杯 | 1 | 高風險 |

#### handcraftedConsortProfiles.js 問題最集中

| 類型 | 總數 | 直接持物 | 比例 |
|------|-----:|--------:|-----:|
| 寢宮寵妃 | 30 | ~22 | 73% |
| 魅魔寵妃 | 30 | ~20 | 67% |
| 睡衣寵妃 | 30 | ~29 | 97% |
| 唐朝寵妃 | 11 | ~8 | 73% |

---

### 根本原因確認

#### 問題 1：`profileFactory.js` 第 8 層道具句（行 75）

```js
`${prop}作為角色記憶點，與手部動作自然互動`
```

這句讓所有道具都偏向「手持」，即使是寢宮場景也一樣。**尚未修改。**

#### 問題 2：`inferActionCueTexts()` 關鍵字觸發（data.js 約 7074-7103 行）

```js
addCue(/燈|燭|燭台|宮燈|火|香爐/, "提燈轉肩");
addCue(/魔法|法器|法鈴|權杖|術法|祭司|聖女|巫祝/, "托法器引光");
```

寢宮角色若 sceneAction 含「宮燈」，正常路徑會推「提燈轉肩」。但此函數有寢宮特例，只要 `isBedchamberConsortProfile()` 命中就直接回傳床榻姿態，跳過關鍵字推斷。

#### 問題 3：`isBedchamberConsortProfile()` 判定（data.js 約 7105-7108 行）

```js
/寢宮|寵妃|床榻|臥榻|軟榻|王榻|睡衣寵妃|旗袍寵妃|魅魔寵妃|宮燈寵妃/
```

若 profile 只在 title 寫「現代睡衣」沒加「寵妃」，可能漏網。建議補上單字「睡衣」。

#### 問題 4：`actionQualityGuardText()` 補強是追加不是取代（data.js 約 7132-7139 行）

```
原始 sceneAction:    "側臥床榻，一手低持酒盞"
enrichSceneAction 後: "側臥床榻，一手低持酒盞｜全角色卡品質補強：...不必持酒杯..."
```

ChatGPT 同時看到「持酒盞」和「不必持酒杯」兩個矛盾指令，可能優先抓較早出現的舊動作。**這是核心衝突點。**

#### 問題 5：`normalizeSceneActionProps()` 與 `propInteractionPolicy()` 尚未建立

AI-TASK.md 已記錄的兩個修正函數都還不存在。

---

### 已確認正常的項目

| 項目 | 結論 |
|------|------|
| 重複 id | ✅ 0 個 |
| orphan parentCategory | ✅ 0 個 |
| coreSpec 同步 | ✅ 6,639 chars |
| 58 個測試全過 | ✅ |
| `isBedchamberConsortProfile()` 保護機制 | ✅ 存在且邏輯正確 |
| inferActionCueTexts() 寢宮特例 | ✅ 存在，優先回傳床榻姿態 |
| actionQualityGuardText() 寢宮保護 | ✅ 存在，明確排除酒杯、權杖、兵器、燭台 |

---

### 建議執行優先順序

#### P0（邏輯衝突，直接影響出圖）

1. **修改 `profileFactory.js` 第 75 行道具句**：
   - 現在：`${prop}作為角色記憶點，與手部動作自然互動`
   - 改為：`${prop}可依場景作為手持、支撐點、桌面、床邊、前景或近景道具，不必固定拿在手上`

2. **新增 `normalizeSceneActionProps(profile)`**（於 `enrichSceneAction()` 內）：
   寢宮類遇到「持酒杯/酒盞/燭台/宮燈（手持）/權杖」時，自動改寫為場景陳設（例：「酒盞置於床邊小几」、「宮燈作床邊光源」），在追加品質補強前先清理原始 sceneAction。

3. **`isBedchamberConsortProfile()` 正則補強**：
   加入單字「睡衣」，避免「現代睡衣」類 profile 漏網。

#### P1（資料清理）

4. 人工清理 `handcraftedConsortProfiles.js` 寢宮卡原始 sceneAction（74 組持杯 + 16 組硬道具）

#### P2（技術債）

5. 評估 bundle 拆包策略：dist 已達 1,436 KB，建議 dynamic import 或 JSON 外部化

---

### 函數位置（v8 更新）

| 函數 | 位置 |
|------|------|
| `createCuratedRoleProfile()` | `src/profileFactory.js` 行 35-90 |
| 第 8 層道具句 | `src/profileFactory.js` 行 75 |
| `inferActionCueTexts()` | `src/data.js` 約行 7074-7103 |
| `isBedchamberConsortProfile()` | `src/data.js` 約行 7105-7108 |
| `needsActionUpgrade()` | `src/data.js` 約行 7126-7130 |
| `fallbackActionDirection()` | `src/data.js` 約行 7110-7124 |
| `actionQualityGuardText()` | `src/data.js` 約行 7132-7139 |
| `enrichSceneAction()` | `src/data.js` 約行 7141-7157 |

---

*報告由 Claude Sonnet 4.6 生成，2026-06-07，未修改任何程式碼*

---
## 道具 / 姿態邏輯全檢查報告（2026-06-07）

### 目標
檢查全專案角色卡的「角色身份、主題、場景、人物設定、道具或不持道具、姿勢擺拍」是否一致，避免再出現「已經是寢宮寵妃，卻一直拿酒杯、權杖、燭台」這類場景邏輯不自然的出圖提示。

### 本次檢查範圍
- `src/data.js`
- `src/profileFactory.js`
- `src/profiles/**/*.js`
- `tests/promptEngine.test.js`
- 關鍵字：`酒杯`、`酒盞`、`茶盞`、`咖啡杯`、`權杖`、`燭台`、`宮燈`、`提燈`、`手持`、`持杯`、`持酒`、`托盞`、`端盞`、`持權杖`

### 現況結論
目前程式已經有一層寢宮保護規則：寢宮、寵妃、魅魔寵妃、睡衣寵妃、旗袍寵妃等角色，在輸出咒語時會追加「不必持酒杯、權杖、兵器或燭台」與床榻/軟枕/帷帳優先的姿態補強。

但問題尚未完全消失，因為很多舊角色卡的原始 `sceneAction` 仍然直接寫著「一手低持酒杯」「持酒盞」「提燈」「扶權杖」等動作。最後輸出的咒語會同時存在舊動作與新補強，ChatGPT 可能仍抓到舊動作，導致寢宮角色反覆拿杯子或硬道具。

### 實測統計

| 項目 | 數量 | 判斷 |
| --- | ---: | --- |
| 全角色卡 | 2,186 | 已掃描 |
| 寢宮 / 寵妃 / 魅魔寵妃類 | 350 | 需要套用寢宮姿態邏輯 |
| 寢宮類原始動作直接持杯、酒盞、杯盞 | 74 | 高優先清理 |
| 寢宮類原始動作直接使用權杖、燭台、提燈、細劍等硬道具 | 16 | 高優先清理 |
| 非寢宮但酒杯 / 茶盞 / 咖啡杯合理情境 | 127 | 多數可保留 |
| 非寢宮需人工再看 | 約 20 | 不建議批次全改 |

### 合理持物判準
以下情境持物是合理的，應保留：
- 酒吧、宴會、舞會、酒店、夜店、吧台：可持酒杯、香檳杯、紅酒杯。
- 茶館、茶席、古風書齋、藥師、療癒系：可端茶盞、藥盞。
- 戰鬥、武俠、騎士、軍武：可持劍、刀、弓、長槍。
- 祭司、魔法、神話、儀式：可持法器、權杖、聖杯，但要符合儀式場景。
- 旅拍、街拍、咖啡館：可持咖啡杯、手包、相機、地圖。

### 不合理或需降權判準
以下情境不應預設持物，應改成場景支撐點或自然手勢：
- 寢宮寵妃：優先床榻、軟枕、帷帳、床柱、扶手、外袍、披帛，不應反覆拿酒杯。
- 魅魔寵妃：可以有王座、床榻、暗色帷幕、角飾、尾飾、寶石、近景道具，但不要每張都持權杖或聖杯。
- 睡衣寵妃：應以床邊、晨光、絲質睡袍、抱枕、整理衣襟為主，不適合持酒或兵器。
- 旗袍寵妃：可倚窗、扶屏風、坐榻沿、手扶桌邊，不要硬塞杯子。
- 清朝 / 唐朝 / 漢朝 / 宋朝寵妃：若是宮宴可持杯，若是寢宮、內殿、私密坐榻則應改為扶榻、牽袖、撩簾、整理披帛。

### 結構性原因
1. `src/profileFactory.js` 的 `createCuratedRoleProfile()` 目前會把 `signatureProps` 寫成「作為角色記憶點，與手部動作自然互動」。這會讓所有道具都偏向被拿在手上，即使它更適合放在床邊、桌面、前景或作為背景陳設。
2. `src/data.js` 的 `inferActionCueTexts()` 是全域關鍵字推姿勢，例如看到 `燈` 就推 `提燈轉肩`，看到 `茶盞` 就推 `端盞低坐`。這對一般角色有用，但對寢宮角色應更場景化。
3. `actionQualityGuardText()` 的寢宮保護規則是追加在輸出後段，能補強但不能完全覆蓋舊角色卡原本的持物動作。
4. 新版手工寵妃共用函式已經較合理，但舊批量卡、魅魔擴充卡、暗黑簾幕卡、部分 style reference 仍殘留直接持物動作。

### 高優先修正方向
1. 新增 `propInteractionPolicy(profile)`：寢宮 / 寵妃類道具預設為床邊、桌面、前景、背景陳設或支撐點，不預設手持；酒吧、宴會、茶席、戰鬥、祭儀允許手持，並依身份限定合理道具。
2. 修改 `createCuratedRoleProfile()` 第 8 層道具句：由「與手部動作自然互動」改為「可依場景作為手持、支撐點、桌面、床邊、前景或近景道具，不必固定拿在手上」。
3. 新增 `normalizeSceneActionProps(profile)` 或同等清理邏輯：寢宮類遇到 `持酒杯 / 持酒盞 / 端盞 / 托盞`，改為酒盞置於床邊小几或前景托盤；遇到 `提燈 / 持燭台`，改為宮燈或燭台作床邊光源；遇到 `持權杖 / 扶權杖`，改為權杖靠在王座或床榻側邊。
4. 補測試：寢宮寵妃不可把酒杯、酒盞、燭台、權杖當主要手持動作；魅魔寵妃允許床榻、王座、帷幕、尾飾、角飾、近景聖杯，但不預設手持；吧台晚禮服名伶可保留紅酒杯；戰鬥、武俠、祭司類仍可依身份持武器或法器。

### 優先人工清理名單
- `bedchamber-consort-*`：多張有 `一手低持酒盞 / 酒杯`。
- `bedchamber-succubus-expanded-*`：多張有 `酒杯 / 酒盞 / 聖杯 / 權杖`。
- `hc-succubus-consort-*`：少數有 `提燈 / 權杖低靠身側`，建議改為道具在身側或背景。
- `wave5-dark-*-curtain-lord`：多張有 `一手分開帷幕，一手提住燭台`，寢宮或暗黑帷幕類應改成燭台作背景光源。

### 不建議改動名單
- `香檳酒紅・吧台晚禮服名伶`：吧台場景持紅酒杯合理。
- 唐風胡姬、宴會舞會、酒店名伶、歌劇院、藝廊、酒吧、咖啡館：杯子多數符合場景。
- 茶館、和風茶屋、藥師、書齋療癒系：茶盞或藥盞合理。
- 戰鬥、武俠、軍武、祭司、神話、魔法：武器、權杖、法器可保留，但要避免遮臉。

### 下一步建議
先做程式層的道具互動策略與寢宮持物清理，再逐一人工修掉 74 組持杯與 16 組硬道具寢宮動作。這件事不建議用單純批次取代，因為杯子在吧台、宴會、茶席是合理道具；問題只出在「場景身份不該拿卻被拿在手上」。

## ⚡ 補卡執行準則（2026-06-05，以此為準）

> 這份準則優先於下方所有舊報告。舊 v6/v5 報告與 wave 檔任務已全部作廢。

### 最新狀態
- 最新程式上架 commit：`46ed70b Expand red epic and landmark role cards`
- APP_VERSION：`v1.29`；tests：58/58 ✅、lint 乾淨 ✅、build 成功 ✅、UI 驗證 ✅
- 角色卡檔案重整已完成，`src/profiles/` 主題命名取代舊 wave 時間序命名
- 2026-06-05 v1.29 已上架：長相思紅衣封神 +30、世界頂級網紅地標 +30，`WORLD_LAYER_PROFILES` = 1,893，`iconic-checkin-*` = 77

### 新卡只能進 `src/profiles/`，不可新增 wave 檔

| 用途 | 目標檔案 |
|------|---------|
| 長相思紅衣封神系列（大型新批次） | 新建 `src/profiles/changxiangsiRedEpicProfiles.js` |
| 世界頂級網紅地標旅拍 / 爆款地標補卡 | `src/profiles/landmarkProfiles.js` |
| 世界景點旅拍 / 一般世界旅拍 | `src/profiles/landmarkDiverseProfiles.js` |
| 生活寫真 / 婚紗 / 海岸補卡 | `src/profiles/modernLifestyleProfiles.js` |
| style reference 新增 | `src/profiles/styleReferenceProfiles.js` |

### 補卡後必跑
```bash
npm run inventory:profiles   # 確認 id 無重複、數量正確
npm run test                 # 58 tests 必須全過
npm run check                # sync:spec + lint + test + build + verify:ui
```

### 更新 `src/profiles/index.js`
每新增或修改一個 profile 模組，`index.js` 的對應 export 必須同步更新。

### 精確說明（避免誤解）
- 「所有 profile 有 parentCategory」正確說法：**所有 profile 都能透過 `parentCategoryForProfile()` 解析到有效 UI 父分類，沒有 orphan**。部分舊卡沒有實體 `parentCategory` 欄位，但靠 inference 正確歸類。
- Wave 檔（`fourthWave`、`fifthWave`…`tenthWave`）現已移除，不能再用舊報告的 wave 路徑做任何操作。

---

## 全專案審查報告 v7（Claude 邏輯分析版）

日期：2026-06-05
最新 commit：`8a6f051 Update project check documentation`
執行：Claude Sonnet 4.6，完整掃描 src/profiles/、data.js、tests/、categoryClassifier、promptEngine，**未修改任何程式碼**

---

### 系統健康

| 項目 | 結果 |
|------|------|
| tests | ✅ **57/57** 通過（v6 為 56） |
| lint | ✅ 0 errors |
| build | ✅ 成功（1,182KB，chunk 警告存在） |
| git 狀態 | ✅ 乾淨，working tree clean |
| data.js 行數 | ✅ **7,386 行**（低於 7,600 保護閾值，且比 v6 的 7,478 減少了 92 行） |
| coreSpec 同步 | ✅ `doc/核心咒語規範.txt` 與 `src/coreSpec.js` 完全同步（6,179 chars，含 POSE_MODES、14.8:21、鏡頭景別） |

---

### 資料規模（v7 最新實測）

| 指標 | v6（06-04） | v7（06-05） | 變化 |
|------|------------|------------|------|
| WORLD_LAYER_PROFILES | 1,826 | **1,833** | +7 |
| ROLE_SUGGESTION_ITEMS | — | **1,798** | — |
| ROLE_CATEGORIES | 81 | **81** | 0 |
| data.js 行數 | 7,478 | **7,386** | -92 ✅ |
| dist JS | 1,174KB | **1,182KB** | +8KB |
| tests | 56 | **57** | +1（schema 測試） |

---

### 重大結構變化（v6 → v7）

Codex 在 v6 之後完成了角色卡檔案重整，這是本次最重要的變化：

**舊結構（時間序命名）：**
```
src/fourthWaveProfiles.js, fifthWave, sixthWave, seventhWave, eighthWave, ninthWave, tenthWave
```

**新結構（主題命名）：**
```
src/profiles/
  index.js                           ← 唯一出口（9 行）
  bulkExpansionProfiles.js           ← 1,810 行 / 75KB（原 fifth wave）
  culturalFantasyProfiles.js         ← 765 行 / 37KB（原 fourth wave + 唐代樂師）
  darkRoyalProfiles.js               ← 250 行 / 16KB（原 sixth wave）
  egyptianProfiles.js                ← 16 行 / 9KB（埃及系列）
  historicalAndStyleExpansionProfiles.js ← 363 行 / 52KB（原 ninth wave）
  landmarkDiverseProfiles.js         ← 143 行 / 54KB（原 seventh wave）
  landmarkProfiles.js                ← 53 行 / 43KB（地標打卡系列）
  modernLifestyleProfiles.js         ← 458 行 / 25KB（原 eighth wave）
  styleReferenceProfiles.js          ← 572 行 / 34KB（原 tenth wave）
```

`data.js` 現在只 import 一個出口：
```js
import { ... } from './profiles/index.js';
```

`src/profileFactory.js`（89 行）新增——統一的角色卡建立函數，供各 profile 模組使用。

---

### 父分類 profile 分布（v7 最新實測）

**最低量（≥10 全部達標，v6 孤兒問題已解）：**

| 父分類 | 數量 |
|--------|------|
| 海岸度假旅拍 | 10 |
| 室內生活寫真 | 10 |
| 東方旗袍夜宴 | 10 |
| 動漫次文化街拍 | 10 |
| 漢宮禮樂／長信宮燈／漢代仕女考據 | 10 |
| 魏晉風骨 / 宋韻雅集 / 明宮 / 清宮 | 各 10 |
| 東方和風旅拍 | 11 |
| 田園花園旅拍 | 11 |
| 高訂婚紗禮服 | 12 |
| 賽博機甲 / 科幻戰姬 | 13 |

✅ 無孤兒標籤，所有 profile 都映射到有效 PARENT_ROLE_CATEGORIES 條目（57th test 保護）。

---

### 問題分析

---

#### ⚠️ P1：`landmarkDiverseProfiles.js` 與 `landmarkProfiles.js` 仍為超長行格式

**現況：**
- `landmarkDiverseProfiles.js`：143 行 / **54KB**（平均每行 387 bytes）
- `landmarkProfiles.js`：53 行 / **43KB**（平均每行 830 bytes）

這兩個是從舊 `seventhWaveProfiles.js` 繼承來的單行格式——一整個 array row 壓成一行。可以正常運作，但：
- git diff 幾乎不可讀（整行變更）
- AI 協作時 context window 佔用大
- 人工審查幾乎不可能確認內容正確性

**建議**：下次觸碰這兩個檔案時順帶改成多行物件格式（參考 `styleReferenceProfiles.js` 的風格）。非阻塞，不需要立即改。

---

#### ⚠️ P1：`profiles/index.js` 出口仍使用 wave 名稱別名

**現況：**
```js
export { STYLE_REFERENCE_PROFILES as TENTH_WAVE_PROFILE_DEFS } from "./styleReferenceProfiles.js";
```

主題命名的好處被 wave 別名部分抵消——`data.js` 仍依賴 `TENTH_WAVE_PROFILE_DEFS` 這樣的 import 名。

**建議**：將 `data.js` 的 import 名稱改為主題名（如 `STYLE_REFERENCE_PROFILE_DEFS`），讓命名一致。改動範圍小，但需要同步更新 `data.js` 的聚合語法與測試裡對應的 assertion。非緊急。

---

#### ⚠️ P1：dist JS 1,182KB，Vite chunk 警告持續

**現況**：自 v5（570KB）到 v7（1,182KB），bundle 成長了一倍以上。主要原因是角色卡資料量持續增長，且未做任何 lazy load。

**重整後為何沒改善**：檔案搬移不影響 bundle size，Vite 仍把所有 profile 資料打包進同一個 chunk。

**選項**（依風險由低到高）：
- C（目前做法）：接受警告，繼續以 1.1MB+ bundle 運作。功能正常，上線不阻塞。
- B（中期）：把各 profile 模組改成 `dynamic import()`，首屏只載入 promptEngine + UI，profile 資料在使用者選分類時 lazy load。需改動 `data.js` 聚合邏輯與 categoryClassifier 初始化流程。
- A（激進）：把 profile 資料外部化為 JSON，runtime 再 fetch。改動最大，但 bundle 可降至 300KB 以下。

---

#### ℹ️ P2：`bulkExpansionProfiles.js` 仍是最大單一 profile 檔（1,810 行）

這是從 `fifthWaveProfiles.js` 直接更名而來，包含大量混雜主題卡片。功能正常，但長期看應進一步按主題拆分（例如分出 `xianxiaProfiles.js`、`wuxiaProfiles.js`）。目前是最低優先，不需要立即處理。

---

#### ℹ️ 已確認正常的項目

| 項目 | 結論 |
|------|------|
| coreSpec.js 與 doc/txt 同步 | ✅ 完全同步，6,179 chars，含 POSE_MODES / 新比例 / 鏡頭景別 |
| 父分類孤兒問題 | ✅ 全部修正，57th test 保護 |
| data.js 行數保護 | ✅ 7,386 行，低於 7,600 閾值 |
| profileFactory.js 新增 | ✅ 統一角色卡建立介面，良好抽象 |
| 重複 id | ✅ 0 個 |
| 所有 profile 有 parentCategory | ✅ 且映射到有效標籤 |
| promptEngine.js | 1,100 行（v6 為 1,008，增長 92 行，可能來自 POSE_MODES 指引擴充） |

---

### 建議執行順序

```
P1（本輪可做）：
1. profiles/index.js 出口改為主題名稱（移除 wave 別名）
   → 同步更新 data.js import 名稱與相關測試 assertion

2. landmarkDiverseProfiles.js + landmarkProfiles.js 改多行物件格式
   → 觸碰這兩個檔案時順帶改，不需要特地開一輪

P1（評估後決定）：
3. dist bundle 拆包策略
   → 選項 B（dynamic import）是最實際的中期方向
   → 需要 spike 確認改動範圍後再決定

P2（長期）：
4. bulkExpansionProfiles.js 按主題進一步拆分
   → 最低優先，等內容繼續增長後再評估
```

---

### 函數與檔案位置（v7 更新）

| 項目 | 位置 |
|------|------|
| Profile 出口 | `src/profiles/index.js` |
| Profile 工廠函數 | `src/profileFactory.js` |
| `parentCategoryForProfile()` 快速路徑 | `categoryClassifier.js L421` |
| `PARENT_ROLE_CATEGORIES` | `categoryClassifier.js L5` |
| `buildChatGptInstruction()` | `promptEngine.js`（約 L1044） |
| data.js 行數保護 test | `tests/promptEngine.test.js L219` |
| 角色卡 schema 驗證 test | `tests/promptEngine.test.js`（`f13b550` 新增） |
| coreSpec 權威來源 | `doc/核心咒語規範.txt` |
| coreSpec 自動生成 | `src/coreSpec.js`（`npm run sync:spec` 生成） |

---

*報告由 Claude Sonnet 4.6 生成，2026-06-05，未修改任何程式碼*

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

---

## 2026-06-05 全專案檢查與文件更新（Codex 最新狀態）

最新 commit：`7f74c26 Rebuild standalone HTML after profile refactor`

線上站台：<https://gxben0117-collab.github.io/prompt-generator-v2/>

### 本次檢查結果

| 項目 | 結果 |
| --- | --- |
| `npm run check` | 通過 |
| lint | 0 errors |
| tests | 57/57 passed |
| build | 成功 |
| verify:ui | desktop / mobile 通過 |
| consoleErrors | 0 |
| horizontalOverflow | false |
| profile inventory | 1833 profiles，duplicateIds 0 |
| orphan parentCategory | 0 |

### 最新資料規模

| 項目 | 數量 |
| --- | ---: |
| WORLD_LAYER_PROFILES | 1833 |
| ROLE_CATEGORIES | 81 |
| PARENT_ROLE_CATEGORIES | 37 |
| data.js 行數 | 7386 |
| standalone index.html | 612.04KB |
| dist JS | 1210.57KB |
| dist JS gzip | 392.16KB |

### 已完成的重要整理

- 已先備份完整專案：
  - `C:\AIProjects\002專案進行中\出圖自組咒語生產器_backup_20260604-231353`
- `doc/核心咒語規範.txt` 已確認為核心規範權威來源。
- `src/coreSpec.js` 已由 `npm run sync:spec` 正確生成，勿手動改。
- 角色卡資料已完成模組化：
  - 舊 `fourth/fifth/sixth/seventh/eighth/ninth/tenthWaveProfiles.js` 已移除。
  - 角色卡資料集中在 `src/profiles/`。
  - `src/data.js` 透過 `src/profiles/index.js` 匯入 profile defs。
- 已新增防線：
  - `scripts/profile_inventory.mjs`
  - `npm run inventory:profiles`
  - `tests/promptEngine.test.js` profile schema 測試

### 本次文件更新

- `docs/PROJECT.md`
- `docs/development-log/2026-06-05-profile-refactor-and-project-check.md`
- `docs/reports/2026-06-05-full-project-check.md`
- `AI-TASK.md`

### 待注意

- Vite 仍有 chunk > 800KB warning，屬 P2 bundle splitting 議題。
- 目前不影響功能、測試、UI 驗證或 GitHub Pages 部署。
- 未來新增角色卡請放入 `src/profiles/` 對應主題檔，不要再新增 wave 檔。
