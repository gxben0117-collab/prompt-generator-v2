import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const specPath = path.join(root, "doc", "核心咒語規範.txt");
const modulePath = path.join(root, "src", "coreSpec.js");
const spec = fs.readFileSync(specPath, "utf8");

fs.writeFileSync(
  modulePath,
  `export const CORE_SPEC_TEXT = ${JSON.stringify(spec)};\n`,
  "utf8",
);

console.log(`Synced ${spec.length} chars into src/coreSpec.js`);
