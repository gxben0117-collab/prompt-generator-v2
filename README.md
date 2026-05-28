# 出圖自組咒語生產器 v1.16

真人電影級出圖咒語表單工具。主入口是可直接開啟的單檔 `index.html`，用來把使用者輸入的主題、服裝 Layer、妝容、場景、常用圖片尺寸與人物構圖組成「導演式生成層咒語」。

## 核心理念

最高原則：真人鎖臉優先於所有華麗主視覺，不讓角色滑回 AI 仙女臉。

人物必須是「真人演員被拍進奇幻電影世界」，不是重新設計 AI 美女角色。

工具會保護：

- 真人臉部辨識度
- 原始五官比例與骨相
- 真實成年人體比例
- 真人攝影感
- 電影級可穿戴服裝邏輯

## 如何使用

直接開啟：

```powershell
start index.html
```

或雙擊：

```text
啟動.bat
```

使用流程：

1. 選擇 `角色大分類`，或直接搜尋並套用下方世界觀模組塊
2. 在第一屏的 `選擇模板` 區塊挑一個角色模板
3. 進入 `詳細設定`，從 `目前模板角色` 狀態卡開始調整分類、常用圖片尺寸與人物鏡頭
4. 選擇 `電影主視覺模式`、`色彩張力`、`布料動態`
5. 微調 `主題（必填）`
6. 調整 `服裝 Layer 1-10`
7. 填寫 `妝容` 和 `場景`
8. 需要時按 `自動補導演欄位`
9. 按 `完成出圖咒語`
10. 按 `複製完整咒語`
11. 在 ChatGPT 上傳真人照片並貼上咒語

## 開發流程

原始碼在 `src/`，建置後會輸出成單檔 `index.html`。

```powershell
npm.cmd run check
```

`check` 會依序執行：

- 同步 `doc/核心咒語規範.txt` 到 `src/coreSpec.js`
- ESLint
- Vitest
- Vite build
- 產生單檔 `index.html`
- Playwright 直接用 `file://` 驗證 HTML

單獨建置：

```powershell
npm.cmd run build
```

## 專案結構

```text
index.html                         # 可直接開啟的單檔成品
versions/                          # 舊版 index.html 快照
src/main.js                        # UI 表單與互動
src/promptEngine.js                # 咒語生成架構
src/data.js                        # 常用尺寸、人物構圖、服裝 Layer、模板資料
src/styles.css                     # UI 樣式與 responsive
doc/核心咒語規範.txt                # 隱藏核心規則來源
scripts/prepare-vite-entry.mjs     # build 前還原 Vite 入口
scripts/create_standalone_html.mjs # build 後內嵌 JS/CSS
scripts/verify-ui.mjs              # file:// HTML UI 驗證
tests/promptEngine.test.js         # prompt engine 測試
```

## 版本控制規範

每次更新 `index.html` 前，先把上一版成品保存到 `versions/`。v0.88 已保留：

```text
versions/index_v0.87_before_v0.88.html
versions/index_v0.88_before_v0.89.html
versions/index_v0.89_before_v0.90.html
versions/index_v0.90_before_v0.91.html
versions/index_v0.91_before_v0.92.html
versions/index_v0.92_before_v0.93.html
versions/index_v0.93_before_v0.94.html
versions/index_v0.94_before_v0.95.html
versions/index_v0.95_before_v0.96.html
versions/index_v0.96_before_v0.97.html
versions/index_v0.97_before_v0.98.html
versions/index_v0.98_before_v0.99.html
versions/index_v0.99_before_v1.00.html
versions/index_v1.00_before_v1.01.html
versions/index_v1.01_before_v1.02.html
versions/index_v1.02_before_v1.03.html
versions/index_v1.03_before_v1.04.html
versions/index_v1.04_before_v1.05.html
versions/index_v1.05_before_v1.06.html
```

建置驗證通過後，再保存當前正式版：

```text
versions/index_v0.91.html
versions/index_v0.92.html
versions/index_v0.93.html
versions/index_v0.94.html
versions/index_v0.95.html
versions/index_v0.96.html
versions/index_v0.97.html
versions/index_v0.98.html
versions/index_v0.99.html
versions/index_v1.00.html
versions/index_v1.01.html
versions/index_v1.02.html
versions/index_v1.03.html
versions/index_v1.04.html
versions/index_v1.05.html
versions/index_v1.06.html
versions/index_v1.07.html
versions/index_v1.08.html
versions/index_v1.09.html
versions/index_v1.10.html
versions/index_v1.11.html
versions/index_v1.12.html
versions/index_v1.13.html
versions/index_v1.14.html
versions/index_v1.15.html
versions/index_v1.16.html
```

## 版本重點

