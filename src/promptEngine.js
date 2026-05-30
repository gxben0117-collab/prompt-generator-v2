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
  ratio: "4:5",
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
  cupSize: "正常比例",
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
  const normalizedCupSize = form.cupSize === "預設" ? DEFAULT_FORM.cupSize : sanitizeInput(form.cupSize) || DEFAULT_FORM.cupSize;

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
    cupSize: normalizedCupSize,
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
    value: stabilizeFaceAngleText(form[layer.id]),
  })).filter((layer) => layer.value);

  const keyLayers = [1, 3, 4, 6, 8]
    .map((index) => filledLayers.find((layer) => layer.index === index))
    .filter(Boolean)
    .slice(0, 4);
  const layerSummary = keyLayers.map((layer) => `L${layer.index}: ${layer.value}`).join("；");
  return [
    stabilizeFaceAngleText(form.costume) || `依據「${theme}」建立電影級可穿戴戲服`,
    layerSummary ? `服裝 Layer 參考：${layerSummary}` : "",
    "服裝主視覺集中在主輪廓、主材質、主色彩與一到兩個記憶點，Layer 細節自然融入高訂戲服而不搶畫面焦點。",
    "絲綢、薄紗、披帛、珠寶或羽飾共同服務 dominant cinematic silhouette、visual flow 與角色銀幕存在感。",
    "真實布料重量、真實縫製、電影高訂質感，整體呈現真人演員可穿戴的 cinematic couture costume。",
  ]
    .filter(Boolean)
    .join(" ");
}

export function getHiddenSystemPrompt() {
  return CORE_SPEC_TEXT;
}

function inferCategory(theme, costume, scene) {
  const text = `${theme} ${costume} ${scene}`;
  if (/魅魔|魅姬|睡袍式|絲絨寢宮|暗黑浪漫/.test(text)) return "夜宴魅魔／高訂睡袍電影";
  if (/惡魔|哥德|女王|暗夜/.test(text)) return "奇幻異世界 / 暗黑王族";
  if (/唐|漢代|宋代|明代|清宮|清朝|飛天|敦煌|長安|大周|故宮|宮廷/.test(text)) return "中國朝代古裝 / 中國神話";
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
  const explicitCupSize = compactText(form.cupSize, 12);
  const cupControlText = ["D", "F", "K"].includes(explicitCupSize)
    ? `若角色卡罩杯欄位指定為 "${explicitCupSize}"，則只把它當成胸腔厚度與自然胸型量感的生成參考，允許胸部份量隨罩杯調整，但不可變成誇張爆乳、情色內衣視覺或不合理骨架`
    : "若未指定 D / F / K 罩杯值，則維持角色卡預設胸型量感與自然胸腔厚度";

  return [
    "暗黑王族身形安全：胸部與身形只允許依照上傳真人原始體型自然延伸",
    "罩杯只依角色卡欄位寫入，不額外放大胸腰比例、不製造 pin-up 坐姿，不讓腿部或胸腰成為主視覺",
    cupControlText,
    "服裝改採魅魔夜宴高訂睡袍系衣櫥，於紫晶黑、酒紅、月銀紫、煙玫瑰或黑羽色之間變化，主體可為貼身真絲內搭、半透紗質外罩、珠鏈肩披、垂墜披紗或開線裙片，保留可穿戴與電影級成熟誘惑感，避免一律厚重長袍包覆",
    "保留真實胸腔厚度、肩頸連接、正常腰臀比例、自然重力與高訂禮服布料張力",
    "視覺焦點集中在原始真人臉、暗黑王族氣場、絲絨高光、禮服輪廓與電影女王銀幕存在感",
  ].join("；");
}

function faceMasterControlText() {
  return [
    "臉部主控：以上傳照片中的臉部作為唯一身份來源",
    "先鎖定原始真人臉，再讓身體、服裝、姿勢、髮型、妝容、光影與場景配合這張臉",
    "髮型只能微調，不改髮際線、臉型輪廓或真人身份",
    "不可重畫、美化或換成古裝女主角臉；保留原始臉型、眼距、眼型、眼皮結構、鼻翼寬度、嘴唇形狀、下顎線、臉頰肉感、成熟年齡感、自然不對稱與皮膚質感",
    "臉部角度保持接近原圖，正面或微側正面，雙眼清楚看向鏡頭",
    "身體姿勢、肩頸與頭部角度配合臉部，避免脖子扭曲、頭身錯位",
    "若動作、髮型、妝容、光影或構圖會降低相似度或造成詭異姿勢，放棄該元素",
    "負面鎖臉：face swap、different face、new actress face、altered jawline、altered eyes、altered nose、altered lips、side profile、covered face",
  ].join("；");
}

function stabilizeFaceAngleText(text = "") {
  return String(text)
    .replace(/gentle over-shoulder gaze/gi, "front-facing or slight three-quarter direct gaze")
    .replace(/over-shoulder gaze/gi, "front-facing or slight three-quarter direct gaze")
    .replace(/over-shoulder face redesign/gi, "front-facing preserved-identity gaze")
    .replace(/over-shoulder/gi, "front-facing")
    .replace(/背身回望/g, "正面或微側正面凝視鏡頭")
    .replace(/肩背回眸/g, "微側正面凝視鏡頭")
    .replace(/身體微側回眸/g, "身體微側但臉部正向鏡頭")
    .replace(/側身回眸/g, "微側正面凝視鏡頭")
    .replace(/轉身回眸/g, "正面或微側正面停步凝視鏡頭")
    .replace(/回眸一笑/g, "正面或微側正面自然凝視")
    .replace(/微笑回眸/g, "微笑正向鏡頭")
    .replace(/微微回眸/g, "微側正面凝視鏡頭")
    .replace(/回眸凝視鏡頭/g, "正面或微側正面凝視鏡頭")
    .replace(/回眸直視鏡頭/g, "正面或微側正面直視鏡頭")
    .replace(/頭部微回望鏡頭/g, "頭部自然正向鏡頭")
    .replace(/自然回望鏡頭/g, "自然正向鏡頭")
    .replace(/停步回望/g, "停步正面或微側正面凝視")
    .replace(/側身回望/g, "微側正面凝視")
    .replace(/回身/g, "停步微側正面")
    .replace(/回眸/g, "微側正面凝視")
    .replace(/回望/g, "正向凝視")
    .replace(/側臉/g, "微側正面")
    .replace(/低頭|仰頭/g, "頭部自然端正");
}

