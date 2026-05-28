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

const STORAGE_KEY = "hongbing-travel-prompt-state";
const HISTORY_KEY = "hongbing-travel-prompt-history";
const UI_PREFS_KEY = "hongbing-travel-prompt-ui-prefs";
const HISTORY_LIMIT = 5;
const ALL_FILTER_LABEL = "全部";
const APP_VERSION = "v1.05";
const PRODUCT_PRINCIPLE = "最高原則：真人鎖臉優先於所有華麗主視覺，不讓角色滑回 AI 仙女臉。";
const PARENT_ROLE_CATEGORIES = [
  {
    label: "中國歷代服裝",
    keywords: [
      "中國朝代",
      "大唐",
      "盛唐",
      "唐代",
      "長安",
      "大周",
      "清宮",
      "故宮",
      "宮廷",
      "皇后",
      "貴妃",
      "王姬",
      "民國",
      "江南",
      "書香",
      "仕女",
      "水榭",
      "水鄉",
      "古鎮",
      "荷塘",
      "牡丹",
      "中式",
      "古裝",
    ],
  },
  {
    label: "武俠江湖 / 戰場女將",
    keywords: ["武俠", "江湖", "女俠", "劍", "戰場", "女將", "長城", "邊關", "血色江湖", "劍門", "華山"],
  },
  {
    label: "仙俠神話 / 古裝陸劇",
    keywords: [
      "仙俠",
      "修真",
      "神話",
      "飛天",
      "聖女",
      "神女",
      "仙姬",
      "天界",
      "仙宮",
      "神域",
      "鳳凰",
      "白龍",
      "水鏡",
      "晶花",
      "深海",
      "水下",
      "倒影",
      "龍宮",
      "月宮",
      "瑤池",
      "九尾",
      "狐仙",
      "陰陽",
      "紫櫻",
      "古裝陸劇",
    ],
  },
  {
    label: "東方異域 / 絲路西域",
    keywords: ["西域", "絲路", "大漠", "沙漠", "樓蘭", "敦煌", "莫高窟", "波斯", "中亞", "沙海", "赤砂", "駱駝"],
  },
  {
    label: "奇幻異世界 / 暗黑王族",
    keywords: [
      "魅魔",
      "魔姬",
      "魔后",
      "魔王",
      "魔殿",
      "暗黑",
      "黑暗",
      "哥德",
      "墮天使",
      "墮羽",
      "黑羽",
      "黑翼",
      "冥界",
      "幽冥",
      "亡靈",
      "血族",
      "吸血鬼",
      "夜庭",
      "黑鴉",
      "亡魂",
      "紫晶",
      "骸骨",
      "奇幻魔法",
    ],
  },
  {
    label: "西方古典 / 歐陸史詩",
    keywords: ["雅典", "希臘", "奧林匹斯", "神諭", "巴洛克", "歐陸", "文藝復興", "古堡", "聖殿", "凡爾賽", "歌劇"],
  },
  {
    label: "世界景點旅拍",
    keywords: ["世界地標", "世界旅拍", "歐洲", "巴黎", "威尼斯", "首爾", "北境", "水城", "古橋", "海岸", "旅拍", "水巷"],
  },
  {
    label: "現代都市 / 街拍電影",
    keywords: ["現代", "都市", "都會", "city pop", "霓虹", "街頭", "街拍", "韓系", "賽博", "電競", "格鬥", "未來"],
  },
  {
    label: "花園童話 / 自然精靈",
    keywords: ["花園", "花靈", "森林", "精靈", "童話", "白玫", "花神", "夢幻", "花海", "晶花", "水鏡", "自然", "紫陽花"],
  },
];

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
      ...(JSON.parse(localStorage.getItem(UI_PREFS_KEY)) || {}),
    };
  } catch {
    return { roleParentCategory: ALL_FILTER_LABEL, roleCategory: ALL_FILTER_LABEL, profileSearch: "" };
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

function normalizeSearchText(value) {
  return String(value || "").toLowerCase();
}

function parentCategoryButtons(activeParentCategory) {
  return [ALL_FILTER_LABEL, ...PARENT_ROLE_CATEGORIES.map((category) => category.label)]
    .map(
      (category) =>
        `<button type="button" class="filter-chip parent-chip ${activeParentCategory === category ? "active" : ""}" data-role-parent="${escapeHtml(category)}">${escapeHtml(category)}</button>`,
    )
    .join("");
}

function parentCategoryForText(value) {
  const haystack = normalizeSearchText(value);
  return PARENT_ROLE_CATEGORIES.find((parent) =>
    parent.keywords.some((keyword) => haystack.includes(normalizeSearchText(keyword))),
  )?.label;
}

function worldProfileSearchText(profile) {
  return `${profile.title} ${profile.themeHint} ${profile.category} ${profile.id} ${(profile.aliases || []).join(" ")} ${Object.values(profile.layers || {}).join(" ")} ${profile.makeup || ""} ${profile.scene || ""} ${profile.sceneEnvironment || ""} ${profile.sceneAction || ""} ${profile.sceneLighting || ""}`;
}

function profileMatchesParent(profile, activeParentCategory) {
  return activeParentCategory === ALL_FILTER_LABEL || parentCategoryForText(worldProfileSearchText(profile)) === activeParentCategory;
}

function profileMatchesFineCategory(profile, activeCategory) {
  return activeCategory === ALL_FILTER_LABEL || profile.category === activeCategory;
}

function categoryOptions() {
  return allRoleCategories().map((category) => `<option value="${escapeHtml(category)}"></option>`).join("");
}

function filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm) {
  const keyword = normalizeSearchText(searchTerm).trim();
  return WORLD_LAYER_PROFILES.filter((profile) => {
    const categoryMatched = profileMatchesParent(profile, activeParentCategory) && profileMatchesFineCategory(profile, activeCategory);
    if (!categoryMatched) return false;
    if (!keyword) return true;
    return normalizeSearchText(worldProfileSearchText(profile)).includes(keyword);
  });
}

