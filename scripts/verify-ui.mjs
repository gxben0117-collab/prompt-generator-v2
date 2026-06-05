import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const url = pathToFileURL(path.join(process.cwd(), "index.html")).href;
const viewports = [
  { name: "desktop", width: 1440, height: 950 },
  { name: "mobile", width: 390, height: 844 },
];

const parentCategories = [
  "長相思旅拍",
  "民族古城旅拍",
  "敦煌飛天",
  "九尾妖狐",
  "魅魔",
  "暗黑墮天使",
  "水下龍宮海國",
  "埃及豔后／尼羅河女兒／埃及神話女神",
  "盛唐宮廷考據／大明宮貴妃／史實考據",
  "盛唐風月／教坊平康／胡姬樂舞",
  "漢宮禮樂／長信宮燈／漢代仕女考據",
  "魏晉風骨／洛水女神／清談名姝",
  "宋韻雅集／汴梁茶香／文人仕女",
  "明宮織金／牡丹王姬／禮制服制",
  "清宮旗裝／雪苑貴妃／晚清宮廷寫實",
  "唐朝服飾／泛唐風古裝",
  "江南旅拍",
  "田園花園旅拍",
  "高訂婚紗禮服",
  "海岸度假旅拍",
  "室內生活寫真",
  "賽博機甲 / 科幻戰姬",
  "動漫次文化街拍",
  "東方和風旅拍",
  "東方旗袍夜宴",
  "世界頂級網紅地標旅拍",
  "現代都市夜景",
  "歷史小說名著人物",
  "中國歷代服裝／泛朝代總覽",
  "武俠江湖 / 戰場女將",
  "仙俠神話 / 古裝陸劇",
  "東方異域 / 絲路西域",
  "奇幻異世界 / 暗黑王族",
  "西方古典 / 歐陸史詩",
  "世界景點旅拍",
  "現代都市 / 街拍電影",
  "花園童話 / 自然精靈",
];

const profileChecks = [
  {
    id: "fallen-feather-night-court",
    title: "墮羽夜庭魔姬",
    category: "西方奇幻",
    layers: ["sheer silk chiffon", "layered raven feathers", "黑鐵尖刺浮雕魔冠"],
    makeup: "深酒紅與暗紫色煙燻",
    scene: "墮羽神殿遺跡",
    environment: "夜庭大殿",
    action: "蹲坐於石階",
    lighting: "golden sunset soft edge separation light",
  },
  {
    id: "scholar-study-calligraphy-lady",
    title: "書香才女・書齋揮毫",
    category: "書香才女｜古典文人｜文藝電影風",
    layers: ["white inner garment", "牡丹花紋刺繡", "cinematic literary lady silhouette"],
    makeup: "奶油白底妝",
    scene: "古典中國書齋",
    environment: "牡丹屏風",
    action: "mid-writing posture",
    lighting: "window sunlight",
  },
  {
    id: "seoul-nightview-socialite",
    title: "首爾雲幕・夜色名媛",
    category: "現代都會／韓系夜景／高級名媛",
    layers: ["首爾都會名媛", "大型黑色毛領"],
    makeup: "光澤肌底妝",
    scene: "首爾夜景名媛",
    environment: "首爾高空夜景平台",
    action: "微側臉凝視鏡頭",
    lighting: "城市夜景 bokeh",
  },
  {
    id: "ref-pastoral-pink-chiffon-sundress",
    title: "晴野花園・粉裙旅拍",
    category: "田園花園旅拍／粉色雪紡洋裝／晴日草地",
    layers: ["粉色雪紡長裙", "田園花園旅拍輪廓"],
    makeup: "清透日光底妝",
    scene: "晴日田園花園露台",
    environment: "田園花園露台",
    action: "自然站立或微步前行",
    lighting: "晴日上午自然光",
  },
  {
    id: "ref-temp-blue-ballroom-princess",
    title: "藍金宮廷・水晶舞會公主",
    category: "高訂婚紗禮服／藍金舞會／水晶宮殿",
    layers: ["藍金蓬裙高訂舞會禮服", "水晶舞會公主主視覺輪廓"],
    makeup: "清透公主妝",
    scene: "金色水晶宮殿舞會廳",
    environment: "金色水晶宮殿舞會廳",
    action: "雙手自然扶裙",
    lighting: "宮殿暖金主光",
  },
  {
    id: "ref-temp-mecha-pink-pilot",
    title: "粉髮機甲・未來戰姬",
    category: "賽博機甲／粉髮駕駛員／黑金戰服",
    layers: ["黑金未來駕駛員戰服", "粉髮機甲・未來戰姬主視覺輪廓"],
    makeup: "未來感眼妝",
    scene: "未來機甲停機坪",
    environment: "未來機甲停機坪",
    action: "機甲艙門邊框",
    lighting: "冷白機庫光",
  },
];