function inferEmotionalAction(theme, scene) {
  const text = `${theme} ${scene}`;
  if (isDarkBanquetTheme(theme, scene)) {
    return "夜宴魅姬式電影動作必須配合本次主題、角色身份與情節自由設計，可在倚坐、側躺、扶椅背、斜倚王座、由臥榻起身、半蹲停拍或緩步逼近之間選擇；臉部角度接近上傳照片，正面或三分之一微側正面看向鏡頭，雙手依劇情自然整理珠鏈、撩起薄紗、扶住座椅邊緣、收住披紗或與本場景道具互動，肩頸放鬆、胸腔厚度與骨盆受力穩定、臉部完整清楚";
  }
  if (/女王|哥德|暗夜|王座|魔后|血族|冥界/.test(text)) {
    return "女王式電影動作依角色權力關係與當下情節設計，可端坐王座前緣、倚坐扶手、踏階逼近或緩步前行；臉部穩定朝向鏡頭，雙手可牽起外袍、扶住符合主題的權力象徵物、控制布料流向或自然垂落，肩線、胸腔、骨盆與支撐點穩定，眼神具有壓迫感與情緒吸引力";
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳|樂姬|舞姬/.test(text)) {
    return "盛唐或宮廷人物動作依分類、角色身份與情節設計，可是入場、停步、轉肩、扶欄、臨案、舞步收勢或與本場景器物互動；手部、披帛、長袖與步伐共同服務鏡頭敘事，長裙與飄帶形成視線流線，臉部完整面向鏡頭";
  }
  if (/飛天|仙|瑤池|雲海|神族|聖女|月白/.test(text)) {
    return "清冷神性的正面或微側正面停步，臉部穩定朝向鏡頭，單手輕抬引動長袖與披帛，另一手自然靠近腰側或道具，脊椎挺直但不僵硬，衣料在高空風或神域氣流中形成柔和弧線";
  }
  if (/武俠|女俠|江湖|邊關|劍/.test(text)) {
    return "江湖女俠以三分之一微側但臉部正向鏡頭的姿態停步，前腳穩定踩地，手部自然靠近腰帶、劍鞘或披風邊緣，長袍受風形成斜向流線，眼神越過鏡頭看向遠方威脅";
  }
  if (/賽博|霓虹|都市|特工|雨夜/.test(text)) {
    return "雨夜任務式緩慢前行，肩頸放鬆但目光專注，單手輕觸外套邊緣或耳側通訊裝置，另一手自然垂落，濕地反光與外套下擺跟隨步伐形成動態線條";
  }
  return "帶有角色情緒的自然電影動作，角色在緩慢行走、正面或微側正面停步、穩定抬眼凝視或觸碰場景道具的瞬間被拍下，手部與布料互動自然，臉部完整清楚，動作來自角色故事";
}

const FIXED_CAMERA_TEXT = "50mm 全片幅中遠景電影構圖，人物完整入鏡，真實人像拍攝距離，近景 / 中景 / 遠景分層清楚";

function buildCameraFramingText(cameraFraming = DEFAULT_FORM.cameraFraming) {
  return `${FIXED_CAMERA_TEXT}，人物構圖：${cameraFraming}`;
}

const RATIO_COMPOSITION_TEXT = {
  "9:16": "9:16 cinematic mobile wallpaper，直式手機海報構圖，full-body preserved inside frame",
  "4:5": "4:5 premium commercial fantasy poster，商業奇幻肖像海報構圖，人物與服裝比例最平衡",
  "3:4": "3:4 vertical cinematic portrait，直式電影肖像構圖，保留上半身到全身空間",
  "2:3": "2:3 classic vertical movie poster，經典直式電影海報構圖",
  "14.8:21": "14.8:21 vertical A5 poster，直式 A5 海報構圖，保留真人比例與完整電影輪廓",
  "21:29": "21:29 vertical A4 poster，直式 A4 海報構圖，保留真人比例與完整電影輪廓",
  "25:35": "25:35 vertical European 8K poster，直式歐 8K 海報構圖，保留真人比例與完整電影輪廓",
  "1:1": "1:1 square poster composition，方形主視覺構圖，避免自動特寫",
  "16:9": "16:9 epic cinematic frame，橫式電影場景構圖，保留環境尺度與人物全身輪廓",
  "2.39:1": "2.39:1 anamorphic movie frame，寬銀幕電影畫幅，強調場景史詩感與空間層次",
  "3:2": "3:2 cinematic photography frame，電影攝影橫幅構圖",
  "4:3": "4:3 classic cinematic frame，經典電影畫幅構圖",
};

function buildAspectRatioControlText(form = DEFAULT_FORM) {
  const effectiveRatio = form.ratio;
  const ratioText = RATIO_COMPOSITION_TEXT[effectiveRatio] || RATIO_COMPOSITION_TEXT[DEFAULT_FORM.ratio];
  return [
    `輸出比例控制：${ratioText}`,
    effectiveRatio === "4:5" ? "4:5 character-dominant cinematic composition，人物動作、道具互動與場景調度依分類、主題、角色身份與情節自由設計；保留真人身體比例、臉部可辨識與電影主輪廓" : "",
    "composition must respect the specified aspect ratio and keep the full cinematic silhouette inside frame",
    "避免裁頭、裁手、截斷全身、AI 自動特寫或自拍式構圖",
  ].filter(Boolean).join("；");
}

function effectiveOutputRatio(form = DEFAULT_FORM) {
  return form.ratio;
}

function compactText(value = "", maxLength = 150) {
  const text = String(value || "")
    .replace(/【[^】]+】/g, "")
    .replace(/\s+/g, " ")
    .replace(/；+/g, "；")
    .trim();
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const punctuationIndex = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("；"), cut.lastIndexOf("，"));
  return `${cut.slice(0, punctuationIndex > 45 ? punctuationIndex : maxLength).trim()}。`;
}

