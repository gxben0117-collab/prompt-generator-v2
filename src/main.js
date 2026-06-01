import "./styles.css";
import {
  CAMERA_FRAMINGS,
  COLOR_INTENSITIES,
  COSTUME_LAYERS,
  FABRIC_MOTIONS,
  FIELD_SUGGESTIONS,
  LAYER_SUGGESTIONS,
  RATIOS,
  ROLE_CATEGORIES,
  ROLE_SUGGESTION_ITEMS,
  VISUAL_MODES,
  WORLD_LAYER_PROFILES,
} from "./data.js";
import {
  buildChatGptInstruction,
  DEFAULT_FORM,
  expandSceneToDirectorFields,
  normalizeForm,
} from "./promptEngine.js";
import {
  ALL_FILTER_LABEL,
  PARENT_ROLE_CATEGORIES,
  normalizeSearchText,
  parentCategoryForProfile,
} from "./categoryClassifier.js";

const STORAGE_KEY = "hongbing-travel-prompt-state";
const HISTORY_KEY = "hongbing-travel-prompt-history";
const UI_PREFS_KEY = "hongbing-travel-prompt-ui-prefs";
const HISTORY_LIMIT = 5;
const APP_VERSION = "v1.27";
const PROFILE_PAGE_SIZE = 60;
const PRODUCT_PRINCIPLE = "最高原則：真人鎖臉優先於所有華麗主視覺，不讓角色滑回 AI 仙女臉。";
const RATIO_LABELS = {
  "4:5": "4:5 商業海報",
  "1:1": "1:1 方形貼文",
  "3:4": "3:4 直式肖像",
  "2:3": "2:3 電影直幅",
  "14.8:21": "14.8:21 直A5",
  "21:29": "21:29 直A4",
  "25:35": "25:35 直歐8K",
  "9:16": "9:16 手機桌布",
  "16:9": "16:9 橫式電影",
  "3:2": "3:2 攝影橫幅",
  "4:3": "4:3 經典畫幅",
  "2.39:1": "2.39:1 寬銀幕",
};
const CUP_SIZE_OPTIONS = ["預設", "D", "F", "K"];

function cupSizeSelectValue(value) {
  return !value || value === "正常比例" ? "預設" : value;
}

function cupSizeSelectOptions(activeValue) {
  return CUP_SIZE_OPTIONS.map(
    (value) => `<option value="${escapeHtml(value)}" ${activeValue === value ? "selected" : ""}>${escapeHtml(value)}</option>`,
  ).join("");
}

