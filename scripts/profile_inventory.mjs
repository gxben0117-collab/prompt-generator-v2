import fs from "node:fs";
import { WORLD_LAYER_PROFILES } from "../src/data.js";
import { parentCategoryForProfile } from "../src/categoryClassifier.js";

function inventory() {
  const profiles = WORLD_LAYER_PROFILES.map((profile, index) => ({
    index,
    id: profile.id,
    title: profile.title,
    category: profile.category,
    parentCategory: profile.parentCategory || "",
    resolvedParentCategory: parentCategoryForProfile(profile) || "",
    layerCount: Object.keys(profile.layers || {}).length,
  }));
  const duplicateIds = [...profiles.reduce((acc, profile) => {
    acc.set(profile.id, (acc.get(profile.id) || 0) + 1);
    return acc;
  }, new Map())]
    .filter(([, count]) => count > 1)
    .map(([id]) => id);

  return {
    count: profiles.length,
    duplicateIds,
    profiles,
  };
}

function printUsage() {
  console.log("Usage:");
  console.log("  node scripts/profile_inventory.mjs --write <file>");
  console.log("  node scripts/profile_inventory.mjs --compare <file>");
  console.log("  node scripts/profile_inventory.mjs");
}

function compareInventories(current, previous) {
  const errors = [];
  if (current.count !== previous.count) {
    errors.push(`count changed: ${previous.count} -> ${current.count}`);
  }
  if (current.duplicateIds.length > 0) {
    errors.push(`duplicate ids: ${current.duplicateIds.join(", ")}`);
  }

  const maxLength = Math.max(current.profiles.length, previous.profiles.length);
  for (let index = 0; index < maxLength; index += 1) {
    const before = previous.profiles[index];
    const after = current.profiles[index];
    if (!before || !after) {
      errors.push(`profile missing at index ${index}`);
      continue;
    }
    for (const key of ["id", "title", "category", "parentCategory", "resolvedParentCategory", "layerCount"]) {
      if (before[key] !== after[key]) {
        errors.push(`${key} changed at index ${index}: ${before.id} (${before[key]}) -> ${after.id} (${after[key]})`);
      }
    }
  }

  return errors;
}

const [, , command, file] = process.argv;
const current = inventory();

if (!command) {
  console.log(JSON.stringify({
    count: current.count,
    duplicateIds: current.duplicateIds,
  }, null, 2));
} else if (command === "--write" && file) {
  fs.writeFileSync(file, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  console.log(`Wrote profile inventory: ${file}`);
  console.log(`Profiles: ${current.count}`);
} else if (command === "--compare" && file) {
  const previous = JSON.parse(fs.readFileSync(file, "utf8"));
  const errors = compareInventories(current, previous);
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log(`Profile inventory unchanged: ${current.count} profiles`);
} else {
  printUsage();
  process.exit(1);
}