function trimSentenceEnding(value = "") {
  return String(value || "").replace(/[。；，、\s]+$/g, "");
}

function compactLayerValue(value = "") {
  return compactText(value, 42)
    .replace(/作為.*$/g, "")
    .replace(/使用.*$/g, "")
    .replace(/，$/g, "")
    .trim();
}

function buildCupSizeSkeletonText(form = DEFAULT_FORM, category = "", theme = "") {
  const cupSize = compactText(form.cupSize, 12);
  if (!cupSize) return "";
  if (isDarkRoyalCategory(category, theme, form.scene) && ["D", "F", "K"].includes(cupSize)) {
    return `、罩杯 "${cupSize}" 對應的自然胸型量感`;
  }
  return `、罩杯 "${cupSize}"`;
}

function buildFinalIdentityText(form = DEFAULT_FORM, category = "", theme = "") {
  return [
    "真人身份鎖定：保留上傳照片原始臉型、眼型、鼻型、嘴型、下顎線、五官比例、成熟年齡感、自然不對稱與真實皮膚紋理；不換臉、不生成新演員臉、不美化成 AI 美女或網紅臉。髮型與髮飾可配合角色微調，但不得改變臉型、髮際線與真人辨識度。",
    `真實人體骨架：平衡肩寬、鎖骨、胸腔厚度${buildCupSizeSkeletonText(form, category, theme)}、軀幹深度、骨盆比例、四肢比例與人體重心；避免頭大、肩窄、軀幹壓縮、脖子扭曲或 AI 娃娃比例。`,
  ].join("\n");
}

function buildFinalCostumeText(form, category, theme) {
  if (isDarkRoyalCategory(category, theme, form.scene)) {
    return "真人可穿戴的魅魔夜宴高訂睡袍系造型，從紫晶黑真絲內搭、酒紅薄紗罩裙、月銀紫珠鏈肩披、煙玫瑰垂墜披紗、黑羽色半透外罩與蝴蝶或黑羽刺繡中隨機組合；重點是貼身內搭、半透紗層、珠鏈流光、開線裙片與成熟電影誘惑感，不固定為全包式厚重長袍，也不額外放大胸腰比例。";
  }

  const layerText = [form.costumeLayer1, form.costumeLayer3, form.costumeLayer4, form.costumeLayer6, form.costumeLayer8]
    .map(compactLayerValue)
    .filter(Boolean)
    .slice(0, 4)
    .join("，");
  const base = compactText(form.costume, 130) || `真人可穿戴的「${theme}」電影級高訂戲服`;
  const detail = layerText ? `主要元素：${layerText}。` : "";

  return `${base}。${detail}重點是主輪廓、主材質、主色彩與一到兩個記憶點，真實布料重量、可穿戴結構與電影高訂質感。`;
}

function buildFinalSceneText(form, category, theme) {
  const sceneBase = compactText(form.scene, 120) || `依據「${theme}」建立可被真實攝影拍出的奇幻電影場景`;
  const directorLens = "請依主題、角色身份與情節重新設計背景近景 / 中景 / 遠景：近景做壓鏡與視線引導，中景承接角色動作，遠景建立空間尺度、光源方向、特效與氛圍；不要照抄角色卡近中遠原句";
  if (isDarkRoyalCategory(category, theme, sceneBase)) {
    return `${sceneBase}。${directorLens}，可加入符合主題的燭光、建築輪廓、帷幕、反光、古器、粒子或景深。背景不得出現路人或群演。`;
  }
  return `${sceneBase}。${directorLens}；場景道具、特效與氛圍都服務本次角色和故事。背景不得出現路人。`;
}

function buildFinalActionText(form, category, theme) {
  const action = trimSentenceEnding(compactText(stabilizeFaceAngleText(form.sceneAction), 145));
  const directorAction = "ChatGPT 需依場所、角色身份與情節設計不呆站的姿勢，可調整為踏階、旋身、扶欄、持物、倚坐、臨案或其他符合主題的支撐點動作";
  const safety = "姿態安全：鎖臉與正常身體比例優先，臉部正面或微側正面清楚可辨識；手部、披帛與道具不得遮五官；肩頸、頭部、脊椎、骨盆與四肢受力合理，避免詭異肢體";
  if (action) return `${action}。${directorAction}。${safety}。`;
  return `${trimSentenceEnding(compactText(inferEmotionalAction(theme, form.scene), 120))}。${directorAction}。${safety}。`;
}

function buildFinalLightingText(form, category, theme) {
  const lighting = compactText(form.sceneLighting, 150);
  const commercial = shouldUseCommercialGlamourLighting({ ...form, category, theme });
  const dreamyRadiant = isDreamyRadiantPosterTheme(`${category} ${theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`);
  const brightCostumePoster = form.visualMode === "高亮商業古裝海報";
  const base =
    lighting ||
    (dreamyRadiant || brightCostumePoster
      ? "高亮主角柔光、正面 beauty fill、柔和邊緣分離光、半透明 bloom、抬升暗部、通透空氣透視、冷暖混合發光層次、自然景深與真實皮膚反光。"
      : "側前方柔和主光、燭光或月光環境光、柔和邊緣分離光、自然景深、空氣霧化與真實皮膚反光。");
  if (brightCostumePoster) {
    return `${base} 圖二亮麗版風格：臉部明亮清晰且保留真人皮膚紋理，眼睛有自然 catchlight；珠寶、金屬、燈籠、水面反光、絲綢、薄紗與披帛都有明顯 sparkle highlights；色彩飽和但真實，粉、金、青綠與寶石藍形成夢幻通透層次；陰影抬升不厚重，避免灰暗低光、塑膠 HDR 與 AI 美女換臉感。`;
  }
  if (commercial) {
    return dreamyRadiant
      ? `${base} 臉部明亮且保留真人皮膚紋理，眼睛有自然 catchlight；絲綢、珠寶、薄紗與場景高光呈現 sparkle highlights，畫面夢幻通透但保持真實攝影質感。`
      : `${base} 臉部明亮可辨識，眼睛有自然 catchlight，珠寶與服裝保留細膩高光，避免過暗、過度 HDR 與塑膠皮膚。`;
  }
  return dreamyRadiant
    ? `${base} 臉部清楚可辨識，保留皮膚紋理、髮絲細節、真實空氣透視、柔亮 bloom 與電影攝影感。`
    : `${base} 臉部清楚可辨識，保留皮膚紋理、髮絲細節、真實空氣透視與電影攝影感。`;
}