function templateDirectionForProfile(profile) {
  const text = `${profile.title} ${profile.category} ${profile.scene} ${profile.sceneEnvironment} ${profile.sceneAction}`;
  const isChineseDynastyOrnate =
    /中國朝代古裝|中國歷代服裝|唐|漢代|漢朝|宋代|宋朝|明代|明朝|清宮|清朝|長安|盛唐|宮廷|花宴|花朝|貴妃|公主|皇后|樂姬|舞姬|宮妃|帝姬|郡主|王姬|故宮|王朝|鳳儀/.test(
      text,
    );
  if (/魅魔|魅姬|暗黑夜宴|絲絨|王座|紫晶|占星|哥德/.test(text)) {
    return {
      environment: "前景優先酒杯、燭台、垂鏈、帷幕或蝶翼貼鏡，中景讓角色和王座、扶手、座椅互動，遠景保留高窗、圓盤、鏡面與燈影深度。",
      action: "姿態優先王座前緣端坐、倚扶手、扶椅背、單腿前伸、由座起身或踏階逼近，不採正中站姿。",
    };
  }
  if (/飛天|敦煌|伎樂|舞姬|洞窟/.test(text)) {
    return {
      environment: "前景優先飄帶、香煙、洞壁殘框穿鏡，中景保留石階與舞台空間，遠景保留壁畫、佛龕與天窗光。",
      action: "姿態優先舞步停格、手臂弧線、腰胯轉折、半轉身與披帛大動態，不採平直站姿。",
    };
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳|皇后|宮妃|帝姬/.test(text)) {
    return {
      environment: "前景優先花枝、屏風、燈器、欄杆或披帛壓鏡，中景讓角色貼近台階、桌案、宮欄或器物，遠景保留廊柱、帷幕與深層殿階。",
      action: "姿態優先踏階、扶欄、托器物、提袖、持團扇或轉肩停步，避免站在中軸立正。",
    };
  }
  if (isChineseDynastyOrnate) {
    return {
      environment: "前景優先花枝、花瓣、宮燈、珠簾、窗紗、團扇、欄杆或披帛壓鏡，中景讓角色貼近台階、案几、臥榻、花器、樂器或水榭欄杆，遠景保留殿閣燈火、寶石色帷幕、深層廊柱、飛檐與倒影，整體畫面維持高密度但不空亂。",
      action: "姿態優先扶欄、拂袖、撩紗、托盞、持花、抱琵琶、倚坐、臨案停步、由榻起身或回眸停拍，避免站在中央僵直立正。",
    };
  }
  if (/武俠|女俠|戰場|江湖|劍|刀|槍|弓|邊關/.test(text)) {
    return {
      environment: "前景優先竹葉、風沙、橋欄、軍旗或茶案遮擋，中景讓角色靠近兵器、坐騎、石階或欄杆，遠景保留山門、城關與地形壓力。",
      action: "姿態優先按兵器借勢、低重心停步、回身收勢、扶鞍回望或臨案坐姿，不採制式站姿。",
    };
  }
  if (/仙俠|神話|聖女|神姬|龍宮|雲海|月宮|巫祝|祭司|法器/.test(text)) {
    return {
      environment: "前景優先法器、雲霧、水紗、光粒或神殿構件貼鏡，中景保留雲階、水殿、祭台或橋面，遠景建立天光、神像與世界縱深。",
      action: "姿態優先托法器引光、拂袖轉身、踏階緩行、臨水停步或端坐祭儀，不採平面站姿。",
    };
  }
  if (/西域|絲路|大漠|旅人|異域/.test(text)) {
    return {
      environment: "前景優先紗幕、駝具、石柱、地毯或器皿壓鏡，中景讓角色貼近欄杆、坐具、階台或樂器，遠景保留沙丘、拱門與火光。",
      action: "姿態優先提裙踏沙、扶駝具回望、抱樂器停拍、倚柱轉肩或低位端坐。",
    };
  }
  if (/旅拍|地標|古城|湖畔|山城|外灘|九份|西湖|威尼斯/.test(text)) {
    return {
      environment: "前景優先欄杆、窗框、枝葉、傘面或桌角貼鏡，中景讓角色坐靠場景邊緣或沿路徑移動，遠景保留地標、天光與城市深度。",
      action: "姿態優先扶欄回望、邊走邊整理衣襬、坐靠窗台、持物抓拍或轉身停步，避免旅遊宣傳式站正中。",
    };
  }
  if (/都市|街拍|夜景|商務|咖啡|首爾|台北|上海|香港/.test(text)) {
    return {
      environment: "前景優先玻璃反光、欄杆、桌面、車流或櫥窗遮擋，中景讓角色靠近座椅、窗邊、街角或門框，遠景保留燈海、招牌與透視線。",
      action: "姿態優先走動抓拍、倚窗、扶包、整理外套、坐靠桌邊或街角回身，不採櫥窗模特站姿。",
    };
  }
  if (/花園|精靈|花靈|白玫|藤蔓|森林/.test(text)) {
    return {
      environment: "前景優先花拱、藤蔓、枝葉與露珠貼鏡，中景讓角色貼近花徑、座椅或石欄，遠景保留花棚、林光與層層植物空間。",
      action: "姿態優先拈花聞香、扶藤回眸、坐靠石欄、提裙穿花或伸手觸葉，不採呆站。",
    };
  }
  return {
    environment: "前景加入可壓鏡的花材、燈火、布料、道具或建築構件，中景讓角色和欄杆、座椅、台階、器物或場景主體互動，遠景保留建築、天光、燈影或世界觀縱深，整體維持高密度亮場海報感。",
    action: "姿態優先回身停步、扶物互動、坐靠場景邊緣、由座起身、倚靠或緩步抓拍，避免站正中發呆。",
  };
}

function mergeTemplateDirection(baseText, addition) {
  if (!addition) return baseText || "";
  if (!baseText) return addition;
  if (baseText.includes(addition)) return baseText;
  return `${baseText}；模板加強：${addition}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadState() {
  try {
    return normalizeForm(JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_FORM);
  } catch {
    return normalizeForm(DEFAULT_FORM);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeForm(state)));
  } catch {
    // file:// privacy settings may block storage; the app still works in-memory.
  }
}

function loadUiPrefs() {
  try {
    return {
      roleParentCategory: ALL_FILTER_LABEL,
      roleCategory: ALL_FILTER_LABEL,
      profileSearch: "",
      profileVisibleCount: PROFILE_PAGE_SIZE,
      ...(JSON.parse(localStorage.getItem(UI_PREFS_KEY)) || {}),
    };
  } catch {
    return {
      roleParentCategory: ALL_FILTER_LABEL,
      roleCategory: ALL_FILTER_LABEL,
      profileSearch: "",
      profileVisibleCount: PROFILE_PAGE_SIZE,
    };
  }
}

function saveUiPrefs(prefs) {
  try {
    localStorage.setItem(UI_PREFS_KEY, JSON.stringify({ ...loadUiPrefs(), ...prefs }));
  } catch {
    // Optional UI state only.
  }
}

function loadHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    return Array.isArray(history) ? history.slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
  } catch {
    // Ignore blocked storage; history is optional.
  }
}

function rememberPrompt(state, prompt) {
  const title = state.theme || "未命名咒語";
  const item = {
    id: Date.now().toString(36),
    title,
    ratio: state.ratio,
    length: prompt.length,
    prompt,
    createdAt: new Date().toLocaleString("zh-Hant"),
  };
  const history = loadHistory().filter((entry) => entry.prompt !== prompt);
  saveHistory([item, ...history].slice(0, HISTORY_LIMIT));
}

function formToState(form) {
  return normalizeForm(Object.fromEntries(new FormData(form).entries()));
}

function costumeLayerFields(state) {
  return COSTUME_LAYERS.map((layer) => {
    const suggestions = (LAYER_SUGGESTIONS[layer.id] || [])
      .map(
        (suggestion) =>
          `<button type="button" class="suggestion-chip tiny-chip" data-fill-field="${escapeHtml(layer.id)}" data-fill-value="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`,
      )
      .join("");

    return `
      <label>
        <span>${escapeHtml(layer.label)}</span>
        <input name="${escapeHtml(layer.id)}" value="${escapeHtml(state[layer.id])}" placeholder="${escapeHtml(layer.placeholder)}" />
        <div class="suggestion-row layer-suggestions">${suggestions}</div>
      </label>`;
  }).join("");
}

