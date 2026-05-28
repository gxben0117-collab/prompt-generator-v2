import { CORE_SPEC_TEXT } from "./coreSpec.js";
import {
  CAMERA_FRAMINGS,
  COLOR_INTENSITIES,
  COSTUME_LAYERS,
  FABRIC_MOTIONS,
  RATIOS,
  VISUAL_MODES,
} from "./data.js";

const FORBIDDEN_REPLACEMENTS = [
  [/美女|女神|絕美|完美女神|神顏|天仙|仙氣美女|甜妹|純欲|白月光|校花|高顏值|漫畫臉|初戀臉|女團感|網紅感|少女感|韓系美女|高級臉|氣質美女|超模臉|精靈系美女/g, "真人電影角色"],
  [/精緻五官|完美五官|精緻鼻型|大眼睛|小V臉|巴掌臉|高挺鼻|水汪汪大眼|櫻桃小嘴|白皙無瑕|牛奶肌|零毛孔/g, "原始真人五官"],
  [/動漫|二次元|遊戲皮膚|萌系|萌妹|可愛蘿莉|JK 美少女|JK美少女|遊戲角色|anime girl|waifu|anime face|pixiv style|cel shading|game heroine|vtuber/gi, "真人電影世界觀"],
  [/instagram model|influencer|supermodel|runway look/gi, "cinematic film still"],
  [/vogue|fashion editorial|beauty campaign|luxury fashion model|editorial makeup/gi, "commercial fantasy cinema key visual"],
  [/巨乳|爆乳|極致性感|情色|淫魅|騷|seductive pin-up|hentai|latex fetish|NSFW/gi, "高級電影魅力"],
  [/性感|挑逗|誘惑/g, "高級電影魅力"],
];

const THEME_RISK_RULES = [
  {
    name: "AI 美女模板詞",
    pattern: /美女|女神|絕美|完美女神|神顏|天仙|仙氣美女|甜妹|純欲|白月光|校花|高顏值|漫畫臉|初戀臉|女團感|網紅感|少女感|韓系美女|高級臉|氣質美女|超模臉|精靈系美女/g,
    suggestion: "改成角色身份，例如：大唐西域公主、絲路神殿祭司、雲海仙門聖女。",
  },
  {
    name: "臉部美化詞",
    pattern: /精緻五官|完美五官|精緻鼻型|大眼睛|小V臉|巴掌臉|高挺鼻|水汪汪大眼|櫻桃小嘴|白皙無瑕|牛奶肌|零毛孔/g,
    suggestion: "主題不要描述五官，五官交給上傳照片鎖定。",
  },
  {
    name: "動漫或遊戲詞",
    pattern: /動漫|二次元|遊戲皮膚|萌系|萌妹|可愛蘿莉|JK 美少女|JK美少女|遊戲角色|anime girl|waifu|anime face|pixiv style|cel shading|game heroine|vtuber/gi,
    suggestion: "改成真人電影角色，例如：敦煌飛天舞姬、江湖夜行女俠。",
  },
  {
    name: "時尚大片詞",
    pattern: /instagram model|influencer|supermodel|runway look/gi,
    suggestion: "改成電影主視覺身份，例如：巴黎黃昏旅拍女主、長安夜宴樂姬。",
  },
  {
    name: "極端性感詞",
    pattern: /巨乳|爆乳|極致性感|情色|淫魅|騷|seductive pin-up|hentai|latex fetish|NSFW/gi,
    suggestion: "改成高級電影魅力或角色權力感，例如：暗夜王座女王、北境亡國王妃。",
  },
  {
    name: "只有風格沒有角色",
    pattern: /^(賽博朋克|仙俠風|大唐風|哥德風|古裝風|暗黑風|科幻風)$/g,
    suggestion: "補上身份，例如：賽博都市特工、大唐邊關女將、哥德王座女王。",
  },
];