function buildFinalNegativeText() {
  return "負面：AI beauty face, influencer face, doll face, anime face, cgi heroine face, anime body, tiny waist, extreme hourglass, selfie angle, plastic skin, cheap cosplay, game skin outfit, pin-up pose, twisted anatomy, face swap, new actress face, side profile, covered face, face underexposure, oversized head, compressed torso, narrow shoulders, over HDR, unreal engine render.";
}

function buildFinalStyleText(form, category, theme) {
  const visualModeText = {
    "Netflix 東方奇幻": "真人身份保留的東方奇幻電影主視覺",
    "高亮商業古裝海報": "高亮商業古裝電影海報，圖二亮麗版風格，臉部、珠寶、絲綢、薄紗與燈火都是第一眼亮點",
    "暗黑夜宴": "暗黑夜宴電影主視覺",
    "商業奇幻海報": "高級商業奇幻電影海報",
  }[form.visualMode] || "真人電影級奇幻主視覺";
  const colorText = {
    "高級艷麗": "高級艷麗，saturated but realistic cinematic palette，寶石色高光與絲綢反射",
    "紅金寶石": "紅金寶石，ruby red silk、lantern gold、jewel-tone highlights",
    "暗紫酒紅": "暗紫酒紅，amethyst violet atmosphere、deep wine-red silk、black velvet shadow",
    "盛唐花宴": "盛唐花宴，peony crimson、lantern gold、emerald palace drapery",
  }[form.colorIntensity] || "高級電影色彩";
  const fabricText = {
    "大動態飄紗": "大動態飄紗，extra-long flowing silk drapery、airborne translucent shawls",
    "中度流動": "中度流動，披帛、長袖與外袍依照動作自然延伸",
    "靜態垂墜": "靜態垂墜，重點是真實布料重量與高訂結構",
  }[form.fabricMotion] || "真實布料動態";
  const commercial = shouldUseCommercialGlamourLighting({ ...form, category, theme })
    ? "高亮商業奇幻曝光，臉亮、珠寶亮、避免灰暗低光。"
    : "真人電影級奇幻主視覺，華麗但保持真實攝影可存在性。";
  return [visualModeText, colorText, fabricText, commercial].join("；");
}

function buildFinalCompositionText(form, ratio) {
  const ratioText = RATIO_COMPOSITION_TEXT[ratio] || RATIO_COMPOSITION_TEXT[DEFAULT_FORM.ratio];
  return [
    `50mm 全片幅，中遠景，${ratioText}`,
    `單人主角，${form.cameraFraming || DEFAULT_FORM.cameraFraming}完整入鏡`,
    "composition must respect the specified aspect ratio and keep the full cinematic silhouette inside frame",
    "不裁頭、不裁手、不自拍感",
  ].join("，");
}

function buildFinalMakeupText(form) {
  const makeup = compactText(form.makeup, 110);
  const base = makeup || "成熟真人電影妝感，保留自然皮膚紋理、原始五官比例與真實年齡感。";
  return `${base} 妝容只影響色彩、質地與光澤，不重塑五官或臉型。`;
}

function buildBodyProportionStabilizationText(form = DEFAULT_FORM) {
  const postureText = /坐|端坐|坐姿|王座|椅|榻|跪|半跪|臥|躺|倚|靠|泡茶|撫琴/.test(`${form.scene} ${form.sceneEnvironment} ${form.sceneAction}`)
    ? "坐姿、臥姿、跪坐、倚靠或情節道具互動姿勢必須保留完整胸腔厚度、軀幹深度、成人骨盆受力與四肢支撐邏輯，camera distance must not compress body structure"
    : "站姿、行走或主題動作都必須保留自然肩寬、軀幹深度、骨盆比例、四肢長度與成人重心";
  return [
    "真人比例穩定：full-body physical coherence has equal priority with facial identity preservation",
    "鎖臉不得造成 oversized head、compressed torso、narrow AI shoulders、portrait-only body structure 或 floating head feeling",
    "保留 balanced head size、natural shoulder-to-head ratio、realistic torso volume",
    "姿勢配合臉部與頭部角度，肩頸、脊椎、骨盆和四肢受力自然",
    postureText,
    "真人必須 physically existing inside cinematic space，不像 face pasted onto a fantasy costume",
  ].join("；");
}

function allowsBackgroundCharacters(text = "") {
  return /宮廷宴會|王朝典禮|宗教儀式|戰場|戰爭|軍勢|軍隊|市集|街市|朝會|祭儀|大型典禮/.test(text);
}

function isChineseDynastyOrnateTheme(text = "") {
  return /中國朝代古裝|中國歷代服裝|唐|漢代|漢朝|宋代|宋朝|明代|明朝|清宮|清朝|長安|盛唐|宮廷|花宴|花朝|貴妃|公主|皇后|樂姬|舞姬|宮妃|帝姬|郡主|王姬|故宮|王朝|鳳儀|夜宴樂姬/.test(
    text,
  );
}

function isDreamyRadiantPosterTheme(text = "") {
  return /高亮商業古裝海報|圖二亮麗版|歷史小說名著人物|中國歷代服裝|武俠江湖|戰場女將|仙俠神話|古裝陸劇|東方異域|絲路西域|奇幻異世界|暗黑王族|西方古典|歐陸史詩|花園童話|自然精靈|盛唐|宮廷|花宴|長安|月宮|雲海|仙俠|仙門|神殿|精靈|童話|史詩|絲路|西域|武俠|女俠|王族|王后|公主|皇后|貴妃|樂姬/.test(
    text,
  );
}

function globalPosterDensityText() {
  return "Global visual target: high-density bright ornate cinematic poster；foreground, midground and background all carry meaningful world-building detail；avoid empty space, sparse staging, flat catalog pose and dull background treatment";
}