function fieldSuggestionButtons(fieldName) {
  return (FIELD_SUGGESTIONS[fieldName] || [])
    .map(
      (suggestion) =>
        `<button type="button" class="suggestion-chip tiny-chip" data-fill-field="${escapeHtml(fieldName)}" data-fill-value="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`,
    )
    .join("");
}

function choiceCards(name, options, activeValue, labels = {}) {
  return options
    .map(
      (value) => `
        <label class="radio-card block-card">
          <input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${activeValue === value ? "checked" : ""} />
          <span>${escapeHtml(labels[value] || value)}</span>
        </label>`,
    )
    .join("");
}

function allRoleItems() {
  return ROLE_SUGGESTION_ITEMS;
}

function allRoleCategories() {
  return [
    ...new Set([
      ...ROLE_CATEGORIES,
      ...allRoleItems().map((item) => item.category),
      ...WORLD_LAYER_PROFILES.map((profile) => profile.category),
    ]),
  ].filter((category) => category && category !== ALL_FILTER_LABEL);
}

function parentCategoryButtons(activeParentCategory) {
  return [ALL_FILTER_LABEL, ...PARENT_ROLE_CATEGORIES.map((category) => category.label)]
    .map(
      (category) =>
        `<button type="button" class="filter-chip parent-chip ${activeParentCategory === category ? "active" : ""}" data-role-parent="${escapeHtml(category)}">${escapeHtml(category)}</button>`,
    )
    .join("");
}

function worldProfileSearchText(profile) {
  return `${profile.title} ${profile.themeHint} ${profile.category} ${profile.id} ${(profile.aliases || []).join(" ")} ${Object.values(profile.layers || {}).join(" ")} ${profile.makeup || ""} ${profile.scene || ""} ${profile.sceneEnvironment || ""} ${profile.sceneAction || ""} ${profile.sceneLighting || ""}`;
}

const WORLD_PROFILE_INDEX = WORLD_LAYER_PROFILES.map((profile) => ({
  profile,
  parentCategory: parentCategoryForProfile(profile),
  searchText: normalizeSearchText(worldProfileSearchText(profile)),
}));

let profileFilterCache = {
  key: "",
  profiles: [],
};

function profileMatchesFineCategory(profile, activeCategory) {
  return activeCategory === ALL_FILTER_LABEL || profile.category === activeCategory;
}

function categoryOptions() {
  return allRoleCategories().map((category) => `<option value="${escapeHtml(category)}"></option>`).join("");
}

function filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm) {
  const keyword = normalizeSearchText(searchTerm).trim();
  const cacheKey = `${activeParentCategory}\u0001${activeCategory}\u0001${keyword}`;
  if (profileFilterCache.key === cacheKey) {
    return profileFilterCache.profiles;
  }

  const profiles = WORLD_PROFILE_INDEX.filter(({ profile, parentCategory, searchText }) => {
    const parentMatched = activeParentCategory === ALL_FILTER_LABEL || parentCategory === activeParentCategory;
    if (!parentMatched || !profileMatchesFineCategory(profile, activeCategory)) return false;
    return !keyword || searchText.includes(keyword);
  }).map(({ profile }) => profile);

  profileFilterCache = { key: cacheKey, profiles };
  return profiles;
}

function visibleProfileState(profiles, selectedProfileId = "", preferredVisibleCount = PROFILE_PAGE_SIZE) {
  const normalizedVisibleCount = Math.max(PROFILE_PAGE_SIZE, Number(preferredVisibleCount) || PROFILE_PAGE_SIZE);
  const selectedIndex = profiles.findIndex((profile) => profile.id === selectedProfileId);
  const requiredVisibleCount =
    selectedIndex >= normalizedVisibleCount
      ? Math.ceil((selectedIndex + 1) / PROFILE_PAGE_SIZE) * PROFILE_PAGE_SIZE
      : normalizedVisibleCount;
  const visibleProfiles = profiles.slice(0, requiredVisibleCount);
  return {
    totalCount: profiles.length,
    visibleCount: visibleProfiles.length,
    hasMore: profiles.length > visibleProfiles.length,
    visibleProfiles,
  };
}