async function expectNoOldChipUi(page, viewportName) {
  const removedSelectors = [
    '[data-role-category]',
    "#role-suggestion-list",
    ".role-suggestion-panel",
    ".library-chip-wrap",
    ".delete-chip",
    ".library-editor",
  ];
  for (const selector of removedSelectors) {
    const count = await page.locator(selector).count();
    if (count !== 0) {
      throw new Error(`${viewportName}: removed chip UI still exists: ${selector}`);
    }
  }

  const removedTexts = ["細標籤", "把目前主題加入角色詞庫"];
  for (const text of removedTexts) {
    if ((await page.getByText(text, { exact: true }).count()) !== 0) {
      throw new Error(`${viewportName}: removed text still visible: ${text}`);
    }
  }
}

async function clickSingle(page, locator, label, viewportName) {
  const count = await locator.count();
  if (count !== 1) {
    throw new Error(`${viewportName}: expected exactly one ${label}, got ${count}`);
  }
  await locator.click();
}

async function revealProfile(page, viewportName, profileId, searchTerm = profileId) {
  const locator = page.locator(`[data-world-profile="${profileId}"]`);
  if ((await locator.count()) === 0) {
    await page.locator('input[name="profileSearch"]').fill(searchTerm);
  }
  await clickSingle(page, locator, profileId, viewportName);
}

async function verifyProfileApplication(page, viewportName, profile) {
  await revealProfile(page, viewportName, profile.id, profile.title);

  const theme = await page.getByLabel("主題（必填）").inputValue();
  const category = await page.locator('input[name="category"]').inputValue();
  const layerText = await page.locator(".ordered-layer-grid input").evaluateAll((nodes) =>
    nodes.map((node) => node.value).join("\n"),
  );
  const makeup = await page.locator('input[name="makeup"]').inputValue();
  const scene = await page.locator('textarea[name="scene"]').inputValue();
  const environment = await page.locator('textarea[name="sceneEnvironment"]').inputValue();
  const action = await page.locator('textarea[name="sceneAction"]').inputValue();
  const lighting = await page.locator('textarea[name="sceneLighting"]').inputValue();

  if (theme !== profile.title) {
    throw new Error(`${viewportName}: profile did not fill theme for ${profile.title}`);
  }
  if (category !== profile.category) {
    throw new Error(`${viewportName}: profile did not fill category for ${profile.title}`);
  }
  if (!profile.layers.every((keyword) => layerText.includes(keyword))) {
    throw new Error(`${viewportName}: profile did not fill expected layers for ${profile.title}`);
  }
  if (!makeup.includes(profile.makeup)) {
    throw new Error(`${viewportName}: profile did not fill makeup for ${profile.title}`);
  }
  if (!scene.includes(profile.scene) || !environment.includes(profile.environment)) {
    throw new Error(`${viewportName}: profile did not fill scene/environment for ${profile.title}`);
  }
  if (!action.includes(profile.action)) {
    throw new Error(`${viewportName}: profile did not fill action for ${profile.title}`);
  }
  if (!lighting.includes(profile.lighting)) {
    throw new Error(`${viewportName}: profile did not fill lighting for ${profile.title}`);
  }
}

