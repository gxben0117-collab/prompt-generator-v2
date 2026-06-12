export const PROFILE_LIBRARY_MODE_CORE = "core";
export const PROFILE_LIBRARY_MODE_ALL = "all";

const DEFAULT_LIMIT = { perCategory: 10, total: 180 };
const CORE_LIMITS_BY_PARENT = {
  "寢宮寵妃系列": { perCategory: 8, total: 88 },
  "中國歷代服裝／泛朝代總覽": { perCategory: 6, total: 150 },
  "世界景點旅拍": { perCategory: 8, total: 150 },
  "世界頂級網紅地標旅拍": { perCategory: 8, total: 64 },
  "仙俠神話 / 古裝陸劇": { perCategory: 7, total: 120 },
  "奇幻異世界 / 暗黑王族": { perCategory: 8, total: 96 },
};

function limitsForParent(parentCategory) {
  return CORE_LIMITS_BY_PARENT[parentCategory] || DEFAULT_LIMIT;
}

export function curatedWorldProfileEntries(entries, mode, keyword = "") {
  if (mode === PROFILE_LIBRARY_MODE_ALL || keyword) return entries;

  const parentCounts = new Map();
  const categoryCounts = new Map();
  return entries.filter(({ profile, parentCategory }) => {
    const limits = limitsForParent(parentCategory);
    const parentCount = parentCounts.get(parentCategory) || 0;
    const categoryKey = `${parentCategory}\u0001${profile.category}`;
    const categoryCount = categoryCounts.get(categoryKey) || 0;
    if (parentCount >= limits.total || categoryCount >= limits.perCategory) return false;
    parentCounts.set(parentCategory, parentCount + 1);
    categoryCounts.set(categoryKey, categoryCount + 1);
    return true;
  });
}

