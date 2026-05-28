import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const indexPath = path.join(root, "index.html");

const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="出圖自組咒語生產器 v1.05：不複製母板全文的導演式生成咒語工具" />
    <title>出圖自組咒語生產器 v1.05</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`;

fs.writeFileSync(indexPath, html, "utf8");
console.log(`Prepared Vite entry: ${indexPath}`);
