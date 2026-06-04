# 2026-06-05 全專案檢查報告

日期：2026-06-05

最新 commit：`7f74c26 Rebuild standalone HTML after profile refactor`

線上站台：<https://gxben0117-collab.github.io/prompt-generator-v2/>

## 結論

全專案檢查通過，GitHub Pages 已在前一輪重整後部署成功。本次文件更新依最新檢查結果同步 `AI-TASK.md`、`docs/PROJECT.md`、development log 與 reports。

## 系統健康

| 項目 | 結果 |
| --- | --- |
| git status | 乾淨（檢查前） |
| npm run check | 通過 |
| lint | 0 errors |
| tests | 57/57 passed |
| build | 成功 |
| verify:ui desktop | 通過 |
| verify:ui mobile | 通過 |
| console errors | 0 |
| horizontal overflow | false |

## 資料規模

| 項目 | 數量 |
| --- | ---: |
| WORLD_LAYER_PROFILES | 1833 |
| ROLE_CATEGORIES | 81 |
| PARENT_ROLE_CATEGORIES | 37 |
| duplicate profile ids | 0 |
| orphan parentCategory | 0 |
| data.js 行數 | 7386 |
| tests/promptEngine.test.js 行數 | 2782 |
| standalone index.html | 612.04KB |
| dist JS | 1210.57KB |
| dist JS gzip | 392.16KB |

## 父分類分布

| 父分類 | 數量 |
| --- | ---: |
| 世界景點旅拍 | 345 |
| 中國歷代服裝／泛朝代總覽 | 191 |
| 仙俠神話 / 古裝陸劇 | 126 |
| 歷史小說名著人物 | 123 |
| 魅魔 | 115 |
| 唐朝服飾／泛唐風古裝 | 97 |
| 現代都市夜景 | 74 |
| 西方古典 / 歐陸史詩 | 66 |
| 花園童話 / 自然精靈 | 61 |
| 奇幻異世界 / 暗黑王族 | 61 |
| 武俠江湖 / 戰場女將 | 56 |
| 暗黑墮天使 | 47 |
| 世界頂級網紅地標旅拍 | 47 |
| 盛唐風月／教坊平康／胡姬樂舞 | 45 |
| 東方異域 / 絲路西域 | 45 |
| 盛唐宮廷考據／大明宮貴妃／史實考據 | 40 |
| 水下龍宮海國 | 31 |
| 九尾妖狐 | 29 |
| 長相思旅拍 | 20 |
| 江南旅拍 | 19 |
| 敦煌飛天 | 19 |
| 現代都市 / 街拍電影 | 16 |
| 賽博機甲 / 科幻戰姬 | 13 |
| 民族古城旅拍 | 13 |
| 高訂婚紗禮服 | 12 |
| 東方和風旅拍 | 11 |
| 田園花園旅拍 | 11 |
| 海岸度假旅拍 | 10 |
| 室內生活寫真 | 10 |
| 東方旗袍夜宴 | 10 |
| 動漫次文化街拍 | 10 |
| 漢宮禮樂／長信宮燈／漢代仕女考據 | 10 |
| 魏晉風骨／洛水女神／清談名姝 | 10 |
| 宋韻雅集／汴梁茶香／文人仕女 | 10 |
| 明宮織金／牡丹王姬／禮制服制 | 10 |
| 清宮旗裝／雪苑貴妃／晚清宮廷寫實 | 10 |
| 埃及豔后／尼羅河女兒／埃及神話女神 | 10 |

## 角色卡檔案結構

角色卡資料目前集中於 `src/profiles/`：

| 檔案 | 大小 |
| --- | ---: |
| bulkExpansionProfiles.js | 76994 |
| culturalFantasyProfiles.js | 37385 |
| darkRoyalProfiles.js | 16247 |
| egyptianProfiles.js | 9049 |
| historicalAndStyleExpansionProfiles.js | 53325 |
| landmarkDiverseProfiles.js | 54957 |
| landmarkProfiles.js | 44361 |
| modernLifestyleProfiles.js | 25358 |
| styleReferenceProfiles.js | 35304 |
| index.js | 712 |

`src/data.js` 只透過 `src/profiles/index.js` 聚合匯入，不再直接維護大量 wave 角色卡資料。

## 已知風險

唯一仍存在的提醒是 Vite large chunk warning：

```text
Some chunks are larger than 800 kB after minification.
```

目前原因是 1833 張角色卡資料仍打包在單頁工具內。這不影響功能與 Pages 部署，但未來若資料量再增加，可評估 dynamic import 或 manualChunks。