function worldLayerProfileButtons(activeParentCategory, activeCategory, searchTerm, selectedProfileId = "", preferredVisibleCount = PROFILE_PAGE_SIZE) {
  const profiles = filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm);
  if (profiles.length === 0) {
    return `<p class="empty-inline profile-empty">找不到符合條件的世界觀模板</p>`;
  }

  const { visibleProfiles } = visibleProfileState(profiles, selectedProfileId, preferredVisibleCount);
  return visibleProfiles.map(
    (profile) =>
      `<button type="button" class="profile-chip ${selectedProfileId === profile.id ? "active" : ""}" data-world-profile="${escapeHtml(profile.id)}" aria-label="${escapeHtml(`${profile.title} ${profile.themeHint}`)}">
        <span class="profile-chip-title">${escapeHtml(profile.title)}</span>
        <small class="profile-chip-meta">${escapeHtml(parentCategoryForProfile(profile) || profile.category || "未分類")}</small>
      </button>`,
  ).join("");
}

function profileLibraryFooter(activeParentCategory, activeCategory, searchTerm, selectedProfileId = "", preferredVisibleCount = PROFILE_PAGE_SIZE) {
  const profiles = filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm);
  if (profiles.length === 0) return "";
  const { visibleCount, totalCount, hasMore } = visibleProfileState(profiles, selectedProfileId, preferredVisibleCount);
  return `
    <div class="template-grid-foot">
      <small class="template-grid-status">目前顯示 ${visibleCount.toLocaleString("zh-Hant")} / ${totalCount.toLocaleString("zh-Hant")} 組模板</small>
      ${hasMore ? '<button type="button" class="secondary small-btn" data-load-more-profiles>載入更多</button>' : '<small class="template-grid-status">已顯示全部模板</small>'}
    </div>`;
}

function selectedProfileCard(state) {
  const profile = WORLD_LAYER_PROFILES.find((item) => item.id === state.selectedProfileId);
  if (!profile) {
    return `
      <div class="selected-profile-card empty-selected-profile">
        <div>
          <div class="sec-label">目前模板角色</div>
          <strong>尚未選擇模板</strong>
          <small>先在上方挑一個角色模板，再開始微調尺寸、構圖、Layer、妝容與場景。</small>
        </div>
      </div>`;
  }
  const cupSizeLabel = state.cupSize && state.cupSize !== "正常比例" ? `｜罩杯 ${escapeHtml(state.cupSize)}` : "";

  return `
    <div class="selected-profile-card">
      <div>
        <div class="sec-label">目前模板角色</div>
        <strong>${escapeHtml(profile.title)}</strong>
        <small>${escapeHtml(profile.category)}${cupSizeLabel}</small>
      </div>
      <button type="button" class="secondary small-btn" data-scroll-target="template-picker">重新選模板</button>
    </div>`;
}

function stateWithProfileApplied(baseState, profile) {
  const direction = templateDirectionForProfile(profile);
  const nextState = {
    ...baseState,
    category: profile.category || "",
    theme: profile.title || profile.themeHint || "",
    makeup: profile.makeup || "",
    scene: profile.scene || "",
    sceneEnvironment: mergeTemplateDirection(profile.sceneEnvironment || "", direction.environment),
    sceneAction: mergeTemplateDirection(profile.sceneAction || "", direction.action),
    sceneLighting: profile.sceneLighting || "",
    cupSize: profile.cupSize || profileDefaultCupSize(profile),
    selectedProfileId: profile.id,
  };

  COSTUME_LAYERS.forEach((layer) => {
    nextState[layer.id] = profile.layers?.[layer.id] || "";
  });

  return nextState;
}

function profileDefaultCupSize(profile) {
  return parentCategoryForProfile(profile) === "奇幻異世界 / 暗黑王族" ? "K" : "正常比例";
}

function profileCountText(activeParentCategory, activeCategory, searchTerm) {
  const count = filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm).length;
  const total = WORLD_LAYER_PROFILES.length;
  return `${count.toLocaleString("zh-Hant")} / ${total.toLocaleString("zh-Hant")} 組模板`;
}

function promptStats(prompt) {
  const text = String(prompt || "");
  if (!text) return "尚未組合";
  return `${text.length.toLocaleString("zh-Hant")} 字｜可直接複製`;
}

function historyMarkup() {
  const history = loadHistory();
  if (history.length === 0) {
    return `<p class="empty-history">尚無輸出紀錄</p>`;
  }

  return history
    .map(
      (item) => `
        <button type="button" class="history-item" data-history-id="${escapeHtml(item.id)}">
          <span>${escapeHtml(item.title)}</span>
          <small>${escapeHtml(item.ratio)}｜${item.length.toLocaleString("zh-Hant")} 字</small>
        </button>`,
    )
    .join("");
}