function backgroundControlText(form = DEFAULT_FORM) {
  const text = `${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.frameEvent}`;
  if (allowsBackgroundCharacters(text)) {
    return "背景角色控制：主題允許少量 small-scale cinematic silhouettes、侍從剪影或遠景軍勢輪廓；所有次要輪廓必須縮小、模糊、低存在感；主角仍佔 absolute visual priority";
  }
  if (isChineseDynastyOrnateTheme(text)) {
    return "背景角色控制：預設單女主華麗古裝海報構圖，背景必須服務角色且不可壓過主角；前景、中景、遠景都要有有效細節，以花枝、宮燈、珠簾、屏風、披帛、欄杆、殿閣與景深填滿畫面，避免留白、極簡場景、低密度背景，主角佔 absolute visual priority";
  }
  return "背景角色控制：預設單女主華麗電影海報構圖，畫面只保留真人主角；背景必須服務角色，前景、中景、遠景都要依分類、主題、角色身份與場景重新設計，不套用固定素材清單；以本次故事需要的鏡頭遮擋、空間尺度、光源方向、景深層次與場景敘事建立高密度電影感，主角佔 absolute visual priority";
}

function shouldUseCommercialGlamourLighting(form = DEFAULT_FORM) {
  return /夜宴|魅魔|魅姬|月夜|女王|魔后|紫晶|星月|黑玫瑰|暗黑王族|商業奇幻|高級女性|滿月|骸骨權杖/.test(
    `${form.category} ${form.theme} ${form.scene} ${form.visualMode}`,
  ) ||
    isChineseDynastyOrnateTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`) ||
    isDreamyRadiantPosterTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`);
}

function commercialGlamourLightingText(form = DEFAULT_FORM) {
  if (!shouldUseCommercialGlamourLighting(form)) return "";
  if (form.visualMode === "高亮商業古裝海報") {
    return "高亮商業古裝海報：圖二亮麗版 commercial costume poster lighting、bright beauty exposure、translucent bloom、lifted shadows；臉部明亮清晰且有自然 catchlight，珠寶、金屬、燈籠、水面反光、絲綢、薄紗與披帛都有 sparkle highlights；色彩 saturated but realistic，畫面夢幻通透，避免灰暗低光、厚重陰影、塑膠 HDR 與 AI beauty face";
  }
  if (isDreamyRadiantPosterTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`)) {
    return "商業奇幻亮場：dreamy radiant fantasy poster lighting、bright beauty exposure、translucent bloom、lifted cinematic shadows；臉部穩定明亮，眼睛、珠寶、薄紗與花材有柔亮層次，避免 grim dark fantasy、muddy low exposure、大片黑影";
  }
  if (isChineseDynastyOrnateTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`)) {
    return "商業奇幻亮場：bright commercial fantasy lighting、high-key ornate Chinese poster exposure、luminous jewel-tone atmosphere；臉部明亮可辨識，珠寶、金飾、絲綢與宮燈有發光層次，避免 grim dark fantasy、muddy low exposure";
  }
  return "商業奇幻亮場：luminous fantasy glamour lighting、commercial fantasy beauty exposure、bright hero lighting；臉部明亮可辨識，眼睛有 catchlight，珠寶、金屬、絲綢、皮革或場景高光都要有 sparkle highlights，避免 grim dark fantasy、muddy black shadows、face underexposure";
}