const browser = await chromium.launch();
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });

    const title = await page.title();
    if (title !== "出圖自組咒語生產器 v1.29") {
      throw new Error(`${viewport.name}: unexpected page title ${title}`);
    }

    await page.getByLabel("主題（必填）").waitFor();
    if ((await page.getByRole("heading", { name: /出圖自組咒語生產器/ }).count()) !== 1) {
      throw new Error(`${viewport.name}: visible app name was not updated`);
    }
    if ((await page.getByText("v1.29", { exact: true }).count()) < 1) {
      throw new Error(`${viewport.name}: visible version v1.29 missing`);
    }
    if ((await page.getByText("最高原則：真人鎖臉優先於所有華麗主視覺，不讓角色滑回 AI 仙女臉。", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: visible product principle missing`);
    }
    if ((await page.getByText("HONGBING CINEMATIC PROMPT", { exact: true }).count()) !== 0) {
      throw new Error(`${viewport.name}: old English app header still visible`);
    }
    if ((await page.getByText("紅兵旅拍大片生成器", { exact: true }).count()) !== 0) {
      throw new Error(`${viewport.name}: old Chinese app header still visible`);
    }
    await expectNoOldChipUi(page, viewport.name);

    const themePlaceholder = await page.getByLabel("主題（必填）").getAttribute("placeholder");
    if (!themePlaceholder.includes("大唐西域公主")) {
      throw new Error(`${viewport.name}: theme placeholder was not updated to role-positioning examples`);
    }
    if ((await page.locator("#theme-risk").count()) !== 0) {
      throw new Error(`${viewport.name}: removed theme safety box still exists`);
    }
    if ((await page.getByRole("button", { name: "轉成服飾 Layer" }).count()) !== 0) {
      throw new Error(`${viewport.name}: removed costume layer conversion button still exists`);
    }
    if ((await page.locator('[name="costumeSearch"]').count()) !== 0 || (await page.locator('textarea[name="costume"]').count()) !== 0) {
      throw new Error(`${viewport.name}: removed costume text/search inputs still exist`);
    }
    if ((await page.locator('select[name="ratio"]').count()) !== 0) {
      throw new Error(`${viewport.name}: ratio should be a block-grid radio control, not a select`);
    }
    if ((await page.locator('select[name="cameraFraming"]').count()) !== 0 || (await page.locator('textarea[name="sceneCamera"]').count()) !== 0) {
      throw new Error(`${viewport.name}: camera controls should be fixed and hidden from UI`);
    }
    if ((await page.locator('input[name="ratio"]').count()) !== 12) {
      throw new Error(`${viewport.name}: ratio block-grid count mismatch`);
    }
    if ((await page.getByText("4:5 商業海報", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: common ratio label for 4:5 missing`);
    }
    if ((await page.getByText("14.8:21 直A5", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: A5 vertical ratio label missing`);
    }
    if ((await page.getByText("21:29 直A4", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: A4 vertical ratio label missing`);
    }
    if ((await page.getByText("25:35 直歐8K", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: European 8K vertical ratio label missing`);
    }
    if ((await page.getByText("9:16 手機桌布", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: mobile wallpaper ratio label missing`);
    }
    if ((await page.locator('input[name="cameraFraming"]').count()) !== 5) {
      throw new Error(`${viewport.name}: camera framing block-grid count mismatch`);
    }
    if ((await page.locator('input[name="visualMode"]').count()) !== 4) {
      throw new Error(`${viewport.name}: visual mode block-grid count mismatch`);
    }
    if ((await page.getByText("高亮商業古裝海報", { exact: true }).count()) !== 1) {
      throw new Error(`${viewport.name}: bright costume poster visual mode missing`);
    }
    if ((await page.locator('input[name="colorIntensity"]').count()) !== 4) {
      throw new Error(`${viewport.name}: color intensity block-grid count mismatch`);
    }
    if ((await page.locator('input[name="fabricMotion"]').count()) !== 3) {
      throw new Error(`${viewport.name}: fabric motion block-grid count mismatch`);
    }
    if ((await page.getByRole("button", { name: "完成出圖 + 複製完整咒語" }).count()) !== 2) {
      throw new Error(`${viewport.name}: compose-and-copy button missing`);
    }
    if ((await page.getByRole("button", { name: "完成出圖咒語", exact: true }).count()) !== 0) {
      throw new Error(`${viewport.name}: old compose-only button still exists`);
    }
    if ((await page.getByRole("button", { name: "複製完整咒語", exact: true }).count()) !== 0) {
      throw new Error(`${viewport.name}: old copy-only button still exists`);
    }
    if (!(await page.locator('input[name="visualMode"][value="Netflix 東方奇幻"]').isChecked())) {
      throw new Error(`${viewport.name}: Netflix eastern fantasy mode should be selected by default`);
    }
    if ((await page.locator('input[name="visualMode"][value="角色設定檔"]').count()) !== 0) {
      throw new Error(`${viewport.name}: quiet character-sheet mode should not remain available`);
    }
    if ((await page.locator('input[name="colorIntensity"][value="柔和電影"]').count()) !== 0) {
      throw new Error(`${viewport.name}: quiet soft-cinema color option should not remain available`);
    }

    const parentButtons = page.locator("[data-role-parent]");
    if ((await parentButtons.count()) !== parentCategories.length + 1) {
      throw new Error(`${viewport.name}: parent category count mismatch`);
    }
    for (const category of parentCategories) {
      if ((await page.locator(`[data-role-parent="${category}"]`).count()) !== 1) {
        throw new Error(`${viewport.name}: missing parent category ${category}`);
      }
    }

    const parentFilterBox = await page.getByRole("button", { name: "全部", exact: true }).boundingBox();
    const templateBox = await page.locator(".template-profile-row").boundingBox();
    const themeBox = await page.getByLabel("主題（必填）").boundingBox();
    if (!themeBox || !parentFilterBox || !templateBox || parentFilterBox.y >= templateBox.y || templateBox.y >= themeBox.y) {
      throw new Error(`${viewport.name}: category and template picker should appear before detailed theme settings`);
    }
    if (templateBox.height < 120) {
      throw new Error(`${viewport.name}: template picker is too compressed for first-step selection`);
    }
    if (parentFilterBox.y >= themeBox.y) {
      throw new Error(`${viewport.name}: parent filters should appear above theme input`);
    }
    if (!(await page.getByText("目前模板角色", { exact: true }).isVisible())) {
      throw new Error(`${viewport.name}: selected template role card missing`);
    }
    if (!(await page.getByText("尚未選擇模板", { exact: true }).isVisible())) {
      throw new Error(`${viewport.name}: empty selected template state missing`);
    }

    const directorPanelOpen = await page.locator(".director-panel").evaluate((node) => node.open);
    if (directorPanelOpen) {
      throw new Error(`${viewport.name}: advanced director panel should be collapsed by default`);
    }

    await clickSingle(page, page.locator('[data-role-parent="歷史小說名著人物"]'), "歷史小說名著人物 parent", viewport.name);
    await expectNoOldChipUi(page, viewport.name);
    await page.locator('input[name="profileSearch"]').fill("潘金蓮");
    if ((await page.locator('[data-world-profile="jinpingmei-pan-jinlian-golden-lotus"]').count()) !== 1) {
      throw new Error(`${viewport.name}: historical novel parent search did not reveal Jin Ping Mei profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("黃蓉");
    if ((await page.locator('[data-world-profile="huang-rong-peach-blossom-heroine"]').count()) !== 1) {
      throw new Error(`${viewport.name}: historical novel parent search did not reveal Huang Rong profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("紅樓夢");
    if ((await page.locator('[data-world-profile="lin-daiyu-xiaoxiang-poet"]').count()) !== 1) {
      throw new Error(`${viewport.name}: historical novel parent search did not reveal Lin Daiyu profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("");

    await clickSingle(page, page.locator('[data-role-parent="中國歷代服裝／泛朝代總覽"]'), "中國歷代服裝／泛朝代總覽 parent", viewport.name);
    await expectNoOldChipUi(page, viewport.name);
    await page.locator('input[name="profileSearch"]').fill("宋韻茶樓");
    if ((await page.locator('[data-world-profile="song-tea-house-jade-lady"]').count()) !== 1) {
      throw new Error(`${viewport.name}: Chinese historical parent search did not reveal Song tea-house profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("書香");
    if ((await page.locator('[data-world-profile="scholar-study-calligraphy-lady"]').count()) !== 0) {
      throw new Error(`${viewport.name}: scholar profile should move out of Chinese historical parent`);
    }

    await clickSingle(page, page.locator('[data-role-parent="江南旅拍"]'), "江南旅拍 parent", viewport.name);
    await page.locator('input[name="profileSearch"]').fill("書香");
    if ((await page.locator('[data-world-profile="scholar-study-calligraphy-lady"]').count()) !== 1) {
      throw new Error(`${viewport.name}: Jiangnan travel parent search did not reveal scholar profile`);
    }

    await clickSingle(page, page.locator('[data-role-parent="魅魔"]'), "魅魔 parent", viewport.name);
    await page.locator('input[name="profileSearch"]').fill("深淵莉莉絲");
    if ((await page.locator('[data-world-profile="dark-abyss-lilith-court-queen"]').count()) !== 1) {
      throw new Error(`${viewport.name}: succubus parent search did not reveal new abyss queen profile`);
    }

    await clickSingle(page, page.locator('[data-role-parent="暗黑墮天使"]'), "暗黑墮天使 parent", viewport.name);
    await page.locator('input[name="profileSearch"]').fill("黑羽墮夜");
    if ((await page.locator('[data-world-profile="fallen-elegy-black-wing-angel"]').count()) !== 1) {
      throw new Error(`${viewport.name}: fallen angel parent search did not reveal black-wing queen profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("not-a-template-keyword");
    if (!(await page.getByText("找不到符合條件的世界觀模板", { exact: true }).isVisible())) {
      throw new Error(`${viewport.name}: profile search empty state did not render`);
    }

    await clickSingle(page, page.locator('[data-role-parent="全部"]'), "全部 parent", viewport.name);
    await page.locator('input[name="profileSearch"]').fill("");

    const aliasProfileSearches = [
      ["白牡丹", "scholar-study-calligraphy-lady"],
      ["花靈公主", "white-rose-light-flower-spirit"],
      ["赤凰皇妃", "crimson-palace-consort"],
      ["鮫人姬", "dragon-palace-sea-empress"],
      ["黑羽墮夜", "fallen-elegy-black-wing-angel"],
    ];
    for (const [keyword, profileId] of aliasProfileSearches) {
      await page.locator('input[name="profileSearch"]').fill(keyword);
      if ((await page.locator(`[data-world-profile="${profileId}"]`).count()) !== 1) {
        throw new Error(`${viewport.name}: profile alias search did not reveal ${profileId} for ${keyword}`);
      }
    }
    await page.locator('input[name="profileSearch"]').fill("");

    await revealProfile(page, viewport.name, "crimson-gold-secret-temple-priestess", "赤金秘殿");
    if (!(await page.locator('textarea[name="scene"]').inputValue()).includes("赤金古文明秘殿")) {
      throw new Error(`${viewport.name}: setup profile did not fill 赤金古文明秘殿`);
    }
    await page.locator('input[name="profileSearch"]').fill("紫蝶夜宴魅魔");
    await clickSingle(page, page.locator('[data-world-profile="dark-succubus"]'), "dark-succubus", viewport.name);
    const staleScene = await page.locator('textarea[name="scene"]').inputValue();
    const staleEnvironment = await page.locator('textarea[name="sceneEnvironment"]').inputValue();
    if (staleScene.includes("赤金古文明秘殿") || staleEnvironment.includes("赤金古文明秘殿")) {
      throw new Error(`${viewport.name}: previous profile scene leaked into scene-less profile`);
    }
    await page.locator('input[name="profileSearch"]').fill("");

    for (const profile of profileChecks) {
      await page.getByRole("button", { name: "清空" }).click();
      await page.getByLabel("主題（必填）").fill("舊角色主題");
      await verifyProfileApplication(page, viewport.name, profile);
      const selectedProfileId = await page.locator('input[name="selectedProfileId"]').inputValue();
      if (selectedProfileId !== profile.id) {
        throw new Error(`${viewport.name}: selected template id was not persisted for ${profile.title}`);
      }
      if (!(await page.locator(".selected-profile-card").getByText(profile.title, { exact: true }).isVisible())) {
        throw new Error(`${viewport.name}: selected template card did not show ${profile.title}`);
      }
      const activeProfileClass = await page.locator(`[data-world-profile="${profile.id}"]`).getAttribute("class");
      if (!activeProfileClass?.includes("active")) {
        throw new Error(`${viewport.name}: selected template chip was not highlighted for ${profile.title}`);
      }
      if (profile.id === "fallen-feather-night-court") {
        const cupSize = await page.locator('select[name="cupSize"]').inputValue();
        if (cupSize !== "豐滿") {
          throw new Error(`${viewport.name}: dark royal profile did not set body fullness`);
        }
        if (!(await page.locator(".selected-profile-card").getByText("體態 豐滿").isVisible())) {
          throw new Error(`${viewport.name}: selected dark royal card did not show body fullness`);
        }
      }
    }

    await page.getByRole("button", { name: "清空" }).click();
    await page.locator('input[name="profileSearch"]').fill("白玫仙庭");
    await clickSingle(page, page.locator('[data-world-profile="white-rose-light-flower-spirit"]'), "white-rose-light-flower-spirit", viewport.name);
    if ((await page.locator('select[name="cupSize"]').inputValue()) !== "預設") {
      throw new Error(`${viewport.name}: default cup-size select should show 預設`);
    }
    if (await page.locator(".selected-profile-card").getByText("體態 預設", { exact: true }).isVisible()) {
      throw new Error(`${viewport.name}: default body fullness text should be hidden in selected template card`);
    }

    await page.getByRole("button", { name: "清空" }).click();
    await page.getByRole("button", { name: "盛唐花鈿妝，柔霧底妝，眉眼修飾但不改變骨相" }).click();
    const suggestedMakeup = await page.locator('input[name="makeup"]').inputValue();
    if (!suggestedMakeup.includes("盛唐花鈿妝")) {
      throw new Error(`${viewport.name}: makeup suggestion did not fill makeup`);
    }
    await page.getByRole("button", { name: "絲綢貼身內襯" }).click();
    const suggestedLayer = await page.getByLabel("Layer 1 內層貼身基底").inputValue();
    if (suggestedLayer !== "絲綢貼身內襯") {
      throw new Error(`${viewport.name}: layer suggestion did not fill layer`);
    }
    const layerOrder = await page.locator(".ordered-layer-grid label span").evaluateAll((nodes) =>
      nodes.slice(0, 3).map((node) => node.textContent),
    );
    if (layerOrder.join("|") !== "Layer 1 內層貼身基底|Layer 2 服裝基礎結構|Layer 3 胸腰支撐結構") {
      throw new Error(`${viewport.name}: costume layers are not ordered numerically`);
    }

    await page.getByRole("button", { name: "清空" }).click();
    const typedTheme = `${viewport.name} 測試旅拍連續輸入`;
    await page.locator('label.radio-card', { has: page.locator('input[name="ratio"][value="3:2"]') }).click();
    await page.locator('label.radio-card', { has: page.locator('input[name="cameraFraming"][value="膝蓋以上"]') }).click();
    await page.locator('label.radio-card', { has: page.locator('input[name="visualMode"][value="暗黑夜宴"]') }).click();
    await page.locator('label.radio-card', { has: page.locator('input[name="colorIntensity"][value="暗紫酒紅"]') }).click();
    await page.locator('label.radio-card', { has: page.locator('input[name="fabricMotion"][value="大動態飄紗"]') }).click();
    if (!(await page.locator('input[name="ratio"][value="3:2"]').isChecked())) {
      throw new Error(`${viewport.name}: ratio block-grid card did not select 3:2`);
    }
    if (!(await page.locator('input[name="cameraFraming"][value="膝蓋以上"]').isChecked())) {
      throw new Error(`${viewport.name}: camera framing block-grid card did not select 膝蓋以上`);
    }
    if (!(await page.locator('input[name="visualMode"][value="暗黑夜宴"]').isChecked())) {
      throw new Error(`${viewport.name}: visual mode block-grid card did not select 暗黑夜宴`);
    }
    await page.locator('input[name="category"]').fill("測試分類");
    await page.locator('select[name="cupSize"]').selectOption("豐滿");
    await page.getByLabel("主題（必填）").fill(typedTheme);
    await page.getByRole("button", { name: "黑色絲綢內襯" }).click();
    await page.getByRole("button", { name: "長安宮廷夜宴，前景燭火，中景角色，遠景宮殿廊柱" }).click();
    await page.getByText("進階導演欄位").click();
    await page.getByRole("button", { name: "哥德石柱夜宴廳，前景燭台，中景人物站於石階前，遠景彩窗與黑色旗幟" }).click();
    await page.getByRole("button", { name: "停留凝視鏡頭，身體重心穩定，布料隨空氣微微流動" }).click();
    await page
      .getByRole("button", { name: "燭火暖光與冷色月光交錯，真實光源邏輯，紅寶石、暗金、絲絨與珠寶反光自然分層" })
      .click();
    await page.locator('textarea[name="scene"]').fill("黑夜哥德教堂，月光石階，燭火與紫色霧氣");
    await page.getByRole("button", { name: "自動補導演欄位" }).click();

    const themeValue = await page.getByLabel("主題（必填）").inputValue();
    const layerValue = await page.getByLabel("Layer 1 內層貼身基底").inputValue();
    const environmentValue = await page.locator('textarea[name="sceneEnvironment"]').inputValue();
    const actionValue = await page.locator('textarea[name="sceneAction"]').inputValue();
    const lightingValue = await page.locator('textarea[name="sceneLighting"]').inputValue();

    await page.getByRole("button", { name: "完成出圖 + 複製完整咒語" }).first().click();
    const historyItems = page.locator("[data-history-id]");
    if ((await historyItems.count()) < 1) {
      throw new Error(`${viewport.name}: prompt history was not recorded`);
    }
    await historyItems.first().click();

    const promptText = await page.locator("#prompt-output").inputValue();
    const metrics = await page.evaluate(() => {
      const doc = globalThis.document;
      return {
        controlCount: doc.querySelectorAll("input, textarea, button").length,
        horizontalOverflow: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
        promptHeight: doc.querySelector("#prompt-output")?.clientHeight || 0,
        status: doc.querySelector("#status-line")?.textContent || "",
        historyCount: doc.querySelectorAll("[data-history-id]").length,
      };
    });

    if (themeValue !== typedTheme) {
      throw new Error(`${viewport.name}: input focus/value was interrupted while typing`);
    }
    if (layerValue !== "黑色絲綢內襯") {
      throw new Error(`${viewport.name}: layer chip did not fill layer field`);
    }
    if (!environmentValue.includes("哥德石柱夜宴廳") || !environmentValue.includes("前景") || !environmentValue.includes("遠景")) {
      throw new Error(`${viewport.name}: scene depth layers missing`);
    }
    if (!actionValue.includes("停留凝視")) {
      throw new Error(`${viewport.name}: emotional scene action missing`);
    }
    if (!lightingValue.includes("燭火暖光")) {
      throw new Error(`${viewport.name}: lighting suggestion did not fill lighting`);
    }
    if (!promptText.includes(typedTheme)) {
      throw new Error(`${viewport.name}: prompt did not include theme after compose`);
    }
    if (!promptText.includes("請根據上傳真人照片生成")) {
      throw new Error(`${viewport.name}: compact ChatGPT prompt opening missing`);
    }
    if (promptText.includes("【真人電影級 AI 電影角色系統｜V4.0 Ultimate】") || promptText.includes("【輸出格式】")) {
      throw new Error(`${viewport.name}: full mother template leaked into final prompt`);
    }
    if (!promptText.includes("構圖：50mm 全片幅")) {
      throw new Error(`${viewport.name}: fixed 50mm camera language missing`);
    }
    if (!promptText.includes("膝蓋以上完整入鏡")) {
      throw new Error(`${viewport.name}: selected camera framing did not enter prompt`);
    }
    if (!promptText.includes("暗黑夜宴電影主視覺")) {
      throw new Error(`${viewport.name}: visual mode did not enter prompt`);
    }
    if (!promptText.includes("deep wine-red silk") || !promptText.includes("amethyst violet atmosphere")) {
      throw new Error(`${viewport.name}: color intensity did not enter prompt`);
    }
    if (!promptText.includes("extra-long flowing silk drapery") || !promptText.includes("airborne translucent shawls")) {
      throw new Error(`${viewport.name}: fabric motion did not enter prompt`);
    }
    if (promptText.includes("==================================================")) {
      throw new Error(`${viewport.name}: useless separator lines leaked into prompt`);
    }
    if (promptText.includes("角色定位：") || promptText.includes("臉部辨識優先權：") || promptText.includes("動作與鏡頭：") || promptText.includes("光影與攝影：")) {
      throw new Error(`${viewport.name}: extra generated-layer sections leaked into prompt`);
    }
    if (!promptText.includes("分類：測試分類") || !promptText.includes(`主題：${typedTheme}`)) {
      throw new Error(`${viewport.name}: UI fields were not inserted into compact prompt`);
    }
    if (!promptText.includes("服裝：") || !promptText.includes("妝容：") || !promptText.includes("場景：") || !promptText.includes("動作：") || !promptText.includes("光影：") || !promptText.includes("負面：")) {
      throw new Error(`${viewport.name}: compact final prompt structure missing`);
    }
    if (!promptText.includes("真人身份鎖定") || !promptText.includes("原始臉型") || !promptText.includes("眼型") || !promptText.includes("鼻型")) {
      throw new Error(`${viewport.name}: compact facial identity lock missing`);
    }
    if (!promptText.includes("請依主題、角色身份與情節重新設計背景近景 / 中景 / 遠景")) {
      throw new Error(`${viewport.name}: adaptive near/mid/far scene direction missing`);
    }
    if (!promptText.includes("不要照抄角色卡近中遠原句")) {
      throw new Error(`${viewport.name}: role-card scene copy guard missing`);
    }
    if (promptText.includes(environmentValue)) {
      throw new Error(`${viewport.name}: final prompt copied director environment field verbatim`);
    }
    if (!promptText.includes("ChatGPT 需依場所、角色身份與情節設計不呆站的姿勢")) {
      throw new Error(`${viewport.name}: adaptive action direction missing`);
    }
    if (!promptText.includes("豐滿體態女王版") || !promptText.includes("royal feminine physique") || !promptText.includes("balanced chest-to-shoulder ratio")) {
      throw new Error(`${viewport.name}: body fullness queen profile did not enter skeleton prompt`);
    }
    if (promptText.includes('罩杯 "K"') || promptText.includes("罩杯 K")) {
      throw new Error(`${viewport.name}: legacy cup-size K leaked into prompt`);
    }
    if (metrics.horizontalOverflow) {
      throw new Error(`${viewport.name}: horizontal overflow detected`);
    }
    if (consoleErrors.length) {
      throw new Error(`${viewport.name}: console errors: ${consoleErrors.join(" | ")}`);
    }

    await page.getByRole("button", { name: "清除紀錄" }).click();
    const historyCountAfterClear = await page.locator("[data-history-id]").count();
    if (historyCountAfterClear !== 0) {
      throw new Error(`${viewport.name}: history clear failed`);
    }

    results.push({ viewport: viewport.name, ...metrics, consoleErrors: consoleErrors.length });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ ok: true, url, results }, null, 2));