function render() {
  const state = loadState();
  const uiPrefs = loadUiPrefs();
  const activeParentCategory = uiPrefs.roleParentCategory || ALL_FILTER_LABEL;
  const activeCategory = ALL_FILTER_LABEL;
  const profileSearch = uiPrefs.profileSearch || "";
  const profileVisibleCount = uiPrefs.profileVisibleCount || PROFILE_PAGE_SIZE;

  document.querySelector("#app").innerHTML = `
    <main class="shell">
      <section class="workspace" aria-label="出圖咒語補欄表單">
        <header class="app-header">
          <div>
            <div class="eyebrow">電影級咒語編輯器</div>
            <h1>出圖自組咒語生產器 <span class="version-mark">${APP_VERSION}</span></h1>
            <p>填入少量關鍵資訊，直接輸出可貼給 ChatGPT 的真人電影級生成層咒語。</p>
            <p class="principle-line">${PRODUCT_PRINCIPLE}</p>
          </div>
          <div class="status-chip">單檔 HTML｜${APP_VERSION}</div>
        </header>

        <div class="workspace-grid">
          <form class="controls" id="prompt-form">
            <input type="hidden" name="selectedProfileId" value="${escapeHtml(state.selectedProfileId)}" />
            <section class="form-section template-first-section">
              <div class="library-toolbar">
                <div>
                  <div class="sec-label">角色大分類</div>
                  <small>先縮小世界觀範圍，再從模板開始建立角色。</small>
                </div>
              </div>
              <div class="filter-row parent-filter-row" aria-label="角色大分類篩選">${parentCategoryButtons(activeParentCategory)}</div>

              <div class="template-picker">
                <div class="library-toolbar template-grid-toolbar">
                  <div>
                    <div class="sec-label">選擇模板</div>
                    <small data-profile-count>${escapeHtml(profileCountText(activeParentCategory, activeCategory, profileSearch))}</small>
                  </div>
                  <div class="template-toolbar-stack">
                    <label class="compact-search">
                      <span>搜尋模板</span>
                      <input class="inline-search" name="profileSearch" value="${escapeHtml(profileSearch)}" placeholder="輸入角色、分類、別名或 id" />
                    </label>
                  </div>
                </div>
                <div class="template-grid-note">直接點小格選模板；我把它維持在頁面格狀排列，方便快速掃描，不再走下拉式挑選。</div>
                <div class="profile-row template-profile-row">${worldLayerProfileButtons(activeParentCategory, activeCategory, profileSearch, state.selectedProfileId, profileVisibleCount)}</div>
                ${profileLibraryFooter(activeParentCategory, activeCategory, profileSearch, state.selectedProfileId, profileVisibleCount)}
              </div>
            </section>

            <section class="form-section detail-section">
              ${selectedProfileCard(state)}
              <div class="quick-compose-bar">
                <button type="button" data-action="compose-copy">完成出圖 + 複製完整咒語</button>
                <small>不調整詳細設定時，可選好模板後直接產生。</small>
              </div>
              <div class="section-head">
                <div>
                  <h2>詳細設定</h2>
                  <p>從目前模板角色開始，微調分類、尺寸、構圖、主視覺與主題方向。</p>
                </div>
              </div>
              <div class="meta-grid">
                <label class="category-field">
                  <span>分類</span>
                  <input name="category" list="role-category-list" value="${escapeHtml(state.category)}" placeholder="例：仙俠修真、魅姬系列、世界地標旅拍" />
                  <datalist id="role-category-list">${categoryOptions()}</datalist>
                  <small class="field-help">可留白；留白時會依主題、服裝與場景自動推定。</small>
                </label>
              </div>
              <div class="choice-section">
                <div>
                  <div class="sec-label">常用圖片尺寸</div>
                  <div class="choice-grid ratio-choice-grid">${choiceCards("ratio", RATIOS, state.ratio, RATIO_LABELS)}</div>
                </div>
                <div>
                  <div class="sec-label">人物鏡頭</div>
                  <div class="choice-grid framing-choice-grid">${choiceCards("cameraFraming", CAMERA_FRAMINGS, state.cameraFraming)}</div>
                  <small class="field-help">鏡頭焦段固定 50mm；這裡只控制全身、半身、膝蓋以上、胸部以上或遠景的構圖比例。</small>
                </div>
              </div>
              <div class="visual-control-section">
                <div>
                  <div class="sec-label">電影主視覺模式</div>
                  <div class="choice-grid mode-choice-grid">${choiceCards("visualMode", VISUAL_MODES, state.visualMode)}</div>
                </div>
                <div>
                  <div class="sec-label">色彩張力</div>
                  <div class="choice-grid intensity-choice-grid">${choiceCards("colorIntensity", COLOR_INTENSITIES, state.colorIntensity)}</div>
                </div>
                <div>
                  <div class="sec-label">布料動態</div>
                  <div class="choice-grid fabric-choice-grid">${choiceCards("fabricMotion", FABRIC_MOTIONS, state.fabricMotion)}</div>
                </div>
                <small class="field-help">這三項只調整生成層權重：讓整體更接近高密度、亮場、華麗海報感，而不是灰暗、稀疏、普通角色設定卡。</small>
              </div>
              <div class="director-priority-section">
                <div class="section-head compact-head">
                  <div>
                    <h2>電影主視覺導演層</h2>
                    <p>留白時系統會自動生成；手動填寫時優先控制第一眼焦點與海報瞬間，不限定古裝語彙。</p>
                  </div>
                </div>
                <label>
                  <span>主視覺</span>
                  <textarea name="visualFocus" rows="2" placeholder="例：主角大型輪廓壓住畫面中心，動態布料或場景主元素形成 S 型流線，眼神是第一焦點">${escapeHtml(state.visualFocus)}</textarea>
                </label>
                <label>
                  <span>畫面事件</span>
                  <textarea name="frameEvent" rows="2" placeholder="例：她剛穿過光影與前景遮擋回身看向鏡頭，服裝或環境元素被氣流帶起，遠景空間層次襯托她出場">${escapeHtml(state.frameEvent)}</textarea>
                </label>
                <small class="field-help">這層比 Layer 1-10 更重要：先定第一視覺焦點、主角輪廓、動態與情緒，服裝細節只服務畫面。</small>
              </div>
              <div class="theme-stack">
                <small class="field-help">主題是最高方向控制器。請寫「角色身份 + 世界觀定位」，避免美女、女神、完美五官、網紅感、動漫、Vogue、純欲、白月光、抽象氣質，或只有風格沒有角色的詞。</small>
                <div class="field-block">
                  <label for="theme-input">
                    <span>主題（必填）</span>
                  </label>
                  <input id="theme-input" required name="theme" value="${escapeHtml(state.theme)}" placeholder="例：大唐西域公主、絲路神殿祭司、敦煌飛天舞姬" />
                </div>
              </div>
            </section>

            <section class="form-section">
              <div class="section-head">
                <div>
                  <h2>服裝 Layer 系統</h2>
                  <p>模板會先填入 Layer 1-10；現在 Layer 是服裝參考，不是逐層展示清單。</p>
                </div>
              </div>

            <div class="sec-label">Layer 1-10</div>
            <div class="layer-grid ordered-layer-grid">${costumeLayerFields(state)}</div>
          </section>

          <section class="form-section">
            <div class="section-head">
              <div>
                <h2>妝容與場景</h2>
                <p>先填一段場景；系統固定 50mm，會自動補近中遠景、角色動作、光影與空氣層次。</p>
              </div>
            </div>
            <label>
              <span>妝容</span>
              <input name="makeup" value="${escapeHtml(state.makeup)}" placeholder="可空白，預設依主題生成電影級藝人妝容" />
              <div class="suggestion-row compact-suggestion-row">${fieldSuggestionButtons("makeup")}</div>
              <small class="field-help">妝容僅限表面妝容、真實電影妝感、中性神態，不可改變骨相或五官比例。</small>
            </label>

            <div class="scene-block">
              <label>
                <span>場景</span>
                <textarea name="scene" rows="3" placeholder="例：黑暗歌德宮廷大殿、黑曜石柱、燭火、月光彩窗、灰燼粒子">${escapeHtml(state.scene)}</textarea>
              </label>
              <div class="suggestion-row scene-preset-row">${fieldSuggestionButtons("scene")}</div>
              <div class="scene-action-row">
                <button type="button" class="secondary" data-action="expand-scene">自動補導演欄位</button>
                <small class="field-help">固定 50mm；通常只填場景即可，進階欄位可微調環境、動作、光影。</small>
              </div>
            </div>

            <details class="director-panel">
              <summary>
                <div class="director-summary-content">
                  <span>進階導演欄位</span>
                  <small>環境 / 動作 / 光影，可選</small>
                </div>
                <label class="director-cup-field" data-director-cup-wrapper>
                  <span>罩杯</span>
                  <select name="cupSize" data-director-cup>
                    ${cupSizeSelectOptions(cupSizeSelectValue(state.cupSize))}
                  </select>
                </label>
              </summary>
              <div class="director-grid">
                <label>
                  <span>環境</span>
                  <textarea name="sceneEnvironment" rows="2" placeholder="場景元素、道具、特效與氛圍參考；最終近景 / 中景 / 遠景由 ChatGPT 依主題、角色與情節重新設計">${escapeHtml(state.sceneEnvironment)}</textarea>
                  <div class="suggestion-row compact-suggestion-row">${fieldSuggestionButtons("sceneEnvironment")}</div>
                </label>
                <label>
                  <span>動作</span>
                  <textarea name="sceneAction" rows="2" placeholder="角色情緒、停留凝視 / 緩慢行走 / 旋身、手部、眼神、布料互動、臉部不可遮擋">${escapeHtml(state.sceneAction)}</textarea>
                  <div class="suggestion-row compact-suggestion-row">${fieldSuggestionButtons("sceneAction")}</div>
                </label>
                <label>
                  <span>光影</span>
                  <textarea name="sceneLighting" rows="2" placeholder="光源、柔和邊緣分離光、霧氣、景深、空氣感">${escapeHtml(state.sceneLighting)}</textarea>
                  <div class="suggestion-row compact-suggestion-row">${fieldSuggestionButtons("sceneLighting")}</div>
                </label>
              </div>
            </details>
          </section>

          <div class="actions">
            <button type="button" data-action="compose-copy">完成出圖 + 複製完整咒語</button>
            <button type="button" data-action="download" class="secondary">下載 .txt</button>
            <button type="button" data-action="reset" class="ghost">清空</button>
          </div>
          <div class="status-line compose-status" id="status-line">${escapeHtml(promptStats(state.finalPrompt))}</div>
          </form>

          <section class="output-stack" aria-label="輸出與紀錄">
            <div class="panel result">
              <div class="panel-head"><h2>上傳照片後貼給 ChatGPT 的生成層咒語</h2></div>
              <textarea id="prompt-output" readonly placeholder="按「完成出圖 + 複製完整咒語」後會顯示並複製：不複製母板全文的導演式生成咒語">${escapeHtml(state.finalPrompt)}</textarea>
            </div>

            <div class="panel history-panel">
              <div class="panel-head">
                <h2>最近輸出</h2>
                <button type="button" class="ghost small-btn" data-action="clear-history">清除紀錄</button>
              </div>
              <div class="history-list" id="history-list">${historyMarkup()}</div>
            </div>
          </section>
        </div>
      </section>
    </main>`;

  bindEvents();
}