const THEME_REWRITE_HINTS = [
  ["仙", "雲海仙門聖女"],
  ["唐", "大唐西域公主"],
  ["敦煌", "敦煌飛天舞姬"],
  ["哥德", "哥德王座女王"],
  ["魅魔", "紫蝶夜宴魅魔"],
  ["魅姬", "夜宴絲絨魅姬"],
  ["賽博", "賽博都市特工"],
  ["巴黎", "巴黎黃昏旅拍女主"],
  ["女帝", "黑金大唐女帝"],
];

export const DEFAULT_FORM = {
  category: "",
  theme: "",
  ratio: "9:16",
  cameraFraming: "全身",
  visualMode: "Netflix 東方奇幻",
  colorIntensity: "紅金寶石",
  fabricMotion: "大動態飄紗",
  scene: "",
  sceneEnvironment: "",
  sceneAction: "",
  sceneCamera: "",
  sceneLighting: "",
  visualFocus: "",
  frameEvent: "",
  costume: "",
  ...Object.fromEntries(COSTUME_LAYERS.map((layer) => [layer.id, ""])),
  makeup: "",
  selectedProfileId: "",
  finalPrompt: "",
};

export function sanitizeInput(value = "") {
  return FORBIDDEN_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    String(value).trim().replace(/\s+/g, " "),
  );
}

export function assessThemeInput(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return {
      level: "empty",
      issues: [],
      suggestion: "請輸入角色身份 + 世界觀定位，例如：大唐西域公主。",
    };
  }

  const issues = THEME_RISK_RULES.flatMap((rule) => {
    const matches = [...text.matchAll(rule.pattern)].map((match) => match[0]);
    rule.pattern.lastIndex = 0;
    if (matches.length === 0) return [];
    return [{ name: rule.name, matches: [...new Set(matches)], suggestion: rule.suggestion }];
  });
  const roleLike = /公主|王妃|女王|女帝|祭司|聖女|舞姬|樂姬|女將|女俠|琴師|特工|王姬|長老|女官|女主/.test(text);
  const suggestion = suggestThemeRewrite(text);

  if (issues.length > 0) {
    return { level: "danger", issues, suggestion };
  }
  if (!roleLike) {
    return {
      level: "warning",
      issues: [{ name: "角色身份不足", matches: [text], suggestion: "補上身份職能，避免只有風格或氣質。" }],
      suggestion,
    };
  }
  return { level: "ok", issues: [], suggestion };
}

export function suggestThemeRewrite(value = "") {
  const text = String(value || "").trim();
  const picked = THEME_REWRITE_HINTS.find(([keyword]) => text.includes(keyword));
  if (picked) return picked[1];
  if (/高冷|仙氣|女神|白月光|純欲|精緻/.test(text)) return "雲海仙門聖女";
  if (/魅魔|魅姬|夜宴/.test(text)) return "紫蝶夜宴魅魔";
  if (/暗黑|性感|御姐|哥德/.test(text)) return "暗夜王座女王";
  return "大唐西域公主";
}

export function normalizeForm(input = {}) {
  const form = { ...DEFAULT_FORM, ...input };

  const normalized = {
    category: sanitizeInput(form.category),
    theme: sanitizeInput(form.theme),
    ratio: RATIOS.includes(form.ratio) ? form.ratio : DEFAULT_FORM.ratio,
    cameraFraming: CAMERA_FRAMINGS.includes(form.cameraFraming) ? form.cameraFraming : DEFAULT_FORM.cameraFraming,
    visualMode: VISUAL_MODES.includes(form.visualMode) ? form.visualMode : DEFAULT_FORM.visualMode,
    colorIntensity: COLOR_INTENSITIES.includes(form.colorIntensity) ? form.colorIntensity : DEFAULT_FORM.colorIntensity,
    fabricMotion: FABRIC_MOTIONS.includes(form.fabricMotion) ? form.fabricMotion : DEFAULT_FORM.fabricMotion,
    scene: sanitizeInput(form.scene),
    sceneEnvironment: sanitizeInput(form.sceneEnvironment),
    sceneAction: sanitizeInput(form.sceneAction),
    sceneCamera: sanitizeInput(form.sceneCamera),
    sceneLighting: sanitizeInput(form.sceneLighting),
    visualFocus: sanitizeInput(form.visualFocus),
    frameEvent: sanitizeInput(form.frameEvent),
    costume: sanitizeInput(form.costume),
    makeup: sanitizeInput(form.makeup),
    selectedProfileId: sanitizeInput(form.selectedProfileId),
    finalPrompt: String(form.finalPrompt || ""),
  };

  COSTUME_LAYERS.forEach((layer) => {
    normalized[layer.id] = sanitizeInput(form[layer.id]);
  });

  return normalized;
}

