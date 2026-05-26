import { CORE_SPEC_TEXT } from "./coreSpec.js";
import { COSTUME_LAYER_GROUPS, COSTUME_LAYERS, NEGATIVE_PROMPT, WORD_BANK } from "./data.js";

const FORBIDDEN_REPLACEMENTS = [
  [/美女|女神|絕美|完美五官|網紅|少女感/g, "真人電影角色"],
  [/性感|挑逗|誘惑/g, "成熟電影氣質"],
  [/動漫|二次元|遊戲皮膚/g, "真人電影世界觀"],
];

export const DEFAULT_FORM = {
  theme: "",
  scene: "",
  costume: "",
  ...Object.fromEntries(COSTUME_LAYERS.map((layer) => [layer.id, ""])),
  makeup: "",
  finalPrompt: "",
};

export function sanitizeInput(value = "") {
  return FORBIDDEN_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    String(value).trim().replace(/\s+/g, " "),
  );
}

export function normalizeForm(input = {}) {
  const form = { ...DEFAULT_FORM, ...input };

  const normalized = {
    theme: sanitizeInput(form.theme),
    scene: sanitizeInput(form.scene),
    costume: sanitizeInput(form.costume),
    makeup: sanitizeInput(form.makeup),
    finalPrompt: String(form.finalPrompt || ""),
  };

  COSTUME_LAYERS.forEach((layer) => {
    normalized[layer.id] = sanitizeInput(form[layer.id]);
  });

  return normalized;
}

function buildCostumeLayerText(form, theme) {
  const filledLayers = COSTUME_LAYERS.map((layer, index) => ({
    index: index + 1,
    ...layer,
    value: form[layer.id],
  })).filter((layer) => layer.value);

  const layers =
    filledLayers.length > 0
      ? filledLayers
      : COSTUME_LAYERS.slice(0, 8).map((layer, index) => ({
          index: index + 1,
          ...layer,
          value: `${layer.placeholder} for ${theme}`,
      }));

  const layerLines = COSTUME_LAYER_GROUPS.flatMap((group) => {
    const groupedLayers = layers.filter((layer) => layer.group === group.id);
    if (groupedLayers.length === 0) return [];

    return [
      `${group.label}: ${group.prompt}.`,
      ...groupedLayers.map((layer) => `Layer ${layer.index}: ${layer.value}`),
    ];
  });

  return [
    form.costume ? `Costume direction: ${form.costume}.` : "",
    "8-10 layer cinematic costume structure with weighted visual priority:",
    ...layerLines,
    "All layers must be wearable, physically coherent, real fabric weight, real stitching, couture-level film costume, not cosplay, not game skin, not anime outfit.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildPrompt(input = {}) {
  const form = normalizeForm(input);
  if (!form.theme) {
    throw new Error("主題為必填欄位");
  }

  const theme = form.theme;
  const scene =
    form.scene ||
    `依據「${theme}」建立電影場景，包含環境、燈光、動作、構圖、空氣感與電影攝影描述，但不要重複服裝與妝容`;
  const costume = buildCostumeLayerText(form, theme);
  const makeup =
    form.makeup ||
    `配合「${theme}」人物角色的電影級藝人妝容，只限表面妝容、真實電影妝感、中性神態，不改變骨相、不改變五官比例、不重塑真人身份`;

  const sections = [
    CORE_SPEC_TEXT,
    "==================================================",
    "【本次使用者輸入｜依核心規範組合】",
    `【主題】${theme}`,
    `【服裝】${costume}; ${WORD_BANK.costume.join("; ")}.`,
    `【妝容】${makeup}.`,
    `【場景】${scene}; cinematic foreground, midground, and background depth; real spatial perspective; environment shot with cinematic camera language; action must keep the face fully visible; no hand covering face; no back-facing pose; no extreme side face; natural body balance; ${WORD_BANK.scene.join("; ")}; ${WORD_BANK.safety.slice(0, 3).join("; ")}.`,
    "【固定攝影補充】50mm full-frame cinematic lens language, real photographed woman, cinematic travel poster, realistic skin texture, real fabric gravity, natural lens compression, atmospheric depth.",
    `【負面規則】${NEGATIVE_PROMPT.join(", ")}.`,
  ];

  return sections.join("\n");
}

export function buildChatGptInstruction(input = {}) {
  const prompt = buildPrompt(input);
  return [
    "請根據我上傳的真人照片生成圖片，嚴格保留真人身份與臉部辨識度。",
    "請完整遵守以下固定核心規範與本次欄位組合：",
    "",
    prompt,
  ].join("\n");
}

export function estimatePromptHealth(prompt) {
  const checks = [
    ["identity", /真人|real uploaded face identity|原始身份/.test(prompt)],
    ["lens", /50mm|70mm|35mm/.test(prompt)],
    ["theme", /【主題】/.test(prompt)],
    ["negative", /負面規則/.test(prompt)],
    ["sceneDepth", /前景|foreground/.test(prompt)],
  ];

  const passed = checks.filter(([, ok]) => ok).length;
  return {
    score: Math.round((passed / checks.length) * 100),
    passed,
    total: checks.length,
    missing: checks.filter(([, ok]) => !ok).map(([name]) => name),
  };
}
