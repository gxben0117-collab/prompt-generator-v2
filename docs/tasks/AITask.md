# AI Task - 咒語模板模組化改造

**任務來源：** `doc/XXXXXX.txt` 評審報告分析  
**任務日期：** 2026-06-13  
**優先級：** HIGH  
**預估工時：** 3-5 天

---

## 問題定義

當前咒語生成系統存在**古裝模板殘留問題**，以下元素出現率超過 80%，但只適合特定主題：

| 問題元素 | 適用主題 | 不適用主題 | 副作用 |
|---|---|---|---|
| `透明外紗/披帛/斗篷/外袍` | 仙俠、宮廷、神女 | 巴黎咖啡館、上海藝廊、都市旅拍 | 現代場景出現披帛違和 |
| `大型外袍/披風/戰袍` | 皇后、女帝、魔后、將軍 | 麗江旅拍、蘇州園林、藝廊開幕 | 旅拍變成武俠劇 |
| `dominant cinematic silhouette` | 女王、祭司 | 咖啡館名媛、策展人 | 過於戲劇化 |
| `extra-long flowing silk drapery` | 仙俠、奇幻、神話 | 咖啡館、都市、現代街拍 | 不符合場景邏輯 |
| `高亮商業古裝電影海報` | 古裝系列 | 現代都市系列 | 風格錯位 |

**核心問題：** 通用模板無法根據主題分類自動切換服裝/動作/光影元素。

---

## 目標

建立**主題條件式模組化系統**，實現：

1. **核心模板永久保留**（身份鎖定、真人骨架、構圖、安全姿態）
2. **服裝/動作/光影模組依主題自動切換**
3. **消除主題不相容元素的自動注入**

---

## 解決方案

### Phase 1: 模組定義與分類

#### 核心模板（永久保留，所有主題共用）

```yaml
身份鎖定:
  - 保留原始臉型/眼型/鼻型/嘴型/下顎線
  - 保留五官比例/成熟年齡感/真實皮膚紋理
  - 不換臉/不生成新演員臉/不漂移成網紅臉

真人骨架:
  - 平衡肩寬/鎖骨/胸腔厚度/軀幹深度
  - 骨盆比例/四肢比例/人體重心
  - 避免頭大/肩窄/軀幹壓縮/AI娃娃比例

構圖:
  - 50mm/中遠景/9:16/單人主角/全身完整入鏡
  - 不裁頭/不裁手/不自拍感

妝容規則:
  - 妝容只影響色彩/質地/光澤
  - 不重塑五官/不重塑臉型
  - 保留真實皮膚紋理

安全姿態:
  - 臉部正面或微側正面/手不遮臉
  - 肩頸/脊椎/骨盆/四肢合理受力

負面詞:
  - AI beauty face, influencer face, doll face, anime face
  - twisted anatomy, face swap, new actress face
  - plastic skin, cheap cosplay, game skin outfit
```

#### 服裝模組（依主題切換）

```yaml
皇后模組:
  layer4: 透明外紗、披帛、斗篷、外袍自然垂落
  layer6: 大型外袍、裙擺、披風、戰袍
  silhouette: dominant cinematic silhouette
  material: 絲綢、金線、寶石鑲邊

旅拍模組:
  layer4: 輕便外套、圍巾、披肩
  layer6: 去除（或僅保留風衣/大衣）
  silhouette: natural travel outfit
  material: 棉麻、針織、輕薄布料

都市模組:
  layer4: 風衣、西裝外套、羊毛披肩
  layer6: 去除
  silhouette: modern urban fashion
  material: 高訂面料、羊毛、絲質襯衫

仙俠模組:
  layer4: 透明外紗、仙氣披帛、流雲斗篷
  layer6: extra-long flowing silk drapery、airborne translucent shawls
  silhouette: ethereal flowing silhouette
  material: 輕紗、水袖、飄帶

祭司模組:
  layer4: 神殿祭服外紗、聖袍披肩
  layer6: 古典垂褶長裙（去除戰袍）
  silhouette: ceremonial robe silhouette
  material: 亞麻、羊毛、金線刺繡
```

#### 動作模組（依主題切換）

```yaml
旅拍動作:
  - 坐於石階/水巷
  - 扶欄回望
  - 踏步抓拍
  - 背包/手鼓作為道具

宮廷動作:
  - 撫琴/倚案
  - 扶欄倚窗
  - 持扇/持燈
  - 臨鏡梳妝

神話動作:
  - 踏蓮/雲階
  - 持法器/托銀杯
  - 扶石柱回身
  - 立於神壇前

都市動作:
  - 端咖啡/翻書
  - 倚窗凝視
  - 坐於吧台/沙發
  - 手持手機/筆記本
```

#### 光影模組（依主題切換）

```yaml
都市攝影:
  主光: 自然窗光、街燈、咖啡館暖光
  輔光: 霓虹反射、玻璃折射
  色溫: 中性偏暖
  風格: Editorial Fashion Photography

高端旅拍:
  主光: 黃昏暖光、自然日光
  輔光: 水面反射、雪山冷光
  色溫: 冷暖對比
  風格: Cinematic Travel Photography

宮廷金光:
  主光: 宮燈、燭火、金箔反射
  輔光: 月光透窗、燈籠串
  色溫: 暖金調
  風格: 高亮商業古裝電影海報

雪山冷光:
  主光: 雪地反射、天空散射
  輔光: 遠山冷藍、暮色
  色溫: 冷調
  風格: 電影級風光旅拍

神殿天光:
  主光: 高亮天窗主光
  輔光: 大理石反射、月金邊緣光
  色溫: 聖潔冷暖平衡
  風格: 史詩電影光影
```