- `v1.16`：備份 v1.15 角色卡資料與單檔成品後，新增 100 張完整角色卡，10 個角色大分類各 10 張，涵蓋歷史小說名著、漢唐宋、武俠戰場、仙俠神話、絲路西域、暗黑王族、西方古典、台灣/大陸景點、現代都市與花園自然精靈。
- `v1.16`：新增批量角色卡 factory 與明確 `parentCategory` 欄位，分類器優先讀取角色卡大分類，避免跨題材關鍵字讓模板被錯分。
- `v1.15`：依據風格範例新增 `多肉花房・緞粉女神`、`玫瑰晶翼・花園精靈女王` 兩張完整角色卡，將範例咒語轉為真人鎖臉、禮服遮覆、商業奇幻花園主視覺欄位。
- `v1.15`：`歷史小說名著人物` 擴充 15 位完整角色卡，涵蓋三國、紅樓夢與金庸系列；每張卡皆補齊 10 Layer、妝容、場景、環境、動作與光影。
- `v1.13`：修正角色卡場景殘留。套用缺少場景欄位的舊 Layer 卡時，會清空上一張角色卡的場景、環境、動作與光影，避免赤金秘殿等舊場景被誤帶。
- `v1.14`：新增角色大分類 `歷史小說名著人物`，首張範本為 `小喬・傾國佳人`，完整包含三國演義東吳名姬服裝 Layer、妝容、江東水榭場景、動作與光影。
- `v1.14`：`奇幻異世界 / 暗黑王族` 角色卡罩杯欄位統一預設為 `K`，其他模板與空白欄位預設填入 `正常比例`，並寫入短版咒語的 `真實人體骨架`。
- `v1.13`：角色卡新增 `罩杯` 欄位。套用暗黑王族模板時會依角色卡欄位寫入，其他模板與空白欄位預設填入 `正常比例`。
- `v1.13`：重構最終輸出架構。核心母板保留為程式內部治理規則，但畫面上複製給 ChatGPT 的內容改為短版實際出圖咒語，不再輸出整本 V4.0 母板。
- `v1.13`：短版咒語固定依序輸出鎖臉、分類、主題、風格、構圖、服裝、妝容、場景、動作、光影與負面，避免規範書式判斷文字壓過主題。
- `v1.13`：暗黑王族 / 夜宴魅魔仍會由母板內部套用比例、人身穩定、背景路人控制與商業奇幻亮場策略，但最終提示只保留可直接出圖的必要句。
- `v1.12`：修正暗黑王族 / 夜宴魅魔生成層比例漂移。移除生成層 `罩杯:J`、馬甲垂褶、托臉、王座坐姿與成熟豐滿預設，改成依上傳真人原始體型自然延伸、4:5 商業海報與 standing full-body cinematic composition。
- `v1.12`：常用圖片尺寸改為一般出圖用途標籤，預設 `4:5 商業海報`，並保留 `9:16 手機桌布`、方形、直式、橫式、寬銀幕等常用畫幅。
- `v1.12`：固定母板在 `【真實人體骨架】` 保留 `- 罩杯j`，但生成層不再把暗黑分類轉成罩杯驅動或 pin-up 身材指令。
- `v1.11`：新增輸出比例控制系統。生成層會把 `9:16`、`4:5`、`16:9`、`2.39:1` 等畫幅寫入場景導演層，要求構圖服從指定畫幅並保留完整電影輪廓。
- `v1.11`：新增真人比例穩定系統。鎖臉不得造成頭大、肩窄、軀幹壓縮或「臉貼在服裝上」的 AI 感，並針對坐姿/王座姿勢補強胸腔厚度與成人身體比例。
- `v1.10`：強化臉部主控鎖臉。生成層會先鎖定上傳照片原始真人臉，再讓身體、服裝、姿勢、髮型、妝容、光影與場景配合該臉部。
- `v1.10`：輸出前自動淨化高換臉風險姿勢詞，將 `over-shoulder`、大幅回眸、側身回望、側臉、低頭、仰頭等改成正面或微側正面凝視鏡頭。
- `v1.09`：重整角色大分類 mapping。大分類只看模板標題、主題、分類、id 與別名，不再掃服裝 Layer / 場景全文，避免西方、暗黑、世界景點模板被「古裝」「神話」「花園」等泛詞誤吸。
- `v1.09`：修正 `中國歷代服裝` 不再顯示墮羽夜庭魔姬、凡爾賽花庭公主；`仙俠神話 / 古裝陸劇` 不再顯示雅典神殿祭儀。
- `v1.08`：新增背景角色控制與商業奇幻亮場系統。生成層預設為單女主電影海報，背景以建築、光影、水霧、燈籠、布料與空間透視撐場；只有宮廷宴會、戰場、市集、宗教儀式、王朝典禮等必要主題才允許少量 `small-scale cinematic silhouettes`。
- `v1.08`：暗黑王族、夜宴魅魔、月夜女王、紫晶神女、黑玫瑰女王等主題會自動加入 `Commercial Fantasy Glamour Lighting`，避免臉部壓暗、黑色服裝死黑、珠寶無高光。
- `v1.08`：清理容易造成背景路人與設定卡感的觸發詞，生成層不再用 `movie still`、`grand oriental fantasy spectacle`、`environmental storytelling`、`遠景群演` 等舊語意。

## 目前輸出架構

核心母板仍保留在程式內作為治理規則，但最終複製給 ChatGPT 的咒語是短版實際出圖指令，不再輸出完整 V4.0 母板。

```text
請根據上傳真人照片生成 ...
鎖臉與真實人體
分類 / 主題 / 風格
構圖
服裝
妝容
場景
動作
光影
負面
```

程式會先用母板規則處理 UI 條件，再壓縮成可直接貼進 ChatGPT 出圖的咒語。圖片比例會明確寫入短版構圖段，例如 `4:5 premium commercial fantasy poster` 或 `9:16 cinematic mobile wallpaper`。

## 驗證狀態

目前已通過：

- lint
- unit test
- build
- 桌機 UI 驗證
- mobile UI 驗證
- `file:// index.html` 直接開啟驗證
- console error 檢查