const VISUAL_MODE_TEXT = {
  "Netflix 東方奇幻": [
    "主視覺模式：真人身份保留的東方奇幻電影主視覺，真實上傳人物位於影集海報中心但不重塑五官",
    "主角權重最高，畫面第一眼先看到原始真人臉部辨識度、大輪廓、飛舞披帛、紅金寶石色、燈籠光影、建築景深與視覺流線",
    "必須具備 single-protagonist cinematic composition、solo heroine visual dominance、isolated cinematic focus 與 environmental atmosphere around one protagonist",
  ],
  "高亮商業古裝海報": [
    "主視覺模式：高亮商業古裝海報，圖二亮麗版風格，人物採近中景到膝蓋以上的華麗電影主視覺權重，臉部、眼神、珠寶、絲綢與燈火是第一眼焦點",
    "畫面要有 bright commercial costume poster、high-key fantasy beauty exposure、saturated but realistic cinematic palette、translucent bloom、lifted shadows、sparkle highlights 與夢幻通透空氣感",
    "近景可由宮燈、花枝、飄紗、團扇、樂器、茶席或水面反光形成壓鏡，中景保留真人臉部與上半身珠寶細節，遠景以拱橋、亭台、水面燈影或建築 bokeh 建立層次；不可犧牲真人身份鎖定",
  ],
  "暗黑夜宴": [
    "主視覺模式：暗黑夜宴電影主視覺，人物位於絲絨寢宮、燭光長廊或哥德夜宴空間中心",
    "保留成熟暗黑浪漫氣質、危險感、柔和皮膚反光、紫黑酒紅絲綢、動態外袍與女王式銀幕存在感",
  ],
  "商業奇幻海報": [
    "主視覺模式：商業奇幻電影海報，人物是畫面中心，保留高衝擊色彩、動態服裝與電影女主角銀幕存在感",
    "畫面具有大色塊、大輪廓、前中遠景、建築尺度、光影空氣與可辨識世界觀，預設以建築、燈火與空氣撐場",
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

function isDarkBanquetTheme(theme = "", scene = "") {
  return /魅魔|魅姬|寢宮|絲絨|暗紫|哥德|黑玫瑰|黑曜|暗黑夜宴/.test(`${theme} ${scene}`);
}

function actionStagingBiasText(form = DEFAULT_FORM) {
  const text = `${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment}`;
  if (isDarkBanquetTheme(form.theme, `${form.scene} ${form.sceneEnvironment}`)) {
    return "避免正中立正；依夜宴角色身份與當下情節選擇王座、臥榻、扶手、薄紗、珠鏈或本場景道具互動";
  }
  if (/女王|哥德|暗夜|王座|魔后|血族|冥界/.test(text)) {
    return "避免閱兵式站姿；依女王權力關係與場景支撐點設計踏階、倚靠、起身、逼近或道具互動";
  }
  if (/飛天|敦煌|伎樂|舞姬|洞窟/.test(text)) {
    return "避免平直站姿；優先舞步停格、手臂弧線、披帛穿鏡與半轉身";
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳/.test(text)) {
    return "避免證件照式站正中；依宮廷身份、宴席情節、舞樂或禮制動作設計踏階、扶欄、臨案、轉肩停步或器物互動";
  }
  if (isChineseDynastyOrnateTheme(text)) {
    return "避免歷史教科書式站姿；依角色身份、情節與場景支撐點自由設計扶欄、倚榻、拂袖、臨案、舞樂、禮儀或器物互動";
  }
  if (/賽博|霓虹|都市|特工|雨夜/.test(text)) {
    return "避免櫥窗模特式站姿；優先走動抓拍、倚窗、扶欄或街角回身";
  }
  return "避免筆直站正中；優先讓手部、欄杆、座椅、台階、道具或布料和場景發生互動";
}

function safePosePriorityText() {
  return "姿態優先規則：鎖臉、五官比例、頭身比例、頭部角度與手部正確優先；ChatGPT 的自由設計範圍是根據分類、主題、角色身份與情節設計場景、道具、姿勢、特效與氣氛，形成可拍攝的電影事件瞬間；所有設計都服務主題和角色，不套用固定清單；只在主題明確需要時才使用杯、扇、瓶、卷、星盤、樂器、花材、寵物或龍等道具，不把單一道具當預設姿勢；避免枯燥筆直站立，若站立也要有情緒、支撐點、手部互動或鏡頭調度；可端坐、側坐、扶椅、倚欄、臨案、踏階、回身、緩步、整理衣袖、扶桌、扶膝或與場景支撐點互動；五官必須完整可辨識；身體姿勢、肩頸方向與頭部角度必須合理銜接，不可詭異扭曲；手、紗、道具不得遮五官，高風險動作降級為持物低於臉部、踏階停步或回身看鏡頭";
}

function buildSceneVisualDetailText(form = DEFAULT_FORM) {
  const text = `${form.theme} ${form.scene} ${form.sceneEnvironment}`;
  if (isDarkBanquetTheme(form.theme, `${form.scene} ${form.sceneEnvironment}`)) {
    return "空間層級補強：夜宴空間、前景壓鏡、角色支撐點、道具、特效與遠景尺度都必須依本次主題、人物權力關係與情節自由設計；近景負責暗黑浪漫視線引導，中景讓真人角色與王座、臥榻、帷幕或本場景核心物件形成權力中心，遠景建立本次夜宴世界的深度與光源敘事";
  }
  if (/飛天|敦煌|伎樂|舞姬|洞窟/.test(text)) {
    return "空間層級補強：飛天、敦煌或神域題材的近景、中景、遠景依舞蹈情節、角色身份與場景儀式重新設計；前景選擇能導引舞姿的元素，中景以真人角色動作與布料流線為核心，遠景建立本次場景的神聖尺度、光源與文化空間深度";
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳/.test(text)) {
    const backgroundScale = allowsBackgroundCharacters(text)
      ? "少量 small-scale cinematic silhouettes、宮燈層次"
      : "單人主角背景層次";
    return `空間層級補強：盛唐或宮廷場景的近景、中景、遠景依分類、主題、角色身份、禮制/宴席/舞樂情節重新設計；前景選擇本場景最有敘事作用的壓鏡元素，中景讓真人角色與場景支撐點或器物自然互動，遠景以${backgroundScale}、空間尺度、光源方向與場景敘事形成商業奇幻電影規模`;
  }
  if (isChineseDynastyOrnateTheme(text)) {
    return "空間層級補強：中國朝代古裝場景的主空間、前景壓鏡、中景互動、遠景尺度都依人物身份、主題情節與場景性質自由設計；道具、特效、花材、器皿、樂器或建築元素只在符合情節時使用，整體維持 foreground、midground、background 全畫面高密度但不雜亂";
  }
  if (isDreamyRadiantPosterTheme(`${form.category} ${text}`) && !isDarkBanquetTheme(form.theme, `${form.scene} ${form.sceneEnvironment}`)) {
    return "空間層級補強：夢幻亮場題材的前景、中景、遠景依分類、主題、角色身份與情節重新設計；前景只選最能支撐本題氛圍的壓鏡或光效，中景讓真人角色與場景主體互動，遠景建立本次世界觀的尺度、空氣感與敘事深度；維持 high-density bright poster composition、亮面人物優先、空氣通透、發光邊緣與夢幻電影層次，避免低照度空景吞沒角色。";
  }
  if (/墮天使|黑羽|黑翼|廢墟|神殿/.test(text)) {
    return "空間層級補強：破碎哥德神殿或黑羽廢墟作為主空間，前景灰燼、羽毛、碎石與冷霧遮擋，中景真人角色被黑羽輪廓與破碎披風包圍，遠景斷裂石柱、月光高窗、殘破拱頂與暗紫聖光形成悲傷神性的 dark fantasy cinema depth";
  }
  if (/賽博|霓虹|都市|雨夜/.test(text)) {
    return "空間層級補強：雨夜霓虹街區作為主空間，前景雨滴、玻璃反光與招牌色塊遮擋，中景真人角色從濕亮地面反射中走近鏡頭，遠景高樓、車燈、霓虹招牌與雨霧光斑壓成淺景深色彩層次";
  }
  if (form.sceneEnvironment) {
    return "空間層級補強：近景、中景、遠景依分類、主題、角色身份與場景重新安排電影鏡頭；近景選擇符合本題的壓鏡或視線引導，中景承接真人角色動作與服裝輪廓，遠景建立本場景特有的空間尺度、光源方向與敘事背景。";
  }
  return "場景以可拍攝的近景、中景、遠景建立電影空間：鏡頭層次必須根據分類、主題、角色身份與場景設計，不固定套用花瓣、燭火、霧氣、布料或建築；近景負責壓鏡與視線導引，中景放置真人角色和事件動作，遠景建立本次世界觀的空間尺度、光源與敘事背景，形成單女主主導的 cinematic atmosphere";
}

function buildActionCinematographyText(form = DEFAULT_FORM) {
  const action = form.sceneAction || inferEmotionalAction(form.theme, `${form.scene} ${form.sceneEnvironment}`);
  if (form.sceneAction) {
    return [
      "動作鏡頭語言補強：承接上方動作，不重複姿勢描述",
      actionStagingBiasText(form),
      safePosePriorityText(),
      "50mm eye-level cinematic blocking，臉部完整可見，眼神是表演核心",
      "肩頸、胸腔、骨盆、四肢支撐點與身體受力符合真實成年人體結構，手部不遮擋臉部",
      "布料、披帛、長袖、外袍或髮絲只作視線導引，不搶臉部辨識度",
    ].join("；");
  }
  return [
    `動作鏡頭語言：${action}`,
    actionStagingBiasText(form),
    safePosePriorityText(),
    "50mm eye-level cinematic blocking，臉部完整可見，眼神是表演核心",
    "肩頸、胸腔、骨盆、四肢支撐點與身體受力符合真實成年人體結構，手部不遮擋臉部",
    "布料、披帛、長袖、外袍或髮絲跟隨動作產生可拍攝的 visual leading lines",
  ].join("；");
}

function buildStyleVisualDetailText(form = DEFAULT_FORM) {
  const visualModeText = VISUAL_MODE_TEXT[form.visualMode] || VISUAL_MODE_TEXT[DEFAULT_FORM.visualMode];
  const colorText = COLOR_INTENSITY_TEXT[form.colorIntensity] || COLOR_INTENSITY_TEXT[DEFAULT_FORM.colorIntensity];
  const fabricText = FABRIC_MOTION_TEXT[form.fabricMotion] || FABRIC_MOTION_TEXT[DEFAULT_FORM.fabricMotion];
  const dreamyRadiant = isDreamyRadiantPosterTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment}`);
  const focus =
    form.visualFocus ||
    (isDarkBanquetTheme(form.theme, `${form.scene} ${form.sceneEnvironment}`)
      ? "女主角的暗紫絲綢輪廓、燭光中的眼神、深酒紅薄紗與絲絨外袍形成第一視覺焦點"
      : "真人女主角的大型 silhouette、動態布料流線、情緒凝視與寶石色光影形成第一視覺焦點");

  const dynastyOrnateText = isChineseDynastyOrnateTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment}`)
    ? [
        "Reference visual target: ultra-luxury Chinese fantasy poster, high-density composition, ornate costume design, rich floral framing, bright commercial fantasy lighting, jewel-tone cinematic palette",
        "Visual Priority System: 40% 真人身份辨識度, 30% 華麗服裝與珠寶, 20% 花卉燈火與前景壓鏡, 10% 建築背景",
      ].join("；")
    : "";

  return [
    visualModeText.join("；"),
    `電影主視覺：${focus}`,
    colorText,
    fabricText,
    globalPosterDensityText(),
    dynastyOrnateText,
    dreamyRadiant
      ? "Dreamy radiant poster target：高亮主角曝光、通透空氣感、柔和 bloom、抬升暗部、臉部亮面優先，避免暖暗低照度電影"
      : "",
    "總控：preserved real-person identity first, recognizable original face, dominant silhouette, vivid jewel-tone grading, luxury fabric sheen",
  ].filter(Boolean).join("；");
}

