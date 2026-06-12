# 出圖自組咒語生產器 v1.30

這是一個 Vite + Node 的單頁式咒語產生工具，主用途是把角色卡、服裝 Layer、妝容、場景、鏡頭、比例與母板治理規則整理成可直接貼到 ChatGPT 或其他生圖模型的短版輸出。

正式輸出是根目錄 `index.html`。日常開發則以 `src/`、`tests/`、`scripts/`、`doc/`、`docs/` 為核心。

## 快速開始

```powershell
npm.cmd install
npm.cmd run dev
```

## 常用指令

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd run verify:ui
npm.cmd run check
```

## 專案結構

| 路徑 | 用途 | 建議定位 |
| --- | --- | --- |
| `src/` | 正式前端原始碼、prompt engine、角色資料 | 核心開發區 |
| `tests/` | Vitest 測試 | 核心測試區 |
| `scripts/` | build、同步、驗證與資料維護腳本 | 正式腳本 + maintenance 子區 |
| `doc/` | 核心母板來源與訪談紀錄 | 來源文件區 |
| `docs/` | 專案文件、報告、部署說明 | 正式文件區 |
| `核心資料/` | 大型規範、風格範例、服飾結構資料 | 內部資料庫 |
| `versions/` | 舊版 `index.html` 快照 | 版本封存區 |
| `backups/` | 手動備份 | 備份區 |
| `archive/` | legacy / experimental / misc 保留區 | 歷史保留區 |
| `dist/` | Vite build 輸出 | 生成輸出區 |
| `tmp/`、`temp/`、`output/` | 本機暫存與中繼輸出 | 本機工作區 |
| `memory/`、`MEMORY.md`、`game-plan.html` | 工作備忘與草稿頁 | 本機 scratch，不當正式入口 |
| `assets/` | 預留給未來靜態圖片 / bitmap / icon 資源 | 未啟用預留區 |

## 目前正式資料流

```text
doc/核心咒語規範.txt
  -> npm.cmd run sync:spec
  -> src/coreSpec.js
  -> npm.cmd run build
  -> index.html
```

`index.html` 是可直接開啟的正式成品，不是主要開發入口。若要修改功能，請優先改 `src/`、`doc/`、`tests/`，再用 `npm.cmd run check` 驗證。

## Node / Python 完整性

- Node 專案完整，`package.json` 與 `package-lock.json` 都在。
- 目前沒有 Python 專案檔，未發現 `requirements.txt`、`pyproject.toml`、`setup.py`、`Pipfile`、`poetry.lock`。
- 依賴管理以 npm 為準。

## 整理原則

- `dist/`、`tmp/`、`temp/`、`output/` 視為輸出或暫存，不應作為正式程式來源。
- `memory/`、`MEMORY.md`、`game-plan.html` 視為工作草稿與臨時紀錄，不納入正式產品入口。若要跨 session 接手，先讀 `memory/MEMORY.md` 再往下看相關卡片。
- `archive/`、`backups/`、`versions/` 保留歷史，不作為主開發入口。
- `scripts/maintenance/` 是一次性批次腳本集合，重跑前先看內容。
- `coreSpec` 不直接手改，請改 `doc/核心咒語規範.txt` 後同步。

## 文件入口

- [專案整理報告](docs/reports/2026-06-13-project-organization-audit.md)
- [正式專案總覽](docs/PROJECT.md)
- [部署說明](docs/deployment/GitHub部署說明.md)

## 當前狀態

最近一次完整檢查已通過：lint、test、build、桌機 UI、mobile UI、console 檢查。

