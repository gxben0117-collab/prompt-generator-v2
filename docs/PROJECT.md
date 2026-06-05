# 專案文件：出圖自組咒語生產器

最後更新：2026-06-05

## 專案定位

本專案是「真人電影級出圖咒語」單頁工具，核心目標是把上傳真人照片、角色模板、服裝 Layer、妝容、場景、構圖與負面限制，整理成可直接貼進 ChatGPT 出圖的短版咒語。

最高原則是鎖定真人臉部辨識度與真實人體比例。角色卡可以很華麗，但輸出不應滑向 AI 仙女臉、假人比例、服裝貼臉或背景路人搶戲。

正式入口：

- 本地成品：`index.html`
- 線上站台：https://gxben0117-collab.github.io/prompt-generator-v2/
- GitHub repo：`gxben0117-collab/prompt-generator-v2`

## 使用者工作流

1. 開啟 `index.html` 或線上站台。
2. 選擇角色大分類，或直接搜尋並套用模板角色卡。
3. 調整常用圖片尺寸、人物鏡頭、電影主視覺模式、色彩張力與布料動態。
4. 補主題、10 層服裝 Layer、妝容、場景、環境、動作與光影。
5. 必要時使用 `自動補導演欄位`。
6. 按 `完成出圖 + 複製完整咒語`。
7. 在 ChatGPT 上傳真人照片，貼上複製出的短版咒語。

## 目前重要功能

### 姿態模式與全角色卡品質補強

工具已新增「姿態模式」控制，可選自動推薦、踏階行走、扶欄回身、倚靠坐姿、王座端坐、臨案坐姿、轉身抓拍、低位坐靠與自然站姿。

資料層會對所有 `WORLD_LAYER_PROFILES` 追加「全角色卡品質補強」，要求姿態具備明確支撐點、可拍攝動作、臉部不可被手/道具/布料遮擋，且肩頸、胸腔、骨盆、膝踝與受力方向符合真實成年人體結構。這是為了降低角色卡套用後滑回筆直站姿或證件照站姿的機率。

相關資料與驗證點：

- 姿態模式選項：`src/data.js` 的 `POSE_MODES`
- 動作補強：`src/data.js` 的 `enrichSceneAction()`
- 分類姿態推薦：`src/promptEngine.js` 的 `autoPoseBiasText()`
- 測試覆蓋：`tests/promptEngine.test.js`

### 角色卡模組化資料架構

角色卡資料已從時間序 wave 檔重整為 `src/profiles/` 主題模組，`src/data.js` 只透過 `src/profiles/index.js` 聚合匯入。這讓後續新增、查找與審查角色卡時不用再記憶「第幾波」加入，而是依資料主題定位。

目前角色卡資料現況：

- `WORLD_LAYER_PROFILES`：1893 張
- `ROLE_CATEGORIES`：81
- `PARENT_ROLE_CATEGORIES`：37
- profile inventory：無重複 id
- orphan parentCategory：0

目前 profile 模組：

- `src/profiles/changxiangsiRedEpicProfiles.js`
- `src/profiles/bulkExpansionProfiles.js`
- `src/profiles/culturalFantasyProfiles.js`
- `src/profiles/darkRoyalProfiles.js`
- `src/profiles/egyptianProfiles.js`
- `src/profiles/historicalAndStyleExpansionProfiles.js`
- `src/profiles/landmarkDiverseProfiles.js`
- `src/profiles/landmarkProfiles.js`
- `src/profiles/modernLifestyleProfiles.js`
- `src/profiles/styleReferenceProfiles.js`
- `src/profiles/index.js`

資料守門：

- `scripts/profile_inventory.mjs` 可盤點角色卡總數與重複 id。
- `tests/promptEngine.test.js` 會驗證 profile schema、10 層服裝 Layer、父分類可解析且可見於 UI。

### 世界頂級網紅地標旅拍

此分類已獨立拉出為父分類，用來收納全球高辨識度旅拍地標角色卡。分類用途是讓威尼斯、自由女神像、台北 101、上海灘、金字塔、人面獅身像、倫敦塔橋等「一眼可辨識」網紅打卡場景，不再混在一般世界景點旅拍中。

目前此分類 `iconic-checkin-*` 共 77 張。v1.29 新增 30 張爆款地標角色卡，包含東方明珠、陸家嘴、萬里長城、北京故宮、大唐不夜城、杭州西湖、太平山頂、澳門巴黎人、東京晴空塔、大阪道頓堀、巴黎凱旋門、蒙馬特、聖馬可廣場、五漁村、阿瑪菲海岸、米克諾斯風車、大笨鐘、布達佩斯漁人堡、馬特洪峰、新天鵝堡、聖米歇爾山、棉堡、齋浦爾風之宮、阿布辛貝、金門大橋、拉斯維加斯大道、芝加哥雲門、羚羊峽谷、杜拜未來博物館與芬蘭極光玻璃屋。

相關資料與驗證點：

- 角色卡 id 前綴：`iconic-checkin-*`
- 分類邏輯：`src/categoryClassifier.js`
- 角色卡資料：`src/profiles/landmarkProfiles.js`
- 測試覆蓋：`tests/promptEngine.test.js`
- UI 驗證：`scripts/verify-ui.mjs`


### 長相思紅衣封神旅拍

v1.29 新增 `src/profiles/changxiangsiRedEpicProfiles.js`，收納 30 張「長相思紅衣封神」大型旅拍角色卡，分為三組：