function pickKeyword(text, keywords) {
  return keywords.find((keyword) => text.includes(keyword)) || "";
}

export function expandCostumeToLayers(input = {}) {
  const form = normalizeForm(input);
  const text = `${form.theme} ${form.costume}`;
  const theme = form.theme || "本次主題";
  const isTang = /大唐|唐風|唐朝|公主|襦裙|披帛|步搖/.test(text);
  const color =
    pickKeyword(text, ["紫色", "黑色", "紅色", "金色", "銀色", "白色", "藍色", "月白", "米白"]) ||
    (isTang ? "金絲月白" : "符合主題的電影色彩");
  const motif =
    pickKeyword(text, ["蝴蝶", "夜宴魅魔", "魅魔", "魅姬", "哥德", "王族", "惡魔", "天使", "仙俠", "唐風", "大唐", "公主"]) || theme;
  const inner = pickKeyword(text, ["蕾絲邊", "睡袍式", "貼身", "絲綢"]) || "高訂絲綢貼身襯裙";
  const gothic = pickKeyword(text, ["哥德式", "哥德", "暗黑"]) || (isTang ? "盛唐宮廷" : "電影級世界觀");
  const chain = pickKeyword(text, ["鍊條", "鏈條", "金屬", "配件"]) || (isTang ? "玉石步搖與金絲配件" : "手工金屬飾件");
  const sheer =
    pickKeyword(text, ["透明紗衣", "透明紗", "薄紗", "紗衣", "披帛"]) || (isTang ? "金絲披帛" : "半透明外層薄紗");

  const genericSuggestions = {
    costumeLayer1: `${color}${inner}，真實貼合人體的內層基底，保留真人身形與自然布料張力`,
    costumeLayer2: `${gothic}${motif}刺繡胸衣骨架，建立角色輪廓，不改變真人骨相`,
    costumeLayer3: `${color}絲絨腰封與柔性支撐結構，真實縫製、可穿戴、符合電影戲服邏輯`,
    costumeLayer4: `${motif}主視覺裙片與不對稱垂墜布料，形成第一眼可辨識的電影輪廓`,
    costumeLayer5: `${chain}腰臀飾件，低調反光，固定在真實服裝結構上`,
    costumeLayer6: `${sheer}外袍與長拖尾，具真實重量、自然透光與空氣流動感`,
    costumeLayer7: `${motif}肩頸披肩或翼形肩飾，建立身份氣場但不可遮擋臉部`,
    costumeLayer8: `${chain}、哥德珠寶與吊飾，多層但不搶真人臉部辨識度`,
    costumeLayer9: `${color}蕾絲手套、雕塑感靴子與小型儀式配件，真實可穿戴`,
    costumeLayer10: `${motif}動態薄紗飄帶與透明紗層，配合鏡頭風向，不做遊戲特效感`,
  };

  const tangSuggestions = {
    costumeLayer1: "柔白絲綢貼身內襯，建立真人身形基底，讓重工襦裙有真實穿戴層次",
    costumeLayer2: "大唐交領襦裙基礎結構，合身但不緊繃，保留肩頸活動與盛唐古典輪廓",
    costumeLayer3: "金絲刺繡腰封與玉扣支撐，固定披帛、裙片與腰部重心",
    costumeLayer4: "重工刺繡襦裙主體，多層絲綢裙片與自然垂墜，建立公主級電影服裝體積",
    costumeLayer5: "玉石腰墜、金絲吊飾與小型金屬扣件，呼應盛唐宮廷工藝",
    costumeLayer6: "金絲披帛與半透明長紗外層，從肩臂延伸到畫面空間，具真實布料重量",
    costumeLayer7: "薄紗肩披與刺繡披肩，建立大唐公主身份氣場但不遮擋臉部",
    costumeLayer8: "玉石步搖、金絲髮飾、珍珠流蘇與細緻耳飾，建立高級宮廷珠寶層次",
    costumeLayer9: "繡鞋、絲質手飾與小型儀式配件，保持真實古裝道具感",
    costumeLayer10: "長披帛與裙擺隨風微動，配合鏡頭風向形成柔和流線，不做遊戲特效感",
  };

  const suggestions = isTang ? tangSuggestions : genericSuggestions;

  return COSTUME_LAYERS.reduce(
    (nextForm, layer) => ({
      ...nextForm,
      [layer.id]: suggestions[layer.id],
    }),
    form,
  );
}

