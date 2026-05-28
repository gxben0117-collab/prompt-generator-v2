# 專案整理報告

更新日期：2026-05-29

本文件記錄 `出圖自組咒語生產器` 目前結構、混亂點、已完成整理、建議保留清單與後續改善方向。

## 專案定位

本專案是 Vite + Node 的靜態單頁工具。核心功能是把角色卡、服裝 Layer、妝容、場景、比例、鏡頭與母板治理規則整理成可直接貼到 ChatGPT 出圖的短版咒語。

正式輸出是根目錄 `index.html`，可直接用瀏覽器開啟，也會由 GitHub Pages 部署。

## 目前資料夾用途

| 路徑 | 目前用途 | 建議定位 |
| --- | --- | --- |
| `.github/workflows/` | GitHub Pages 部署流程 | 保留，部署設定 |
| `src/` | 正式前端原始碼、角色資料、prompt engine | 保留，核心原始碼 |
| `tests/` | Vitest 測試 | 保留，自動化測試 |
| `scripts/` | build/verify 腳本與大量一次性資料修補腳本 | 建議拆分正式腳本與 maintenance 腳本 |
| `doc/` | 核心母板來源與訪談紀錄 | 保留，母板來源文件 |
| `核心資料/` | 大型規範、風格範例、服飾結構資料 | 建議整理到 `docs/core/` 或保持為資料庫資料夾 |
| `versions/` | 歷史單檔 `index.html` 快照 | 保留，release archive |
| `backups/` | 手動備份資料 | 保留，manual backup |
| `archive/` | legacy、experimental、misc 保留區 | 保留，不作為正式入口 |
| `dist/` | Vite build 輸出 | 不追蹤，output |
| `node_modules/` | npm 安裝依賴 | 不追蹤，dependency cache |
| `docs/` | 正式文件、部署文件、報告與 task 文件 | 文件入口 |

## 根目錄混亂點

目前根目錄同時包含正式入口、開發設定、報告文件、部署文件、暫存檔與可能的 legacy 檔案。

建議根目錄只保留：

- `index.html`
- `package.json`
- `package-lock.json`
- `README.md`
- `.gitignore`
- `eslint.config.js`
- `啟動.bat`
- 主要資料夾：`.github/`, `src/`, `tests/`, `scripts/`, `doc/`, `docs/`, `versions/`, `backups/`, `核心資料/`

## 混亂、重複、暫存、測試資料

| 檔案 / 資料夾 | 觀察 | 建議 |
| --- | --- | --- |
| `debug.log` | log 暫存，已由 `.gitignore` 忽略 | 保留本機，不提交 |
| `archive/misc/test.txt` | 小型測試檔 | 已移至 archive 保留 |
| `docs/tasks/AITask.md` | 空 task 檔案 | 已移至 tasks |
| `archive/legacy/core.js` | 舊版或 legacy 單檔核心，未在目前 Vite app 被引用 | 已移至 legacy |
| `docs/deployment/GitHub部署說明.md` | 部署文件 | 已移至 deployment |
| `docs/reports/上架成功報告.md` | 上架報告 | 已移至 reports |
| `docs/deployment/部署問題排查.md` | 部署排查文件 | 已移至 deployment |
| `docs/reports/修復完成報告.md` | 修復報告 | 已移至 reports |
| `docs/reports/專案分析報告.md` | 舊分析報告 | 已移至 reports |
| `scripts/maintenance/*.mjs` | 歷史批次修改腳本與舊式檢查腳本 | 已移至 maintenance |
| `scripts/create_standalone_html.mjs`, `prepare-vite-entry.mjs`, `sync-core-spec-module.mjs`, `verify-ui.mjs` | 正式 build/check 流程使用 | 保留在 `scripts/` |

## 建議正式資料夾架構

```text
.
├─ .github/workflows/
├─ src/
├─ tests/
├─ scripts/
│  ├─ create_standalone_html.mjs
│  ├─ prepare-vite-entry.mjs
│  ├─ sync-core-spec-module.mjs
│  ├─ verify-ui.mjs
│  └─ maintenance/
├─ doc/
│  ├─ 核心咒語規範.txt
│  └─ 訪談紀錄.txt
├─ docs/
│  ├─ project-organization-report.md
│  ├─ deployment/
│  └─ reports/
├─ 核心資料/
├─ versions/
├─ backups/
├─ archive/
│  ├─ legacy/
│  ├─ experimental/
│  └─ misc/
├─ tmp/              # local only, ignored
├─ output/           # local only, ignored
├─ dist/             # generated, ignored
├─ index.html
├─ package.json
├─ package-lock.json
├─ README.md
└─ 啟動.bat
```