- 紅巾飛天：大漠、鳴沙、懸崖、雲海、雪城等紅巾與紅綾大動態。
- 女將軍：城樓、戰旗、長槍、雪原、邊城等戰場女將軍主視覺。
- 抖音爆款：城牆奔跑、回首紅巾、紅傘雪城、萬燈夜行、山巔展翼等短影音強記憶點。

此批角色卡全部歸入 `長相思旅拍` 父分類，id 前綴為 `changxiangsi-red-epic-*`，並由測試確認 30 張全數存在、父分類正確、10 層服裝 Layer 完整。
### 短版實際出圖咒語

核心母版仍作為內部治理規則使用，但畫面複製出去的是短版實際出圖指令。輸出順序固定為：

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

這個設計是為了減少長母版文字壓過使用者主題，同時保留鎖臉、真人比例、服裝可穿戴性、背景控制與畫幅要求。

## 核心架構

```text
index.html                         # 單檔成品，GitHub Pages 入口
src/main.js                        # UI 表單、互動、模板套用與輸出流程
src/promptEngine.js                # 咒語生成、壓縮、鎖臉與分類治理
src/data.js                        # 尺寸、構圖、服裝 Layer 與角色卡聚合入口
src/profiles/                      # 角色卡主題模組
src/profileFactory.js              # 角色卡建立工廠
src/categoryClassifier.js          # 角色大分類判斷
src/styles.css                     # 版面、響應式與視覺樣式
doc/核心咒語規範.txt                # 固定母版來源
src/coreSpec.js                    # 由固定母版同步產生，勿手改
scripts/prepare-vite-entry.mjs     # Vite entry 準備
scripts/create_standalone_html.mjs # 產生單檔 index.html
scripts/sync-core-spec-module.mjs  # 同步固定母版到 JS module
scripts/profile_inventory.mjs      # 角色卡 inventory / 重複 id 檢查
scripts/verify-ui.mjs              # Playwright file:// UI 驗證
tests/promptEngine.test.js         # prompt engine 與分類測試
versions/                          # 歷史單檔 release 快照
docs/                              # 專案文件、報告、任務與架構記錄
dist/                              # Vite 暫存輸出，不作主要維護入口
```

核心資料流：

```text
doc/核心咒語規範.txt
  -> npm.cmd run sync:spec
  -> src/coreSpec.js
  -> npm.cmd run build
  -> index.html
  -> GitHub Pages
```

## 開發與驗證指令

完整檢查：

```powershell
npm.cmd run check
```

`check` 會依序執行：

- `sync:spec`
- `lint`
- `test`
- `build`
- `verify:ui`

常用單項指令：

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run test
npm.cmd run lint
npm.cmd run verify:ui
npm.cmd run inventory:profiles
```

最新全專案檢查結果：

- 日期：2026-06-05
- 指令：`npm.cmd run check`
- 結果：通過
- Vitest：57 passed
- Profile inventory：1833 profiles，duplicateIds 0
- UI 驗證：desktop / mobile 通過
- Console errors：0
- 橫向 overflow：未發現
- 備註：Vite large chunk warning 仍會出現，屬於大量角色卡資料打包進單頁成品的已知提醒，不影響輸出。

## 上架流程

目前 GitHub Pages 已可使用：

```text
https://gxben0117-collab.github.io/prompt-generator-v2/
```

正式更新流程：

```powershell
npm.cmd run check
git status --short
git add -A
git commit -m "Update project"
git push origin main
```

推送後 GitHub Actions 會部署 Pages。需要確認部署時可查看：

```powershell
gh run list --workflow=deploy.yml
```

## 維護規則

- 日常修改優先改 `src/`、`doc/`、`tests/`，不要把 `index.html` 當主要開發入口。
- 不手改 `src/coreSpec.js`；要改固定母版請改 `doc/核心咒語規範.txt`，再跑 `npm.cmd run sync:spec` 或 `npm.cmd run check`。
- 不手改 `dist/`；它是 Vite build 暫存輸出。
- 修改角色卡分類時，要同步檢查 `src/data.js`、`src/categoryClassifier.js`、測試與 `scripts/verify-ui.mjs`。
- 新增大量角色卡後，允許 Vite large chunk warning 存在；只有功能錯誤、測試失敗、UI 驗證失敗或輸出異常才視為阻塞。
- `versions/` 保留歷史單檔快照，不應用清理暫存的方式刪除。
- `scripts/maintenance/` 內多為歷史批次維護工具，重跑前要先檢查硬編碼路徑與資料影響。
- GitHub Pages 部署 repo 根目錄；新增大型暫存檔、輸出圖、報告或備份前，先判斷是否應追蹤進 git。

## 文件地圖

- `README.md`：給使用者與開發者的快速入口。
- `docs/PROJECT.md`：目前專案現況、維護規則與交接手冊。
- `docs/project-organization-report.md`：整理與搬移紀錄。
- `docs/architecture/`：架構補充文件。
- `docs/deployment/`：歷史部署筆記與 GitHub Pages 說明。
- `docs/development-log/`：版本開發記錄。
- `docs/reports/`：檢查與分析報告。
- `docs/tasks/`：任務拆解與執行紀錄。

## 下一次接手優先檢查

1. `git status --short` 確認工作樹。
2. `npm.cmd run check` 確認完整流程。
3. 若改分類或角色卡，先看 `src/data.js` 與 `src/categoryClassifier.js`。
4. 若改母版，先看 `doc/核心咒語規範.txt`，不要直接改 `src/coreSpec.js`。
5. 若要上架，確認 `index.html` 已由 build 更新，再 commit / push / 查 GitHub Actions。
