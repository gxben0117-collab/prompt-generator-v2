const USER_ROLES_KEY = "hongbing-user-role-library";
const USER_COSTUMES_KEY = "hongbing-user-costume-library";
const MAX_ITEMS = 80;

function safeParseList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key)) || [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeSaveList(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // Local files can run with storage disabled; the UI still works for built-ins.
  }
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function splitTags(value) {
  return String(value || "")
    .split(/[,，、\s]+/)
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 12);
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function loadUserRoles() {
  return safeParseList(USER_ROLES_KEY)
    .map((item) => ({
      id: cleanText(item.id) || makeId("role"),
      label: cleanText(item.label),
      category: cleanText(item.category) || "自訂",
      isUser: true,
    }))
    .filter((item) => item.label);
}

export function saveUserRole(input) {
  const label = cleanText(input.label);
  if (!label) return loadUserRoles();

  const nextItem = {
    id: makeId("role"),
    label,
    category: cleanText(input.category) || "自訂",
    isUser: true,
  };
  const next = [nextItem, ...loadUserRoles().filter((item) => item.label !== label)];
  safeSaveList(USER_ROLES_KEY, next);
  return next;
}

export function deleteUserRole(id) {
  const next = loadUserRoles().filter((item) => item.id !== id);
  safeSaveList(USER_ROLES_KEY, next);
  return next;
}

export function loadUserCostumes() {
  return safeParseList(USER_COSTUMES_KEY)
    .map((item) => ({
      id: cleanText(item.id) || makeId("costume"),
      label: cleanText(item.label),
      tags: Array.isArray(item.tags) ? item.tags.map((tag) => cleanText(tag)).filter(Boolean) : splitTags(item.tags),
      isUser: true,
    }))
    .filter((item) => item.label);
}

export function saveUserCostume(input) {
  const label = cleanText(input.label);
  if (!label) return loadUserCostumes();

  const nextItem = {
    id: makeId("costume"),
    label,
    tags: splitTags(input.tags),
    isUser: true,
  };
  const next = [nextItem, ...loadUserCostumes().filter((item) => item.label !== label)];
  safeSaveList(USER_COSTUMES_KEY, next);
  return next;
}

export function deleteUserCostume(id) {
  const next = loadUserCostumes().filter((item) => item.id !== id);
  safeSaveList(USER_COSTUMES_KEY, next);
  return next;
}