function inferFrameEvent(theme, scene) {
  const text = `${theme} ${scene}`;
  if (isDarkBanquetTheme(theme, scene)) {
    return "角色剛在王座前緣坐定、由扶手起身或倚著高背椅停住看向鏡頭，外袍與薄紗被室內氣流拉開，月光與燭火同時擦過眼神、鎖骨與手部珠寶，形成危險又高級的 cinematic reveal";
  }
  if (/飛天|敦煌|伎樂|舞姬|洞窟/.test(text)) {
    return "角色剛在洞窟台階間完成一個舞步停格，手臂弧線、披帛與腰胯轉折同時定住，天窗光從上方切進來，讓畫面像被電影攝影機抓住的一瞬";
  }
  if (/唐|長安|盛唐|宮廷|花宴|牡丹|鳳/.test(text)) {
    return "角色剛踏下宮階、扶過欄杆或托著器物停步，披帛在空中展開，燭火與花瓣同時掠過前景，像真人身份被完整保留的東方奇幻影集主視覺出場瞬間";
  }
  if (isChineseDynastyOrnateTheme(text)) {
    return "角色剛在花宴、宮廊、水榭或臥榻之間完成一次扶欄、拂袖、撩紗、托盞、回身落座或抱樂器停拍，前景花枝與宮燈壓住畫面邊緣，珠寶與絲綢在亮場中同步發光，像高密度華麗古裝主視覺被攝影機精準截住的一瞬";
  }
  if (/墮天使|黑羽|黑翼|廢墟|神殿/.test(text)) {
    return "角色剛從破碎聖光、灰燼與黑羽之間正面凝視鏡頭，披風和羽毛被冷風掀起，畫面停在悲傷神性與危險感同時爆發的一瞬間";
  }
  if (/武俠|女俠|劍|江湖|戰場/.test(text)) {
    return "角色剛以正面或微側正面停步，長袖和外袍因動作形成斜向流線，遠景威脅與前景風沙讓畫面像電影衝突前的一格劇照";
  }
  if (/賽博|霓虹|都市|雨夜/.test(text)) {
    return "角色剛從雨夜霓虹反光中靠近鏡頭，外套邊緣和雨滴在光裡形成視線流線，背景招牌、高樓燈火與雨霧被景深壓成電影氛圍";
  }
  return "角色正在經歷一個可被電影攝影機捕捉的事件瞬間：正面或微側正面剛停步、剛坐下泡茶、倚靠欄杆、持扇凝視、持刀收勢、臥於榻上抬眼或剛走出煙霧；眼神穩定看向鏡頭，布料剛被風帶起，讓畫面像 single-protagonist poster frame 而不是單調站姿設定圖";
}

function buildFrameEventText(form = DEFAULT_FORM) {
  const event = form.frameEvent || inferFrameEvent(form.theme, `${form.scene} ${form.sceneEnvironment}`);
  return [
    `畫面事件：${event}`,
    "single-protagonist poster frame，風、光、眼神推動 visual narrative 與 cinematic reveal",
  ].join("；");
}

