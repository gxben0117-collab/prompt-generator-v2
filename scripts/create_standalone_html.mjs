import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const distIndexPath = path.join(distDir, "index.html");
const outputPath = path.join(root, "index.html");

function readAsset(assetPath) {
  return fs.readFileSync(path.join(distDir, assetPath.replace(/^\//, "")), "utf8");
}

if (!fs.existsSync(distIndexPath)) {
  throw new Error("dist/index.html 不存在，請先執行 npm.cmd run build");
}

let html = fs.readFileSync(distIndexPath, "utf8");

html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/g, (_match, href) => {
  const css = readAsset(href);
  return `<style>\n${css}\n</style>`;
});

html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, (_match, src) => {
  const js = readAsset(src);
  return `<script type="module">\n${js}\n</script>`;
});

fs.writeFileSync(outputPath, html, "utf8");

console.log(`Created standalone HTML: ${outputPath}`);
console.log(`Size: ${(html.length / 1024).toFixed(2)} KB`);