function buildCostumeLayerText(form, theme) {
  const filledLayers = COSTUME_LAYERS.map((layer, index) => ({
    index: index + 1,
    ...layer,
    value: form[layer.id],
  })).filter((layer) => layer.value);

  const keyLayers = [1, 3, 4, 6, 8]
    .map((index) => filledLayers.find((layer) => layer.index === index))
    .filter(Boolean)
    .slice(0, 4);
  const layerSummary = keyLayers.map((layer) => `L${layer.index}: ${layer.value}`).join("；");
  return [
    form.costume || `依據「${theme}」建立電影級可穿戴戲服`,
    layerSummary ? `服裝 Layer 參考：${layerSummary}` : "",
    "Layer list is reference, not equal-priority checklist；服裝只需保留主輪廓、主材質、主色彩與一到兩個記憶點，不要平均展示每一層細節。",
    "AI director 可依電影主視覺自由整合 Layer，讓絲綢、薄紗、披帛、珠寶或羽飾服務 dominant cinematic silhouette、visual flow 與角色銀幕存在感。",
    "真實布料重量、真實縫製、電影高訂質感；避免 costume catalog、cosplay、game skin、anime outfit。",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getHiddenSystemPrompt() {
  return CORE_SPEC_TEXT;
}

function getFixedCorePrompt() {
  return CORE_SPEC_TEXT.split("********** 使用規範 **********")[0].trim();
}

function findAfterOutputFormatSection(text) {
  const candidates = ["【最終核心】", "【負面規則】", "【負面咒語系統】"];
  const outputStart = text.indexOf("【輸出格式】");
  if (outputStart === -1) return { outputStart: -1, nextStart: -1 };

  const nextStart = candidates
    .map((marker) => text.indexOf(marker, outputStart + "【輸出格式】".length))
    .filter((index) => index !== -1)
    .sort((a, b) => a - b)[0] ?? -1;

  return { outputStart, nextStart };
}

function inferCategory(theme, costume, scene) {
  const text = `${theme} ${costume} ${scene}`;
  if (/唐|漢|宋|明|清|飛天|敦煌|長安|大周|故宮|宮廷/.test(text)) return "中國朝代古裝 / 中國神話";
  if (/魅魔|魅姬|睡袍式|絲絨寢宮|暗黑浪漫/.test(text)) return "夜宴魅魔／高訂睡袍電影";
  if (/惡魔|哥德|女王|暗夜/.test(text)) return "奇幻異世界 / 暗黑王族";
  if (/仙|修真|雲海|山門/.test(text)) return "仙俠修真";
  if (/賽博|霓虹|機械|未來/.test(text)) return "科幻賽博";
  if (/巴黎|東京|地標|旅拍|都市/.test(text)) return "世界地標旅拍 / 都市時尚";
  return "奇幻電影宇宙";
}

function isDarkRoyalCategory(category = "", theme = "", scene = "") {
  const text = `${category} ${theme} ${scene}`;
  return /奇幻異世界|暗黑王族|魅魔|魅姬|魔后|暗黑|哥德|墮天使|墮羽|黑羽|黑翼|冥界|幽冥|亡靈|血族|吸血鬼|夜庭|黑鴉|紫晶|骸骨/.test(text);
}

function buildDarkRoyalBodyPresenceText(form, category) {
  if (!isDarkRoyalCategory(category, form.theme, form.scene)) return "";

  return [
    "暗黑王族身形預設：成熟豐滿但真實的成年女性體積感",
    "上身輪廓需由 couture support、structured silk gown、velvet robe drapery 與真實胸腰支撐結構承托",
    "保留真實胸腔厚度、自然重力、肩頸連接、正常腰臀比例與高訂禮服布料張力",
    "視覺焦點是黑暗王族氣場、絲綢高光、禮服支撐與電影女王銀幕存在感，不做動漫誇張身材或低俗身體焦點",
  ].join("；");
}

function inferEmotionalAction(theme, scene) {
  const text = `${theme} ${scene}`;
  if (/魅魔|女王|哥德|暗夜|王座/.test(text)) {
    return "帶有克制壓迫感的停留凝視，肩線穩定，呼吸很輕，手指自然掠過垂落布料或王座扶手，情緒像正在掌控整個空間";
  }
  if (/飛天|仙|瑤池|雲海|神族|聖女|月白/.test(text)) {
    return "帶有清冷神性的緩慢旋身或停步回望，長袖、飛帶與披帛被動作帶出柔和弧線，眼神安靜但有情緒牽引";
  }
  if (/武俠|女俠|江湖|邊關|劍/.test(text)) {
    return "帶有警覺與故事感的停步側身，手部自然靠近腰帶或劍鞘，眼神越過鏡頭看向遠方威脅";
  }
  if (/賽博|霓虹|都市|特工|雨夜/.test(text)) {
    return "帶有任務感的緩慢前行，肩頸放鬆但目光專注，手部自然收在身側或輕觸外套邊緣";
  }
  return "帶有角色情緒的自然電影動作，停留凝視、緩慢行走、微微回身或與場景道具互動，動作來自角色故事而不是擺拍";
}

const FIXED_CAMERA_TEXT = "50mm 全片幅中遠景電影構圖，人物完整入鏡，真實人像拍攝距離，近景 / 中景 / 遠景分層清楚";

function buildCameraFramingText(cameraFraming = DEFAULT_FORM.cameraFraming) {
  return `${FIXED_CAMERA_TEXT}，人物構圖：${cameraFraming}`;
}

const VISUAL_MODE_TEXT = {
  "Netflix 東方奇幻": [
    "主視覺模式：Netflix 東方奇幻主視覺 Hero Shot，人物不是安靜寫實紀錄，也不是角色設定卡，而是東方奇幻影集女主角海報中心",
    "主角權重最高，畫面第一眼先看到真人女主角、大輪廓、飛舞披帛、紅金寶石色、燈籠花宴、群演景深與視覺流線",
    "必須具備 Netflix-style eastern fantasy key visual、commercial fantasy cinema poster、high-impact heroine screen presence 與 grand oriental fantasy spectacle",
  ],
  "暗黑夜宴": [
    "主視覺模式：暗黑夜宴電影主視覺，人物位於絲絨寢宮、燭光長廊或哥德夜宴空間中心，不走安靜寫實",
    "保留成熟暗黑浪漫氣質、危險感、柔和皮膚反光、紫黑酒紅絲綢、動態外袍與女王式銀幕存在感",
  ],
  "商業奇幻海報": [
    "主視覺模式：商業奇幻電影海報，人物是畫面中心，保留高衝擊色彩、動態服裝與電影女主角銀幕存在感",
    "畫面需具有大色塊、大輪廓、前中遠景、群演或建築尺度與可辨識世界觀，不要退成安靜寫實人物照",
  ],
};

const COLOR_INTENSITY_TEXT = {
  "高級艷麗":
    "色彩張力：高級艷麗，使用 ruby red silk、lantern gold、emerald green accent、sapphire blue shadow、amethyst violet atmosphere、champagne gold reflection、wet floor color reflection 與 saturated but realistic cinematic palette",
  "紅金寶石":
    "色彩張力：紅金寶石主調，使用 red-gold lantern glow、ruby red silk、deep garnet velvet、emerald drapery、jewel-tone highlights 與 wet floor color reflection",
  "暗紫酒紅":
    "色彩張力：暗紫酒紅主調，使用 amethyst violet atmosphere、deep wine-red silk、black velvet shadow、warm candle reflection、obsidian jewelry highlight 與 luminous silk sheen",
  "盛唐花宴":
    "色彩張力：盛唐花宴主調，使用 peony crimson、lantern gold、emerald palace drapery、sapphire night shadow、cinnabar red columns、gold dust haze 與 jewel-tone banquet depth",
};

const FABRIC_MOTION_TEXT = {
  "大動態飄紗":
    "布料動態：大動態飄紗，extra-long flowing silk drapery、airborne translucent shawls、cinematic trailing sleeves 與 floating ceremonial ribbons 形成視線導引",
  "中度流動":
    "布料動態：中度流動，披帛、長袖、外袍與裙擺依照角色動作和室內氣流自然延伸，強化輪廓但不壓過真人臉部",
  "靜態垂墜":
    "布料動態：靜態垂墜，重點放在真實布料重量、絲綢反光、裙襬堆疊與高訂戲服結構，不做過度飛散",
};

function buildVisualPriorityText(form = DEFAULT_FORM) {
  const focus =
    form.visualFocus ||
    "主角大型 silhouette、動態布料流線、情緒凝視、紅金或暗紫寶石色光影，以及能讓觀眾第一眼停住的電影主視覺";

  return [
    `電影主視覺導演層：${focus}`,
    "Primary Read 70%：先讓觀眾讀到真人女主角、巨大輪廓、畫面事件與情緒吸引力",
    "Secondary Read 20%：再讀到光影方向、布料運動、色彩衝擊、群演或建築尺度",
    "Tertiary Read 10%：最後才讀到珠寶、刺繡、髮飾與 Layer 工藝細節",
    "不要把所有元素平均塞進畫面；每個細節都必須服務 Primary Read、visual narrative 與 cinematic heroine presence",
  ].join("；");
}

function inferFrameEvent(theme, scene) {
  const text = `${theme} ${scene}`;
  if (/魅魔|魅姬|夜宴|寢宮|絲絨|暗紫|哥德/.test(text)) {
    return "角色剛從絲絨陰影與燭光中轉身看向鏡頭，外袍與薄紗被室內氣流拉開，月光剛好擦過眼神與唇部邊緣，形成危險又高級的 cinematic reveal";
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳/.test(text)) {
    return "角色剛穿過紅金燈籠與花宴人群，披帛在空中展開，燭火與花瓣同時掠過前景，像東方奇幻影集女主角出場的 Hero Shot";
  }
  if (/墮天使|黑羽|黑翼|廢墟|神殿/.test(text)) {
    return "角色剛從破碎聖光、灰燼與黑羽之間抬頭，披風和羽毛被冷風掀起，畫面停在悲傷神性與危險感同時爆發的一瞬間";
  }
  if (/武俠|女俠|劍|江湖|戰場/.test(text)) {
    return "角色剛停步回身，長袖和外袍因動作形成斜向流線，遠景威脅與前景風沙讓畫面像電影衝突前的一格劇照";
  }
  if (/賽博|霓虹|都市|雨夜/.test(text)) {
    return "角色剛從雨夜霓虹反光中靠近鏡頭，外套邊緣和雨滴在光裡形成視線流線，背景招牌與人群被景深壓成電影氛圍";
  }
  return "角色正在經歷一個可被電影攝影機捕捉的事件瞬間：剛轉身、剛走出煙霧、剛抬眼、布料剛被風帶起，讓畫面像 movie still 而不是站姿設定圖";
}

function buildFrameEventText(form = DEFAULT_FORM) {
  const event = form.frameEvent || inferFrameEvent(form.theme, `${form.scene} ${form.sceneEnvironment}`);
  return [
    `畫面事件：${event}`,
    "這不是姿勢說明，而是 visual narrative；畫面必須像電影事件中的一瞬間 movie still，有風、光、布料、粒子、眼神與環境互動共同推動敘事",
    "以 cinematic reveal、emotional tension、dangerous elegance、atmospheric depth、frame narrative 建立主視覺，不要生成靜態角色卡或服裝展示照",
  ].join("；");
}

function buildHeroShotText(form = DEFAULT_FORM) {
  const visualModeText = VISUAL_MODE_TEXT[form.visualMode] || VISUAL_MODE_TEXT[DEFAULT_FORM.visualMode];
  const colorText = COLOR_INTENSITY_TEXT[form.colorIntensity] || COLOR_INTENSITY_TEXT[DEFAULT_FORM.colorIntensity];
  const fabricText = FABRIC_MOTION_TEXT[form.fabricMotion] || FABRIC_MOTION_TEXT[DEFAULT_FORM.fabricMotion];

  return [
    ...visualModeText,
    "主視覺權重：以 commercial fantasy cinema key visual / Hero Shot 建立畫面",
    "真人角色必須是畫面能量中心，具 emotionally magnetic screen presence、commanding feminine aura、dominant cinematic silhouette 與 queen-like cinematic charisma",
    buildVisualPriorityText(form),
    buildFrameEventText(form),
    colorText,
    "色彩必須具高級艷麗視覺衝擊，使用 vivid luxury color grading、rich cinematic color contrast、jewel-tone highlights、red-gold lantern glow、luminous silk sheen 與 saturated but realistic cinematic palette",
    fabricText,
    "服裝布料需參與構圖運動，使用 extra-long flowing silk drapery、airborne translucent shawls、cinematic trailing sleeves、floating ceremonial ribbons 與 movement-driven fabric silhouette 形成視線導引",
    "場景可加入宴會群演、侍女、樂師、紅金燈籠、寶石色帷幕、花瓣、燭火與遠景人群輪廓，讓世界規模感與艷麗色彩服務主角，而不是讓主角退成設定卡",
    "明確排除安靜寫實路線：不要灰藍低飽和、不要文藝紀錄片、不要安靜端坐資料卡、不要像普通古裝旅拍",
    "創作自由：服裝與場景只提供方向，不是逐項填表；AI 必須像電影美術指導與攝影導演一樣重新組織構圖、光線、色彩、事件與視線流向",
    "允許紅金華麗、寶石色高光、濃烈宮燈、絲綢反射、濕亮地面色彩倒影與高級商業奇幻電影色彩；避免螢光色、塑膠 HDR 與假濾鏡",
    "保留真人身份與真實骨架，同時保留電影女主角魅力、情緒張力與高級商業奇幻攝影感",
  ].join("；");
}

function buildScene(scene, form = DEFAULT_FORM) {
  return `${scene}；${buildHeroShotText(form)}；AI 必須主動電影化擴寫空間細節，不可只重複使用者輸入。場景需包含真實攝影機可拍攝的近景 / 中景 / 遠景：近景提供空氣遮擋與鏡頭層次，中景放置真人角色、動作與服裝動態，遠景建立世界觀建築、天光、地形或人群輪廓。場景還需包含角色情緒動作、真實環境互動、空氣透視、電影美術置景感、景深分離與可理解的世界觀細節。`;
}

function buildSceneInput(form, theme) {
  const baseScene =
    form.scene ||
    `依據「${theme}」建立電影場景，包含近景 / 中景 / 遠景、環境、燈光、角色情緒動作、構圖、空氣感與電影攝影描述，但不要重複服裝與妝容`;
  const segments = [
    baseScene,
    form.sceneEnvironment ? `環境：${form.sceneEnvironment}` : "",
    form.sceneAction ? `動作：${form.sceneAction}` : "",
    `鏡頭：${form.sceneCamera || buildCameraFramingText(form.cameraFraming)}`,
    form.sceneLighting ? `光影：${form.sceneLighting}` : "",
  ].filter(Boolean);

  return segments.join("；");
}

export function expandSceneToDirectorFields(input = {}) {
  const form = normalizeForm(input);
  const scene = form.scene || `依據「${form.theme || "本次主題"}」建立電影場景`;
  const theme = form.theme || "本次主題";

  return {
    ...form,
    sceneEnvironment:
      form.sceneEnvironment ||
      `${scene}，近景加入可被鏡頭拍到的遮擋元素、花瓣、紅金燈籠、燭火、飄紗、寶石色布景、濕亮地面色彩倒影與空氣粒子，中景放置真人角色作為畫面能量中心與 Primary Read，遠景建立建築、宴會群演、侍女、樂師、天光或人群輪廓，形成艷麗商業奇幻電影主視覺與真實空間深度`,
    sceneAction:
      form.sceneAction ||
      `${inferEmotionalAction(theme, scene)}；${inferFrameEvent(theme, scene)}；肩頸放鬆，手部不遮臉，臉部完整可見，角色具主角 aura 與銀幕存在感，服裝布料跟隨動作形成 airborne translucent shawls、cinematic trailing sleeves 與視線導引流線`,
    sceneCamera: `${buildCameraFramingText(form.cameraFraming)}，鏡頭高度接近眼平`,
    sceneLighting:
      form.sceneLighting ||
      "真實光源邏輯，側前方柔和主光、紅金燈籠光、暗紫或祖母綠環境反射、寶石藍陰影、絲綢高光與柔和邊緣分離光分層，面部清楚可見，空氣霧化，自然景深、髮絲細節、濕亮地面色彩倒影與可見空氣透視",
  };
}

export function buildPrompt(input = {}) {
  const form = normalizeForm(input);
  if (!form.theme) {
    throw new Error("主題為必填欄位");
  }

  const theme = form.theme;
  const scene = buildSceneInput(form, theme);
  const costume = buildCostumeLayerText(form, theme);
  const makeup =
    form.makeup ||
    `配合「${theme}」人物角色的電影級藝人妝容，只限表面妝容、真實電影妝感、中性神態，不改變骨相、不改變五官比例、不重塑真人身份`;
  const category = form.category || inferCategory(theme, costume, scene);
  const bodyPresence = buildDarkRoyalBodyPresenceText(form, category);
  const sceneText = bodyPresence ? `${scene}；${bodyPresence}` : scene;

  return [
    "【輸出格式】",
    "",
    `分類：${category}`,
    "",
    `主題：${theme}`,
    "",
    `服裝：${costume}`,
    "",
    `妝容：${makeup}`,
    "",
    `場景：${buildScene(sceneText, form)}`,
  ].join("\n");
}

export function buildChatGptInstruction(input = {}) {
  const prompt = buildPrompt(input);
  const fixedCore = getFixedCorePrompt();
  const { outputStart, nextStart } = findAfterOutputFormatSection(fixedCore);

  if (outputStart === -1 || nextStart === -1 || nextStart <= outputStart) {
    return [fixedCore, "", prompt].join("\n");
  }

  return [
    fixedCore.slice(0, outputStart).trimEnd(),
    prompt,
    fixedCore.slice(nextStart).trimStart(),
  ].join("\n\n");
}

export function estimatePromptHealth(prompt) {
  const checks = [
    ["identity", /真人|real uploaded face identity|原始身份/.test(prompt)],
    ["coreRule", /真人演員被拍進奇幻世界/.test(prompt)],
    ["lens", /50mm|70mm|35mm/.test(prompt)],
    ["theme", /主題：\S/.test(prompt)],
    ["category", /分類：\S/.test(prompt)],
    ["costume", /服裝：\S/.test(prompt)],
    ["makeup", /妝容：\S/.test(prompt)],
    ["scene", /場景：\S/.test(prompt)],
  ];

  const passed = checks.filter(([, ok]) => ok).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    missing: checks.filter(([, ok]) => !ok).map(([name]) => name),
  };
}