function buildHeroShotText(form = DEFAULT_FORM) {
  return [
    faceMasterControlText(),
    buildBodyProportionStabilizationText(form),
    buildAspectRatioControlText(form),
    buildStyleVisualDetailText(form),
    backgroundControlText(form),
    commercialGlamourLightingText(form),
    buildFrameEventText(form),
    buildActionCinematographyText(form),
    buildSceneVisualDetailText(form),
    form.sceneLighting
      ? "光影補強：沿用上方光源設定，只強化臉部可辨識、柔和分離光、自然景深與真實空氣透視"
      : "光影總控：側前方柔和主光、燭光或月光環境光、soft edge separation light、volumetric light haze、natural depth of field、realistic air perspective",
  ].filter(Boolean).join("；");
}

function buildScene(scene, form = DEFAULT_FORM) {
  return `${scene}；${buildHeroShotText(form)}`;
}

function buildSceneInput(form, theme) {
  const baseScene =
    form.scene ||
    `依據「${theme}」建立電影場景，包含近景 / 中景 / 遠景、環境、燈光、角色情緒動作、構圖、空氣感與電影攝影描述，但不要重複服裝與妝容`;
  const segments = [
    stabilizeFaceAngleText(baseScene),
    form.sceneEnvironment ? `環境：${stabilizeFaceAngleText(form.sceneEnvironment)}` : "",
    form.sceneAction ? `動作：${stabilizeFaceAngleText(form.sceneAction)}` : "",
    `鏡頭：${form.sceneCamera || buildCameraFramingText(form.cameraFraming)}`,
    form.sceneLighting ? `光影：${stabilizeFaceAngleText(form.sceneLighting)}` : "",
  ].filter(Boolean);

  return segments.join("；");
}

export function expandSceneToDirectorFields(input = {}) {
  const form = normalizeForm(input);
  const scene = form.scene || `依據「${form.theme || "本次主題"}」建立電影場景`;
  const theme = form.theme || "本次主題";
  const dreamyRadiant = isDreamyRadiantPosterTheme(`${form.category} ${form.theme} ${form.scene} ${form.sceneEnvironment} ${form.visualMode}`);

  return {
    ...form,
  sceneEnvironment:
      form.sceneEnvironment
        ? stabilizeFaceAngleText(form.sceneEnvironment)
        :
      dreamyRadiant
        ? `${scene}，近景、中景、遠景依分類、主題、角色身份與情節自由設計；近景選擇最能支撐本題氛圍的壓鏡元素、光效或視線引導，中景放置真人角色作為畫面能量中心與第一視覺焦點，遠景建立本次世界觀的空間尺度、光源方向、空氣感與敘事背景；整體維持高密度亮場海報感、通透空氣感、柔亮 bloom 與亮面人物優先，除非主題明確需要宴會、戰場、市集、宗教儀式或王朝典禮，否則畫面只保留單一真人主角`
        : `${scene}，近景、中景、遠景依分類、主題、角色身份與情節自由設計，不固定套用花瓣、燈籠、燭火、飄紗、建築或水霧；近景負責壓鏡與視線導引，中景放置真人角色作為畫面能量中心與第一視覺焦點，遠景建立本次世界觀的空間尺度、光源方向、特效邏輯與敘事背景；除非主題明確需要宴會、戰場、市集、宗教儀式或王朝典禮，否則畫面只保留單一真人主角，形成單女主艷麗商業奇幻電影主視覺與真實空間深度`,
    sceneAction:
      form.sceneAction
        ? stabilizeFaceAngleText(form.sceneAction)
        :
      `${inferEmotionalAction(theme, scene)}；${inferFrameEvent(theme, scene)}；50mm eye-level cinematic blocking，臉部完整清楚，眼神是表演核心，肩頸、胸腔、骨盆、四肢支撐點與身體受力符合真實成年人體結構，服裝布料跟隨動作形成 airborne translucent shawls、cinematic trailing sleeves 與視線導引流線`,
    sceneCamera: `${buildCameraFramingText(form.cameraFraming)}，鏡頭高度接近眼平`,
    sceneLighting:
      form.sceneLighting ||
      (dreamyRadiant
        ? "真實光源邏輯，高亮主角柔光、正面 beauty fill、柔和邊緣分離光、半透明 bloom、冷暖發光分離、抬升暗部、珠寶與薄紗高光、臉部清楚可見、空氣通透、自然景深、髮絲細節、可見空氣透視與柔亮景物反射"
        : "真實光源邏輯，側前方柔和主光、紅金燈籠光、暗紫或祖母綠環境反射、寶石藍陰影、絲綢高光與柔和邊緣分離光分層，面部清楚可見，空氣霧化，自然景深、髮絲細節、濕亮地面色彩倒影與可見空氣透視"),
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
    stabilizeFaceAngleText(form.makeup) ||
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
  const form = normalizeForm(input);
  if (!form.theme) {
    throw new Error("主題為必填欄位");
  }

  const theme = form.theme;
  const sceneInput = buildSceneInput(form, theme);
  const costumeInput = buildCostumeLayerText(form, theme);
  const category = form.category || inferCategory(theme, costumeInput, sceneInput);
  const ratio = effectiveOutputRatio({ ...form, category });

  return [
    `請根據上傳真人照片生成 ${ratio} 真人電影級奇幻海報。`,
    "",
    buildFinalIdentityText(form, category, theme),
    "",
    `分類：${category}`,
    `主題：${theme}`,
    `風格：${buildFinalStyleText(form, category, theme)}`,
    "",
    `構圖：${buildFinalCompositionText(form, ratio)}`,
    "",
    `服裝：${buildFinalCostumeText(form, category, theme)}`,
    "",
    `妝容：${buildFinalMakeupText(form)}`,
    "",
    `場景：${buildFinalSceneText(form, category, theme)}`,
    "",
    `動作：${buildFinalActionText(form, category, theme)}`,
    "",
    `光影：${buildFinalLightingText(form, category, theme)}`,
    "",
    buildFinalNegativeText(),
  ].filter((part) => part !== "").join("\n");
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