function worldLayerProfileButtons(activeParentCategory, activeCategory, searchTerm, selectedProfileId = "") {
  const profiles = filteredWorldLayerProfiles(activeParentCategory, activeCategory, searchTerm);
  if (profiles.length === 0) {
    return `<p class="empty-inline profile-empty">找不到符合條件的世界觀模板</p>`;
  }

  return profiles.map(
    (profile) =>
      `<button type="button" class="profile-chip ${selectedProfileId === profile.id ? "active" : ""}" data-world-profile="${escapeHtml(profile.id)}" aria-label="${escapeHtml(`${profile.title} ${profile.themeHint}`)}">
        <span>${escapeHtml(profile.title)}</span>
        <small>${escapeHtml(profile.category)}</small>
      </button>`,
  ).join("");
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

  return `
    <div class="selected-profile-card">
      <div>
        <div class="sec-label">目前模板角色</div>
        <strong>${escapeHtml(profile.title)}</strong>
        <small>${escapeHtml(profile.category)}</small>
      </div>
      <button type="button" class="secondary small-btn" data-scroll-target="template-picker">重新選模板</button>
    </div>`;
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

  document.querySelector("#app").innerHTML = `
    <main class="shell">
      <section class="workspace" aria-label="出圖咒語補欄表單">
        <header class="app-header">
          <div>
            <div class="eyebrow">CINEMATIC PROMPT BUILDER</div>
            <h1>出圖自組咒語生產器 <span class="version-mark">${APP_VERSION}</span></h1>
            <p>填少量關鍵資訊，輸出可貼給 ChatGPT 的真人電影級生成層咒語。</p>
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
                <div class="library-toolbar">
                  <div>
                    <div class="sec-label">選擇模板</div>
                    <small data-profile-count>${escapeHtml(profileCountText(activeParentCategory, activeCategory, profileSearch))}</small>
                  </div>
                  <label class="compact-search">
                    <span>搜尋模板</span>
                    <input class="inline-search" name="profileSearch" value="${escapeHtml(profileSearch)}" placeholder="輸入角色、分類或 id" />
                  </label>
                </div>
                <div class="profile-row template-profile-row">${worldLayerProfileButtons(activeParentCategory, activeCategory, profileSearch, state.selectedProfileId)}</div>
              </div>
            </section>

            <section class="form-section detail-section">
              ${selectedProfileCard(state)}
              <div class="section-head">
                <div>
                  <h2>詳細設定</h2>
                  <p>從目前模板角色開始，微調分類、尺寸、構圖與主題。</p>
                </div>
              </div>
              <div class="meta-grid">
                <label class="category-field">
                  <span>分類</span>
                  <input name="category" list="role-category-list" value="${escapeHtml(state.category)}" placeholder="例：仙俠修真、魅姬系列、世界地標旅拍" />
                  <datalist id="role-category-list">${categoryOptions()}</datalist>
                  <small class="field-help">可空白；空白時會依主題、服裝、場景自動推定。</small>
                </label>
              </div>
              <div class="choice-section">
                <div>
                  <div class="sec-label">常用圖片尺寸</div>
                  <div class="choice-grid ratio-choice-grid">${choiceCards("ratio", RATIOS, state.ratio)}</div>
                </div>
                <div>
                  <div class="sec-label">人物鏡頭</div>
                  <div class="choice-grid framing-choice-grid">${choiceCards("cameraFraming", CAMERA_FRAMINGS, state.cameraFraming)}</div>
                  <small class="field-help">鏡頭焦段固定 50mm；這裡只控制全身、半身、膝蓋以上、胸部以上或遠景構圖。</small>
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
                <small class="field-help">這三項只調整生成層權重：讓畫面更像高級商業奇幻電影主視覺，而不是灰暗角色設定卡。</small>
              </div>
              <div class="director-priority-section">
                <div class="section-head compact-head">
                  <div>
                    <h2>電影主視覺導演層</h2>
                    <p>空白會自動生成；有填時優先控制「第一眼看到什麼」與「電影事件瞬間」。</p>
                  </div>
                </div>
                <label>
                  <span>主視覺</span>
                  <textarea name="visualFocus" rows="2" placeholder="例：紅金披帛佔據畫面，女主角位於花宴燈籠中心，絲綢形成巨大 S 型流線，眼神是第一焦點">${escapeHtml(state.visualFocus)}</textarea>
                </label>
                <label>
                  <span>畫面事件</span>
                  <textarea name="frameEvent" rows="2" placeholder="例：她剛穿過燭火與花瓣回身看向鏡頭，披帛被風掀起，群演與燈籠在遠景形成電影規模感">${escapeHtml(state.frameEvent)}</textarea>
                </label>
                <small class="field-help">這層比 Layer 1-10 更重要：先定第一視覺焦點、主角輪廓、動態與情緒，服裝細節只服務畫面。</small>
              </div>
              <div class="theme-stack">
                <small class="field-help">主題是最高方向控制器。請寫「角色身份 + 世界觀定位」，避免美女、女神、完美五官、網紅感、動漫、Vogue、純欲、白月光、抽象氣質或只有風格沒有角色的詞。</small>
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
                <span>進階導演欄位</span>
                <small>環境 / 動作 / 光影，可選</small>
              </summary>
              <div class="director-grid">
                <label>
                  <span>環境</span>
                  <textarea name="sceneEnvironment" rows="2" placeholder="近景遮擋、中景角色、遠景建築 / 雲海 / 街景、天氣、世界觀空間">${escapeHtml(state.sceneEnvironment)}</textarea>
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
            <button type="button" data-action="compose">完成出圖咒語</button>
            <button type="button" data-action="copy" class="secondary">複製完整咒語</button>
            <button type="button" data-action="download" class="secondary">下載 .txt</button>
            <button type="button" data-action="reset" class="ghost">清空</button>
          </div>
          <div class="status-line compose-status" id="status-line">${escapeHtml(promptStats(state.finalPrompt))}</div>
          </form>

          <section class="output-stack" aria-label="輸出與紀錄">
            <div class="panel result">
              <div class="panel-head"><h2>上傳照片後貼給 ChatGPT 的生成層咒語</h2></div>
              <textarea id="prompt-output" readonly placeholder="按「完成出圖咒語」後會顯示：不複製母板全文的導演式生成咒語">${escapeHtml(state.finalPrompt)}</textarea>
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
    return;
  }

  const finalPrompt = buildChatGptInstruction(state);
  const nextState = { ...state, finalPrompt };
  saveState(nextState);
  rememberPrompt(state, finalPrompt);
  document.querySelector("#prompt-output").value = finalPrompt;
  setStatus(`已完成組合｜${promptStats(finalPrompt)}`);
  refreshHistory();
}

function bindEvents() {
  const form = document.querySelector("#prompt-form");
  document.querySelectorAll("[data-fill-field]").forEach((button) => {
    button.addEventListener("click", () => fillField(form, button.dataset.fillField, button.dataset.fillValue));
  });
  document.querySelectorAll("[data-role-parent]").forEach((button) => {
    button.addEventListener("click", () => {
      saveUiPrefs({ roleParentCategory: button.dataset.roleParent, roleCategory: ALL_FILTER_LABEL });
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
  form.elements.theme.addEventListener("input", () => refreshThemeRisk(form.elements.theme.value));
  form.elements.profileSearch?.addEventListener("input", () => {
    saveUiPrefs({ profileSearch: form.elements.profileSearch.value });
    saveState({ ...formToState(form), finalPrompt: document.querySelector("#prompt-output").value });
    refreshProfileLibrary(form);
  });
  form.addEventListener("input", () => {
    const state = formToState(form);
    saveState({ ...state, finalPrompt: document.querySelector("#prompt-output").value });
  });

  document.querySelector('[data-action="expand-scene"]').addEventListener("click", () => expandSceneFields(form));
  document.querySelector('[data-action="compose"]').addEventListener("click", () => composePrompt(form));
  document.querySelector('[data-action="copy"]').addEventListener("click", async () => {
    const value = document.querySelector("#prompt-output").value;
    if (!value.trim()) {
      composePrompt(form);
    }
    const nextValue = document.querySelector("#prompt-output").value;
    if (!nextValue.trim()) return;
    try {
      await copyText(nextValue);
      setStatus(`已複製咒語｜${promptStats(nextValue)}`);
    } catch {
      setStatus("瀏覽器封鎖剪貼簿，請手動全選複製輸出框");
      document.querySelector("#prompt-output").focus();
      document.querySelector("#prompt-output").select();
    }
  });
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
  document.querySelector("[data-profile-count]").textContent = profileCountText(activeParentCategory, activeCategory, profileSearch);
  document.querySelector(".profile-row").innerHTML = worldLayerProfileButtons(activeParentCategory, activeCategory, profileSearch, selectedProfileId);
  document.querySelectorAll("[data-world-profile]").forEach((button) => {
    button.addEventListener("click", () => applyWorldLayerProfile(form, button.dataset.worldProfile));
  });
}

function applyWorldLayerProfile(form, profileId) {
  const profile = WORLD_LAYER_PROFILES.find((item) => item.id === profileId);
  if (!profile) return;

  if (profile.category && form.elements.category) {
    form.elements.category.value = profile.category;
  }
  if (form.elements.theme) {
    form.elements.theme.value = profile.themeHint;
  }
  if (profile.makeup && form.elements.makeup) {
    form.elements.makeup.value = profile.makeup;
  }
  if (profile.scene && form.elements.scene) {
    form.elements.scene.value = profile.scene;
  }
  if (profile.sceneEnvironment && form.elements.sceneEnvironment) {
    form.elements.sceneEnvironment.value = profile.sceneEnvironment;
  }
  if (profile.sceneAction && form.elements.sceneAction) {
    form.elements.sceneAction.value = profile.sceneAction;
  }
  if (profile.sceneLighting && form.elements.sceneLighting) {
    form.elements.sceneLighting.value = profile.sceneLighting;
  }
  COSTUME_LAYERS.forEach((layer) => {
    if (profile.layers[layer.id]) {
      form.elements[layer.id].value = profile.layers[layer.id];
    }
  });
  if (form.elements.selectedProfileId) {
    form.elements.selectedProfileId.value = profile.id;
  }

  const state = { ...formToState(form), selectedProfileId: profile.id };
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