---

### Phase 2: 主題分類系統

建立主題標籤與模組映射：

```javascript
const THEME_MODULES = {
  // 古裝系列
  '仙俠': { costume: '仙俠模組', action: '神話動作', light: '宮廷金光' },
  '宮廷': { costume: '皇后模組', action: '宮廷動作', light: '宮廷金光' },
  '神話': { costume: '仙俠模組', action: '神話動作', light: '神殿天光' },
  '暗黑王族': { costume: '皇后模組', action: '宮廷動作', light: '宮廷金光' },
  
  // 旅拍系列
  '世界景點旅拍': { costume: '旅拍模組', action: '旅拍動作', light: '高端旅拍' },
  '麗江古城': { costume: '旅拍模組', action: '旅拍動作', light: '高端旅拍' },
  '蘇州園林': { costume: '旅拍模組', action: '旅拍動作', light: '高端旅拍' },
  
  // 都市系列
  '巴黎咖啡館': { costume: '都市模組', action: '都市動作', light: '都市攝影' },
  '上海藝廊': { costume: '都市模組', action: '都市動作', light: '都市攝影' },
  '杜拜哈里發塔': { costume: '都市模組', action: '都市動作', light: '都市攝影' },
  
  // 史詩系列
  '歐陸史詩': { costume: '祭司模組', action: '神話動作', light: '神殿天光' },
  '西方古典': { costume: '祭司模組', action: '神話動作', light: '神殿天光' },
};
```

---

### Phase 3: 實作步驟

#### Step 1: 更新核心規範檔案

**檔案：** `doc/核心咒語規範.txt`

- 新增模組定義區段
- 定義主題分類與模組映射表
- 標記核心模板與可選模組

#### Step 2: 同步至 coreSpec.js

**檔案：** `src/coreSpec.js`

```bash
npm run sync:spec
```

#### Step 3: 修改角色卡生成邏輯

**目標檔案：** `src/???`（需確認實際檔案路徑）

```javascript
function generatePrompt(roleCard, theme) {
  const coreTemplate = getCoreTemplate(); // 核心模板永久保留
  const modules = THEME_MODULES[theme] || THEME_MODULES['仙俠']; // 預設仙俠
  
  const costumeModule = getCostumeModule(modules.costume);
  const actionModule = getActionModule(modules.action);
  const lightModule = getLightModule(modules.light);
  
  return assemblePrompt({
    core: coreTemplate,
    costume: costumeModule,
    action: actionModule,
    light: lightModule,
    roleData: roleCard
  });
}
```

#### Step 4: 建立模組庫檔案

**新增檔案結構：**

```
src/modules/
├── core.js           # 核心模板（永久保留）
├── costume.js        # 服裝模組庫
├── action.js         # 動作模組庫
├── light.js          # 光影模組庫
└── themeMapping.js   # 主題映射表
```

#### Step 5: 更新測試

**檔案：** `tests/???`

- 測試主題分類正確性
- 測試模組切換不出錯
- 測試不相容元素不會混入

#### Step 6: 驗證

```bash
npm run check
```

---

## 預期成果

### Before（當前問題）

**巴黎咖啡館主題** 生成時仍包含：
```
❌ 透明外紗、披帛、斗篷
❌ 大型外袍、戰袍
❌ dominant cinematic silhouette
❌ 高亮商業古裝電影海報
```

### After（改造後）

**巴黎咖啡館主題** 自動使用：
```
✓ 核心模板（身份鎖定、真人骨架、構圖、安全姿態）
✓ 都市模組（風衣、西裝外套、羊毛披肩）
✓ 都市動作（端咖啡、翻書、倚窗凝視）
✓ 都市攝影（自然窗光、街燈、咖啡館暖光）
✓ Editorial Fashion Photography 風格
```

---

## 風險與注意事項

1. **向後相容性** — 現有角色卡可能依賴舊模板，需要遷移計畫
2. **預設模組選擇** — 未分類主題需要合理預設值
3. **模組組合衝突** — 某些模組組合可能不相容，需要規則驗證
4. **文檔同步** — `doc/核心咒語規範.txt` 和 `src/coreSpec.js` 需保持一致

---

## 相關檔案

- `doc/XXXXXX.txt` — 原始評審報告
- `doc/核心咒語規範.txt` — 核心規範檔案（待更新）
- `src/coreSpec.js` — 同步後的模組檔案
- `scripts/sync-core-spec-module.mjs` — 同步腳本

---

## 下一步行動

- [ ] 確認 `src/` 目錄下角色卡生成邏輯的實際檔案路徑
- [ ] 讀取 `doc/核心咒語規範.txt` 了解當前結構
- [ ] 設計模組化改造的具體實作方案
- [ ] 建立 `src/modules/` 目錄結構
- [ ] 撰寫模組切換邏輯
- [ ] 更新測試覆蓋
- [ ] 執行 `npm run check` 驗證

---

**備註：** 本任務需要與 `doc/核心咒語規範.txt` 和現有角色卡系統深度整合，建議先完整掃描 `src/` 目錄結構再開始實作。
