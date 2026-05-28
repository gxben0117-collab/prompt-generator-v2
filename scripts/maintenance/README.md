# Maintenance Scripts

這個資料夾保存歷史批次修改腳本與舊式檢查腳本。

這些腳本不是目前正式開發流程的一部分。正式流程請使用根目錄 `package.json`：

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run verify:ui
```

## 注意

- 多數腳本是一次性資料遷移或舊版 HTML 批量修改工具。
- 部分腳本內含歷史硬編碼路徑，例如舊專案 `C:\AIProjects\001專案完成區\美片咒語產生器`。
- 不要直接重跑這些腳本，除非已讀過內容、確認目標路徑，並先備份資料。
- `lint.mjs` 與 `test.mjs` 是舊式檢查腳本，仍引用 legacy `core.js` / `prompt_governance.js`，目前正式檢查已改用 ESLint、Vitest 與 Playwright UI verify。

## 正式腳本仍保留在上一層

```text
scripts/create_standalone_html.mjs
scripts/prepare-vite-entry.mjs
scripts/sync-core-spec-module.mjs
scripts/verify-ui.mjs
```