function composePrompt(form) {
  const state = formToState(form);
  if (!state.theme) {
    setStatus("主題為必填欄位");
    form.querySelector('[name="theme"]').focus();
    return "";
  }

  const finalPrompt = buildChatGptInstruction(state);
  const nextState = { ...state, finalPrompt };
  saveState(nextState);
  rememberPrompt(state, finalPrompt);
  document.querySelector("#prompt-output").value = finalPrompt;
  setStatus(`已完成組合｜${promptStats(finalPrompt)}`);
  refreshHistory();
  return finalPrompt;
}

async function composeAndCopyPrompt(form) {
  const finalPrompt = composePrompt(form);
  if (!finalPrompt.trim()) return;

  try {
    await copyText(finalPrompt);
    setStatus(`已完成並複製咒語｜${promptStats(finalPrompt)}`);
  } catch {
    setStatus("已完成組合，但瀏覽器封鎖剪貼簿，請手動全選複製輸出框");
    document.querySelector("#prompt-output").focus();
    document.querySelector("#prompt-output").select();
  }
}

function bindEvents() {
  const form = document.querySelector("#prompt-form");
  document.querySelectorAll("[data-fill-field]").forEach((button) => {
    button.addEventListener("click", () => fillField(form, button.dataset.fillField, button.dataset.fillValue));
  });
  document.querySelectorAll("[data-role-parent]").forEach((button) => {
    button.addEventListener("click", () => {
      saveUiPrefs({
        roleParentCategory: button.dataset.roleParent,
        roleCategory: ALL_FILTER_LABEL,
        profileVisibleCount: PROFILE_PAGE_SIZE,
      });
      saveState({ ...formToState(form), finalPrompt: document.querySelector("#prompt-output").value });
      render();
    });
  });
  document.querySelectorAll("[data-world-profile]").forEach((button) => {
    button.addEventListener("click", () => applyWorldLayerProfile(form, button.dataset.worldProfile));
  });
  document.querySelector('[data-scroll-target="template-picker"]')?.addEventListener("click", () => {
    document.querySelector(".template-first-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.querySelector("[data-director-cup-wrapper]")?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  document.querySelector("[data-director-cup]")?.addEventListener("keydown", (event) => {
    event.stopPropagation();
  });
  form.elements.theme.addEventListener("input", () => refreshThemeRisk(form.elements.theme.value));
  form.elements.profileSearch?.addEventListener("input", () => {
    saveUiPrefs({
      profileSearch: form.elements.profileSearch.value,
      profileVisibleCount: PROFILE_PAGE_SIZE,
    });
    saveState({ ...formToState(form), finalPrompt: document.querySelector("#prompt-output").value });
    refreshProfileLibrary(form);
  });
  document.querySelector("[data-load-more-profiles]")?.addEventListener("click", () => {
    const prefs = loadUiPrefs();
    saveUiPrefs({
      profileVisibleCount: (Number(prefs.profileVisibleCount) || PROFILE_PAGE_SIZE) + PROFILE_PAGE_SIZE,
    });
    refreshProfileLibrary(form);
  });
  form.addEventListener("input", () => {
    const state = formToState(form);
    saveState({ ...state, finalPrompt: document.querySelector("#prompt-output").value });
  });

  document.querySelector('[data-action="expand-scene"]').addEventListener("click", () => expandSceneFields(form));
  document.querySelector('[data-action="compose-copy"]').addEventListener("click", () => composeAndCopyPrompt(form));
  document.querySelector('[data-action="download"]').addEventListener("click", () => downloadPrompt(form));
  document.querySelector('[data-action="reset"]').addEventListener("click", () => resetForm());
  document.querySelector('[data-action="clear-history"]').addEventListener("click", () => clearHistory());
  bindThemeSuggestionEvent();
  bindHistoryEvents();
}

function fillField(form, fieldName, value) {
  if (!form.elements[fieldName]) return;
  form.elements[fieldName].value = value;
  if (fieldName === "theme") {
    refreshThemeRisk(value);
  }
  const state = formToState(form);
  saveState({ ...state, finalPrompt: document.querySelector("#prompt-output").value });
  setStatus(`已填入｜${value}`);
}

function refreshThemeRisk(value) {
  void value;
}

function bindThemeSuggestionEvent() {
  // Theme guidance is now text-only in the UI; no live suggestion box is rendered.
}

function refreshProfileLibrary(form) {
  const uiPrefs = loadUiPrefs();
  const activeParentCategory = uiPrefs.roleParentCategory || ALL_FILTER_LABEL;
  const activeCategory = ALL_FILTER_LABEL;
  const profileSearch = form.elements.profileSearch?.value || "";
  const selectedProfileId = form.elements.selectedProfileId?.value || "";
  const profileVisibleCount = uiPrefs.profileVisibleCount || PROFILE_PAGE_SIZE;

  document.querySelector("[data-profile-count]").textContent = profileCountText(activeParentCategory, activeCategory, profileSearch);
  document.querySelector(".template-profile-row").innerHTML = worldLayerProfileButtons(
    activeParentCategory,
    activeCategory,
    profileSearch,
    selectedProfileId,
    profileVisibleCount,
  );
  document.querySelector(".template-grid-foot")?.remove();
  document.querySelector(".template-picker")?.insertAdjacentHTML(
    "beforeend",
    profileLibraryFooter(activeParentCategory, activeCategory, profileSearch, selectedProfileId, profileVisibleCount),
  );
  document.querySelectorAll("[data-world-profile]").forEach((button) => {
    button.addEventListener("click", () => applyWorldLayerProfile(form, button.dataset.worldProfile));
  });
  document.querySelector("[data-load-more-profiles]")?.addEventListener("click", () => {
    const prefs = loadUiPrefs();
    saveUiPrefs({
      profileVisibleCount: (Number(prefs.profileVisibleCount) || PROFILE_PAGE_SIZE) + PROFILE_PAGE_SIZE,
    });
    refreshProfileLibrary(form);
  });
}

function applyWorldLayerProfile(form, profileId) {
  const profile = WORLD_LAYER_PROFILES.find((item) => item.id === profileId);
  if (!profile) return;
  const state = stateWithProfileApplied(formToState(form), profile);
  saveState({ ...state, finalPrompt: "" });
  render();
  setStatus(`已套用世界觀 Layer｜${profile.title}`);
}

function expandSceneFields(form) {
  const state = formToState(form);
  if (!state.scene && !state.theme) {
    setStatus("請先輸入主題或場景");
    form.querySelector('[name="scene"]').focus();
    return;
  }

  const nextState = expandSceneToDirectorFields(state);
  form.elements.sceneEnvironment.value = nextState.sceneEnvironment;
  form.elements.sceneAction.value = nextState.sceneAction;
  form.elements.sceneLighting.value = nextState.sceneLighting;
  saveState({ ...nextState, finalPrompt: document.querySelector("#prompt-output").value });
  setStatus("已拆成導演欄位");
}

function downloadPrompt(form) {
  let value = document.querySelector("#prompt-output").value;
  if (!value.trim()) {
    composePrompt(form);
    value = document.querySelector("#prompt-output").value;
  }
  if (!value.trim()) return;

  const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hongbing-cinematic-prompt.txt";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus(`已下載 .txt｜${promptStats(value)}`);
}

function resetForm() {
  saveState(DEFAULT_FORM);
  document.querySelector("#prompt-output").value = "";
  render();
}

function refreshHistory() {
  document.querySelector("#history-list").innerHTML = historyMarkup();
  bindHistoryEvents();
}

function bindHistoryEvents() {
  document.querySelectorAll("[data-history-id]").forEach((button) => {
    button.addEventListener("click", () => restoreHistory(button.dataset.historyId));
  });
}

function restoreHistory(id) {
  const item = loadHistory().find((entry) => entry.id === id);
  if (!item) return;
  document.querySelector("#prompt-output").value = item.prompt;
  const state = loadState();
  saveState({ ...state, finalPrompt: item.prompt });
  setStatus(`已載入紀錄｜${promptStats(item.prompt)}`);
}

function clearHistory() {
  saveHistory([]);
  refreshHistory();
  setStatus("已清除輸出紀錄");
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function setStatus(message) {
  document.querySelector("#status-line").textContent = message;
}

render();