## Node / Python 專案完整性

Node 專案：

- `package.json` 存在，使用 ESM。
- `package-lock.json` 存在，建議追蹤，確保依賴可重現。
- 主要指令：
  - `npm.cmd run dev`
  - `npm.cmd run build`
  - `npm.cmd run lint`
  - `npm.cmd run test`
  - `npm.cmd run verify:ui`
  - `npm.cmd run check`

Python 專案：

- 未發現 `*.py`、`requirements.txt`、`pyproject.toml`、`setup.py`、`Pipfile`、`poetry.lock`。
- 目前不需要 Python dependency 管理。

## GitHub Pages 風險

`.github/workflows/deploy.yml` 目前把整個 repo 根目錄 `.` 上傳到 GitHub Pages。這代表只要檔案被 git 追蹤，就可能一起上架。

建議後續改善：

1. 建立明確 publish folder，例如 `site/` 或 `public/`。
2. 部署 workflow 只上傳正式輸出，例如只包含 `index.html`、必要資產與版本快照。
3. 將報告、維護腳本、備份排除在 Pages 發佈內容之外。

本階段先不改部署流程，避免影響已正常運作的 Pages。

## 已完成搬移清單

第二階段已完成下列搬移，全部保留原始內容，沒有刪除檔案：

| 來源 | 目的地 |
| --- | --- |
| `GitHub部署說明.md` | `docs/deployment/GitHub部署說明.md` |
| `部署問題排查.md` | `docs/deployment/部署問題排查.md` |
| `上架成功報告.md` | `docs/reports/上架成功報告.md` |
| `修復完成報告.md` | `docs/reports/修復完成報告.md` |
| `專案分析報告.md` | `docs/reports/專案分析報告.md` |
| `AITask.md` | `docs/tasks/AITask.md` |
| `test.txt` | `archive/misc/test.txt` |
| `core.js` | `archive/legacy/core.js` |
| 一次性 `scripts/*.mjs` | `scripts/maintenance/` |
| `src/userLibrary.js` | `archive/experimental/userLibrary.js` |

## 待整合項目

| 路徑 | 狀態 |
| --- | --- |
| `archive/experimental/userLibrary.js` | localStorage 自訂角色 / 服裝庫模組，目前沒有被 UI import；正式啟用前需要補 UI 串接與測試 |
| `scripts/maintenance/lint.mjs` | 舊式檢查腳本，引用 legacy `core.js` / `prompt_governance.js`，不屬於目前正式流程 |
| `scripts/maintenance/test.mjs` | 舊式 smoke test，引用 legacy `core.js` / `prompt_governance.js`，不屬於目前正式流程 |
| `scripts/maintenance/*.mjs` | 多數為一次性資料批次工具，部分含舊專案硬編碼路徑，重跑前需先審查 |

## 建議保留 / 忽略清單

建議保留並追蹤：

- `index.html`
- `src/`
- `tests/`
- `scripts/` 中正式建置與驗證腳本
- `doc/核心咒語規範.txt`
- `src/coreSpec.js`
- `versions/`
- `backups/`
- `package.json`
- `package-lock.json`
- `README.md`
- `.github/workflows/deploy.yml`

建議忽略：

- `node_modules/`
- `dist/`
- `*.log`
- `.env`, `.env.local`
- `tmp/`, `temp/`, `output/`
- `.cache/`
- `coverage/`
- `playwright-report/`
- `test-results/`

## 後續改善建議

1. 將 `src/data.js` 拆成分類資料模組，降低單檔維護壓力。
2. 為角色卡資料建立 schema 驗證，避免缺欄、分類錯位與場景殘留。
3. 將 maintenance scripts 加上用途註解或 README，避免重複執行舊批次腳本。
4. 將 GitHub Pages 部署改為只部署正式發佈目錄。
5. 為版本快照建立自動化指令，避免手動複製漏掉。
6. 建立 `docs/architecture.md`，說明母板、短版咒語、角色卡資料、UI 狀態的關係。
