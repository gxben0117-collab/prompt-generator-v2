# 2026-06-13 專案整理與架構盤點

## 目的

把 `出圖自組咒語生產器` 整理成正式、可維護、可擴充的開發架構，並把正式程式碼、文件、輸出、暫存與歷史資料分層清楚。

## 專案現況摘要

這是一個單頁式 Vite / Node 專案，正式入口是根目錄 `index.html`，主要程式碼在 `src/`，測試在 `tests/`，建置與驗證腳本在 `scripts/`。

目前專案已能正常通過 lint、test、build 與 UI 驗證，且沒有 Python 專案依賴。

## 資料夾用途盤點

| 路徑 | 現況用途 | 正式定位 |
| --- | --- | --- |
| `src/` | 正式前端、prompt engine、角色資料 | 核心程式碼 |
| `tests/` | Vitest 測試 | 核心測試 |
| `scripts/` | build / sync / verify | 正式工具腳本 |
| `scripts/maintenance/` | 大量一次性資料修補腳本 | 保留區，不是日常入口 |
| `doc/` | 核心母板來源與訪談紀錄 | 來源文件 |
| `docs/` | 報告、部署說明、交接文件 | 正式文件 |
| `核心資料/` | 大型規範、風格範例、服飾結構資料 | 內部資料庫 |
| `versions/` | 單檔歷史快照 | 發版封存 |
| `backups/` | 手動備份 | 備份 |
| `archive/` | legacy / experimental / misc | 歷史保留 |
| `dist/` | build 輸出 | 生成產物 |
| `tmp/`、`temp/`、`output/` | 本機暫存或中繼輸出 | 本機工作區 |
| `memory/`、`MEMORY.md`、`game-plan.html` | 工作備忘與草稿頁 | scratch 區，應忽略 |

## 混亂與重複點

1. 根目錄曾同時出現正式入口、報告、草稿與生成結果，會讓專案邊界不清楚。
2. `doc/` 與 `docs/` 容易混淆，前者應固定為母板來源，後者應固定為人看得懂的文件與報告。
3. `scripts/` 內同時存在正式流程與大量一次性資料修補腳本，需要再明確分層，避免誤用。
4. `memory/`、`MEMORY.md`、`game-plan.html` 是明顯的工作草稿，應從正式文件視角排除。
5. `dist/` 是生成物，不應被當成源碼資料夾。

## 建議正式架構

```text
.
├─ src/
├─ tests/
├─ scripts/
│  ├─ create_standalone_html.mjs
│  ├─ prepare-vite-entry.mjs
│  ├─ sync-core-spec-module.mjs
│  ├─ verify-ui.mjs
│  └─ maintenance/
├─ doc/
├─ docs/
│  ├─ deployment/
│  ├─ reports/
│  └─ tasks/
├─ 核心資料/
├─ versions/
├─ backups/
├─ archive/
├─ dist/
├─ tmp/
├─ temp/
├─ output/
├─ assets/  # 未來若加入靜態圖、icon、bitmap，建議放這裡
├─ index.html
├─ README.md
├─ package.json
└─ package-lock.json
```

## 建議搬移清單

以下是概念上的建議，不代表現在要強制改動所有檔案：

- `game-plan.html` -> 建議只保留為草稿或後續移入 `docs/` / `memory/`
- `MEMORY.md` -> 建議納入 `memory/` 或 `docs/tasks/`
- `memory/` -> 建議保留為本機 scratch，並忽略
- 一次性維護腳本 -> 建議持續留在 `scripts/maintenance/`
- 大型範例資料與規範 -> 建議留在 `核心資料/`
- 正式部署與交接說明 -> 建議留在 `docs/deployment/`、`docs/reports/`、`docs/tasks/`

## 建議保留 / 忽略清單

### 建議保留

- `src/`
- `tests/`
- `scripts/`
- `doc/`
- `docs/`
- `核心資料/`
- `versions/`
- `backups/`
- `archive/`
- `index.html`
- `README.md`
- `package.json`
- `package-lock.json`
- `eslint.config.js`
- `vite.config.js`

### 建議忽略

- `dist/`
- `node_modules/`
- `tmp/`
- `temp/`
- `output/`
- `memory/`
- `MEMORY.md`
- `game-plan.html`
- `*.log`
- `coverage/`
- `playwright-report/`
- `test-results/`

## Node / Python 完整性

- Node：完整，ESM、Vite、ESLint、Vitest 都可正常執行。
- Python：未找到 Python 專案檔，沒有獨立 Python 依賴管理需求。

## 驗證結果

已完成 `npm.cmd run check`，結果包含：

- `sync:spec` 通過
- `lint` 通過
- `test` 通過
- `build` 通過
- `verify:ui` 通過，desktop / mobile 都無 console error、無水平溢出

## 後續改善建議

1. 把 `scripts/maintenance/` 再細分成 `data-fix/`、`migration/`、`one-off/` 類型。
2. 若未來加入圖片或 icon，正式建立 `assets/`，不要把資源散落在根目錄。
3. 針對大型 `src/data.js` 與角色資料檔，後續可再拆成更細的 domain modules。
4. 若 `memory/` 真的只是工作筆記，建議逐步遷到 `docs/tasks/` 或統一的工作紀錄區。
5. bundle 仍偏大，後續可以考慮 code splitting 與手動 chunk 分包。
