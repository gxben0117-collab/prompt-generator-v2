# 2026-06-05 角色卡模組化與全專案檢查紀錄

## 目標

依使用者要求完成全專案檢查，並更新各文件。重點是確認 2026-06-04 的角色大分類擴充、父分類修正與 profile 檔案結構重整已穩定落地。

## 已完成事項

- 備份專案資料夾：
  - `C:\AIProjects\002專案進行中\出圖自組咒語生產器_backup_20260604-231353`
- 同步核心規範來源：
  - 權威來源：`doc/核心咒語規範.txt`
  - 生成檔：`src/coreSpec.js`
- 新增角色卡 inventory 防線：
  - `scripts/profile_inventory.mjs`
  - npm script：`npm run inventory:profiles`
- 重整角色卡資料結構：
  - 舊時間序 wave 檔已移除。
  - 角色卡資料集中至 `src/profiles/`。
  - `src/data.js` 透過 `src/profiles/index.js` 聚合匯入。
- 新增 profile schema 測試：
  - 驗證 id 不重複。
  - 驗證基本欄位存在。
  - 驗證每張卡維持 10 層服裝 Layer。
  - 驗證父分類可解析並存在於 UI 大分類。

## 目前資料狀態

| 項目 | 數量 |
| --- | ---: |
| WORLD_LAYER_PROFILES | 1833 |
| ROLE_CATEGORIES | 81 |
| PARENT_ROLE_CATEGORIES | 37 |
| duplicate profile ids | 0 |
| orphan parentCategory | 0 |
| data.js 行數 | 7386 |
| tests | 57 |

## 驗證結果

執行：

```powershell
npm run check
npm run inventory:profiles
```

結果：

- lint：0 errors
- Vitest：57/57 passed
- build：成功
- verify:ui：desktop / mobile 通過
- consoleErrors：0
- horizontalOverflow：false
- profile inventory：1833 profiles，duplicateIds 0

已知提醒：

- Vite 仍提示 JS chunk 超過 800KB。
- 目前屬 P2 bundle splitting 議題，不影響 GitHub Pages 部署或單頁工具使用。

## 上架狀態

最新部署成功：

```text
https://gxben0117-collab.github.io/prompt-generator-v2/
```

最新部署基準：

- commit：`7f74c26 Rebuild standalone HTML after profile refactor`
- Pages workflow：成功

## 後續建議

- 新增角色卡一律放入 `src/profiles/` 對應主題檔，不再新增 wave 檔。
- 每次搬移或新增大量角色卡前後，先用 `scripts/profile_inventory.mjs` 比對總數與 id。
- 若資料量繼續增加，再評估 Vite dynamic import / manualChunks。
