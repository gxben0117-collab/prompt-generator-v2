import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { URL } from "node:url";
import {
  COSTUME_SUGGESTIONS,
  LAYER_SUGGESTIONS,
  ROLE_SUGGESTIONS,
  WORLD_LAYER_PROFILES,
} from "../src/data.js";
import {
  buildChatGptInstruction,
  buildPrompt,
  assessThemeInput,
  expandCostumeToLayers,
  expandSceneToDirectorFields,
  normalizeForm,
  sanitizeInput,
  suggestThemeRewrite,
} from "../src/promptEngine.js";

const BATCH_ROLE_LABELS = [
  "月下紅衣花神",
  "月宮白玉仙姬",
  "水榭青衣仙子",
  "西域邊關皇妃",
  "紫月夜庭魔后",
  "長安夜宴樂姬",
  "月紗織夢魅姬",
  "墮翼聖城遺女",
  "長安夜宴之首席樂姬",
  "清宮水榭貴妃",
  "大唐鳳儀皇后",
  "長安內廷貴妃",
  "赤焰長城邊關女將",
  "故宮秋景民國千金",
  "黑凰宮闕禁術祭司",
  "黑鴉王座暗夜魔后",
  "落日邊城王朝王姬",
  "霓虹街機格鬥女王",
  "霓虹黑膠街頭女主",
  "雪岸秘典旅者",
  "焚天鳳皇戰姬",
  "紫月神殿黑羽神姬",
  "紫晶神殿黑羽女王",
  "夕照古城江湖女俠",
  "月夜禁林九尾狐姬",
  "靈狐神域九尾妖后",
  "暗夜魔域古殿女王",
  "青鸞神殿隱世聖女",
  "紫櫻禁術陰陽師",
  "大唐西域神殿之祭司",
  "異域沙海古殿聖女",
  "崑崙雪夜之白虎聖女",
  "秋山古道之馭虎女俠",
  "華山日暮江湖女俠",
  "傀儡劇院之靈魂主宰",
  "北境冰原之孤高王后",
  "蒼穹白龍聖女",
  "紫陽花海初夏遊園少女",
  "血衣劍門聖女",
  "歐洲古橋異域貴婦",
  "首爾夜景名媛",
  "水城雨夜旅人",
];

const BATCH_PROFILE_EXPECTATIONS = [
  ["moon-red-flower-goddess", "月下紅衣花神", "流動紅紗", "月夜中式庭園"],
  ["moon-palace-white-jade-fairy", "月宮白玉仙姬", "月光流動", "白玉月宮"],
  ["jiangnan-water-pavilion-cyan-fairy", "水榭青衣仙子", "江南古裝輪廓", "江南水榭"],
  ["western-border-riding-consort", "西域邊關皇妃", "沙漠邊關皇妃", "夕陽沙漠邊城"],
  ["purple-moon-night-court-empress", "紫月夜庭魔后", "紫月古堡王座魔后", "紫月古堡王座"],
  ["changan-night-banquet-musician", "長安夜宴樂姬", "長安夜宴樂姬真人身份保留主視覺", "長安盛唐花宴主視覺"],
  ["moon-weaving-dream-enchantress", "月紗織夢魅姬", "月光絲絨寢宮", "月光絲絨織夢寢宮"],
  ["fallen-wing-holy-city-heiress", "墮翼聖城遺女", "墮翼剪影", "崩壞聖城"],
  ["tang-night-banquet-chief-musician", "長安夜宴之首席樂姬", "長安首席樂姬電影主視覺輪廓", "長安夜宴之首席樂姬主視覺"],
  ["qing-palace-water-pavilion-consort", "清宮水榭貴妃", "貴妃端坐輪廓", "清宮水榭"],
  ["tang-phoenix-ritual-empress-formal", "大唐鳳儀皇后", "宮廷皇后莊重輪廓", "唐代宮廷長廊"],
  ["changan-inner-court-consort", "長安內廷貴妃", "盛唐內廷正裝輪廓", "古典宮室"],
  ["red-flame-great-wall-general", "赤焰長城邊關女將", "東方戰爭電影女將輪廓", "ancient great wall fortress"],
  ["republic-forbidden-city-autumn-heiress", "故宮秋景民國千金", "民國名門千金電影旅拍輪廓", "forbidden city autumn courtyard"],
  ["black-gold-phoenix-priestess", "黑凰宮闕禁術祭司", "黑金鳳凰祭司輪廓", "imperial palace at sunset"],
  ["raven-throne-night-empress", "黑鴉王座暗夜魔后", "黑羽哥德女王輪廓", "gothic throne cathedral"],
  ["tang-border-city-princess", "落日邊城王朝王姬", "邊關王姬史詩輪廓", "ancient imperial city wall"],
  ["cyber-arcade-fighter-champion", "霓虹街機格鬥女王", "athletic silhouette", "cyber arcade arena"],
  ["neon-vinyl-street-heroine", "霓虹黑膠街頭女主", "復古 City Pop 夜街 silhouette", "霓虹黑膠唱片街頭"],
  ["snow-coast-codex-traveler", "雪岸秘典旅者", "北境海岸文藝旅者", "雪岸秘典旅者"],
  ["burning-sky-phoenix-war-princess", "焚天鳳皇戰姬", "鳳凰神族女戰皇電影級輪廓", "焚天鳳皇戰姬"],
  ["purple-moon-black-wing-goddess", "紫月神殿黑羽神姬", "東方黑羽神姬輪廓", "purple moon temple"],
  ["amethyst-temple-black-wing-queen", "紫晶神殿黑羽女王", "黑羽女王輪廓", "moonlit fantasy palace"],
  ["sunset-ancient-city-swordswoman", "夕照古城江湖女俠", "女劍客輪廓", "ancient city rooftops"],
  ["moon-forest-nine-tail-fox-princess", "月夜禁林九尾狐姬", "東方九尾狐姬輪廓", "moonlit ancient forest"],
  ["spirit-fox-domain-nine-tail-empress", "靈狐神域九尾妖后", "九尾妖后史詩輪廓", "moonlit sacred forest"],
  ["dark-domain-ancient-temple-queen", "暗夜魔域古殿女王", "歌德王座輪廓", "月夜暗黑宮廷王座"],
  ["fullmoon-skull-scepter-queen", "滿月骸骨權杖女王", "大型紅寶石骸骨權杖", "巨大冷白滿月"],
  ["qingluan-temple-hidden-saint", "青鸞神殿隱世聖女", "青鸞神殿隱世聖女電影輪廓", "青鸞神殿隱世聖女"],
  ["purple-sakura-forbidden-onmyoji", "紫櫻禁術陰陽師", "禁術系陰陽師巫女電影 silhouette", "紫櫻禁術陰陽師"],
  ["jiu-mo-crimson-phoenix-saint", "九漠沙海之赤鳳聖女", "赤鳳聖女電影輪廓", "九漠沙海之赤鳳聖女"],
  ["water-mirror-crystal-flower-saint", "水鏡晶花聖女", "水鏡晶花聖女真人身份保留主視覺", "上方水面倒影"],
  ["tang-western-temple-dancer", "大唐西域舞姬", "西域舞姬華麗輪廓", "大唐西域舞姬"],
  ["tang-western-temple-priestess", "大唐西域神殿之祭司", "東方奇幻神職者輪廓", "敦煌神殿之黃金暮光"],
  ["exotic-sand-ancient-temple-saint", "異域沙海古殿聖女", "古殿聖女史詩輪廓", "黑夜霜穹之聖座獨思"],
  ["moon-eclipse-ancient-temple-saint", "月蝕古殿聖女", "月蝕古殿聖女超脫輪廓", "月蝕古殿聖女"],
  ["penglai-white-crane-immortal", "崑崙雪夜之白虎聖女", "白虎聖女電影輪廓", "崑崙雪夜白虎望盟"],
  ["autumn-tiger-road-swordswoman", "秋山古道之馭虎女俠", "馭虎女俠硬朗電影輪廓", "秋山古道之馭虎同行"],
  ["huashan-sunset-wuxia-swordswoman", "華山日暮江湖女俠", "華山女俠輪廓", "華山之巔日暮歸途"],
  ["marionette-theater-soul-dominion", "傀儡劇院之靈魂主宰", "傀儡劇院主宰輪廓", "傀儡劇院之靈魂主宰"],
  ["arctic-icefield-queen", "北境冰原之孤高王后", "北境孤高王后輪廓", "北境冰原孤峰"],
  ["sky-white-dragon-saint", "蒼穹白龍聖女", "天空龍域聖女神性 silhouette", "蒼穹白龍聖女"],
  ["hydrangea-early-summer-kimono-girl", "紫陽花海初夏遊園少女", "自然日式古典儀態電影輪廓", "紫陽花海初夏遊園少女"],
  ["blood-sword-gate-saint", "血衣劍門聖女", "血色劍門聖女 silhouette", "血衣劍門聖女"],
  ["europe-bridge-saree-noblewoman", "歐洲古橋異域貴婦", "歐洲旅拍異域貴婦 silhouette", "歐洲古橋異域貴婦"],
  ["seoul-nightview-socialite", "首爾夜景名媛", "首爾都會名媛 silhouette", "首爾夜景名媛"],
  ["rainy-water-city-traveler", "水城雨夜旅人", "歐洲水城旅人", "水城雨夜旅人"],
];

describe("prompt engine", () => {
  it("keeps real-face lock as the visible product principle", () => {
    const mainSource = fs.readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
    expect(mainSource).toContain("最高原則：真人鎖臉優先於所有華麗主視覺，不讓角色滑回 AI 仙女臉。");
    expect(mainSource).toContain("const PRODUCT_PRINCIPLE");
  });

  it("ships built-in role and costume suggestions", () => {
    expect(ROLE_SUGGESTIONS).toContain("大唐公主");
    expect(ROLE_SUGGESTIONS).toContain("大唐飛天");
    expect(ROLE_SUGGESTIONS).toContain("長相思王姬");
    expect(ROLE_SUGGESTIONS).toContain("墮羽夜庭魔姬");
    expect(ROLE_SUGGESTIONS).toContain("夜泊鳳凰樓主");
    expect(ROLE_SUGGESTIONS).toContain("雅典神殿祭儀");
    expect(ROLE_SUGGESTIONS).toContain("玄雷魔殿尊主");
    expect(ROLE_SUGGESTIONS).toContain("月闕瑤池聖妃");
    expect(ROLE_SUGGESTIONS).toContain("長安鳳燭新妃");
    expect(ROLE_SUGGESTIONS).toContain("大唐霓裳樂姬");
    expect(ROLE_SUGGESTIONS).toContain("春庭落櫻閨秀");
    expect(ROLE_SUGGESTIONS).toContain("凡爾賽花庭公主");
    expect(ROLE_SUGGESTIONS).toContain("九天霓裳神姬");
    expect(ROLE_SUGGESTIONS).toContain("寒江孤燈幽姬");
    expect(ROLE_SUGGESTIONS).toContain("寒月青霄劍姬");
    expect(ROLE_SUGGESTIONS).toContain("紫冥骸骨妖后");
    expect(ROLE_SUGGESTIONS).toContain("寒林白狐仙姬");
    expect(ROLE_SUGGESTIONS).toContain("盛唐牡丹貴妃");
    expect(ROLE_SUGGESTIONS).toContain("幽蛛夜宴魅姬");
    expect(ROLE_SUGGESTIONS).toContain("血月絲絨魔后");
    expect(ROLE_SUGGESTIONS).toContain("龍宮海國・滄海龍后");
    expect(ROLE_SUGGESTIONS).toContain("煙雨西塘・江南旅拍");
    expect(ROLE_SUGGESTIONS).toContain("月下撫琴・古院仙姬");
    expect(ROLE_SUGGESTIONS).toContain("墮天遺跡・雙翼審判者");
    expect(ROLE_SUGGESTIONS).toContain("戰場紅衣・女帝將軍");
    expect(ROLE_SUGGESTIONS).toContain("鳳凰神女・聖焰王庭");
    expect(ROLE_SUGGESTIONS).toContain("盛唐鳳儀・宮廷皇后");
    expect(ROLE_SUGGESTIONS).toContain("墮羽哀歌・黑翼墮天使");
    expect(ROLE_SUGGESTIONS).toContain("桃花藥園・春日採花娘");
    expect(ROLE_SUGGESTIONS).toContain("粉櫻水榭・江南仕女");
    expect(ROLE_SUGGESTIONS).toContain("龍庭皇后・九重帝宮");
    expect(ROLE_SUGGESTIONS).toContain("春庭金紗・宮廷郡主");
    expect(ROLE_SUGGESTIONS).toContain("煙柳江南・水鄉旅人");
    expect(ROLE_SUGGESTIONS).toContain("春櫻茶庭・桃花仕女");
    expect(ROLE_SUGGESTIONS).toContain("赤砂皇裔・大漠落日");
    expect(ROLE_SUGGESTIONS).toContain("赤金秘殿・異域祭司");
    expect(ROLE_SUGGESTIONS).toContain("月海星庭・銀月神女");
    expect(ROLE_SUGGESTIONS).toContain("白玫花神・晨曦花園");
    expect(ROLE_SUGGESTIONS).toContain("白玫仙庭・光之花靈");
    expect(ROLE_SUGGESTIONS).toContain("赤凰宮廷・故宮王姬");
    expect(ROLE_SUGGESTIONS).toContain("赤凰華庭・盛世宮妃");
    expect(ROLE_SUGGESTIONS).toContain("桃花仙境・江南仙姬");
    expect(ROLE_SUGGESTIONS).toContain("桃花女俠・海岸古道");
    expect(ROLE_SUGGESTIONS).toContain("盛唐宮姬・牡丹金扇");
    expect(ROLE_SUGGESTIONS).toContain("大唐花朝・宮廷貴姬");
    expect(ROLE_SUGGESTIONS).toContain("天界神女・雲海仙宮");
    expect(ROLE_SUGGESTIONS).toContain("冰霜夜宴魅姬");
    expect(ROLE_SUGGESTIONS).toContain("月下仙姬・桂花宮苑");
    expect(ROLE_SUGGESTIONS).toContain("大周女帝・金殿朝會");
    expect(ROLE_SUGGESTIONS).toContain("江南洗紗・溪畔女子");
    expect(ROLE_SUGGESTIONS).toContain("書香才女・書齋揮毫");
    expect(ROLE_SUGGESTIONS).toContain("夜宴貴姬・燭廊花箋");
    expect(ROLE_SUGGESTIONS).toContain("海棠仙旅・海岸花亭");
    expect(ROLE_SUGGESTIONS).toContain("暗黑魔后・亡靈王座");
    expect(ROLE_SUGGESTIONS).toContain("滿月骸骨權杖女王");
    expect(ROLE_SUGGESTIONS).toContain("荷塘仕女・蓮池紙傘");
    expect(ROLE_SUGGESTIONS).toContain("墮羽黑翼王女");
    expect(ROLE_SUGGESTIONS).toContain("聖域天使・天空神國");
    expect(ROLE_SUGGESTIONS).toContain("幽冥妖后・亡魂夜宴");
    expect(ROLE_SUGGESTIONS).toContain("江南花渡・水鄉花姬");
    expect(ROLE_SUGGESTIONS).toContain("暮色巴黎・密教女巫");
    expect(ROLE_SUGGESTIONS).toContain("雅典衛城・金光祭司");
    expect(ROLE_SUGGESTIONS).toContain("墮羽廢墟・暗黑翼姬");
    expect(ROLE_SUGGESTIONS).toContain("暮光聖殿・血珀夜姬");
    expect(ROLE_SUGGESTIONS).toContain("衛城夕照・奧林匹斯聖女");
    expect(ROLE_SUGGESTIONS).toContain("密室暗夜・巴洛克女爵");
    expect(ROLE_SUGGESTIONS).toContain("絲路旅人・西域旅卷女史");
    expect(ROLE_SUGGESTIONS).toContain("月下飛仙・古城舞姬");
    expect(ROLE_SUGGESTIONS).toContain("雲巔仙宗・天機女修");
    for (const label of BATCH_ROLE_LABELS) {
      expect(ROLE_SUGGESTIONS).toContain(label);
    }
    expect(COSTUME_SUGGESTIONS.some((item) => item.includes("大唐公主"))).toBe(true);
    expect(LAYER_SUGGESTIONS.costumeLayer1.length).toBeGreaterThan(0);
  });

  it("ships worldview layer profiles for one-click costume systems", () => {
    const fairy = WORLD_LAYER_PROFILES.find((profile) => profile.id === "ancient-fairy");
    const succubus = WORLD_LAYER_PROFILES.find((profile) => profile.id === "dark-succubus");
    const fallenFeather = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-feather-night-court");
    const phoenixRiver = WORLD_LAYER_PROFILES.find((profile) => profile.id === "phoenix-river-night-lord");
    const athensTemple = WORLD_LAYER_PROFILES.find((profile) => profile.id === "athens-temple-ritual");
    const parisWitch = WORLD_LAYER_PROFILES.find((profile) => profile.id === "paris-occult-witch");
    const goldenOracle = WORLD_LAYER_PROFILES.find((profile) => profile.id === "athens-golden-oracle-priestess");
    const olympusSaint = WORLD_LAYER_PROFILES.find((profile) => profile.id === "acropolis-olympus-saint");
    const thunderLord = WORLD_LAYER_PROFILES.find((profile) => profile.id === "thunder-demon-palace-lord");
    const moonPalace = WORLD_LAYER_PROFILES.find((profile) => profile.id === "moon-palace-yaochi-consort");
    const changanBride = WORLD_LAYER_PROFILES.find((profile) => profile.id === "changan-phoenix-candle-bride");
    const tangDancer = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-neon-dress-musician");
    const sakuraLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "spring-courtyard-sakura-lady");
    const versaillesPrincess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "versailles-garden-princess");
    const nineHeavensDancer = WORLD_LAYER_PROFILES.find((profile) => profile.id === "nine-heavens-rainbow-dancer");
    const abyssSpider = WORLD_LAYER_PROFILES.find((profile) => profile.id === "abyss-spider-enchantress");
    const bloodMoonSpider = WORLD_LAYER_PROFILES.find((profile) => profile.id === "blood-moon-spider-empress");
    const dragonSeaEmpress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "dragon-palace-sea-empress");
    const waterMirrorCrystal = WORLD_LAYER_PROFILES.find((profile) => profile.id === "water-mirror-crystal-flower-saint");
    const xitangTravel = WORLD_LAYER_PROFILES.find((profile) => profile.id === "xitang-rain-jiangnan-travel");
    const moonQin = WORLD_LAYER_PROFILES.find((profile) => profile.id === "moon-qin-ancient-courtyard");
    const fallenJudge = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-ruins-winged-judge");
    const redGeneral = WORLD_LAYER_PROFILES.find((profile) => profile.id === "red-battlefield-empress-general");
    const phoenixCourt = WORLD_LAYER_PROFILES.find((profile) => profile.id === "phoenix-sacred-flame-court");
    const tangEmpress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-phoenix-ceremony-empress");
    const qingPalaceConsort = WORLD_LAYER_PROFILES.find((profile) => profile.id === "qing-palace-water-pavilion-consort");
    const blackWingAngel = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-elegy-black-wing-angel");
    const darkWingPrincess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-ruins-dark-wing-princess");
    const vampireCountess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "blood-amber-vampire-countess");
    const fullmoonScepterQueen = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fullmoon-skull-scepter-queen");
    const peachFlowerGirl = WORLD_LAYER_PROFILES.find((profile) => profile.id === "peach-medicine-garden-flower-girl");
    const waterPavilionLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "pink-sakura-water-pavilion-lady");
    const dragonCourtEmpress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "dragon-court-ninefold-empress");
    const goldGauzePrincess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "spring-gold-gauze-commandery-princess");
    const willowTraveler = WORLD_LAYER_PROFILES.find((profile) => profile.id === "willow-jiangnan-water-traveler");
    const teaCourtyardLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "spring-sakura-tea-courtyard-lady");
    const desertRoyal = WORLD_LAYER_PROFILES.find((profile) => profile.id === "crimson-sand-desert-royal");
    const templePriestess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "crimson-gold-secret-temple-priestess");
    const silverMoon = WORLD_LAYER_PROFILES.find((profile) => profile.id === "moon-sea-star-court-goddess");
    const whiteRoseDawn = WORLD_LAYER_PROFILES.find((profile) => profile.id === "white-rose-dawn-flower-goddess");
    const whiteRoseSpirit = WORLD_LAYER_PROFILES.find((profile) => profile.id === "white-rose-light-flower-spirit");
    const forbiddenCityPrincess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "crimson-forbidden-city-princess");
    const palaceConsort = WORLD_LAYER_PROFILES.find((profile) => profile.id === "crimson-palace-consort");
    const peachRiverFairy = WORLD_LAYER_PROFILES.find((profile) => profile.id === "peach-river-fairy-over-shoulder");
    const coastalWuxia = WORLD_LAYER_PROFILES.find((profile) => profile.id === "coastal-peach-wuxia-heroine");
    const tangPeonyFan = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-peony-court-lady-fan");
    const tangFlowerFestival = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-flower-festival-noble-lady");
    const cloudGoddess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "celestial-cloud-palace-goddess");
    const frostQueen = WORLD_LAYER_PROFILES.find((profile) => profile.id === "frost-succubus-gothic-queen");
    const osmanthusMoon = WORLD_LAYER_PROFILES.find((profile) => profile.id === "midautumn-osmanthus-moon-fairy");
    const zhouEmpress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "great-zhou-empress-throne-hall");
    const silkWashing = WORLD_LAYER_PROFILES.find((profile) => profile.id === "jiangnan-river-silk-washing-lady");
    const calligraphyLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "scholar-study-calligraphy-lady");
    const nightBanquet = WORLD_LAYER_PROFILES.find((profile) => profile.id === "night-banquet-palace-noble-lady");
    const coastalBegonia = WORLD_LAYER_PROFILES.find((profile) => profile.id === "coastal-begonia-travel-fairy");
    const darkNecromancer = WORLD_LAYER_PROFILES.find((profile) => profile.id === "dark-necromancer-throne-queen");
    const lotusPondLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "lotus-pond-jiangnan-lady");
    const blackFeatherEnchantress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-black-feather-enchantress");
    const holySkyPaladin = WORLD_LAYER_PROFILES.find((profile) => profile.id === "holy-sky-paladin-angel");
    const spiritBanquetEmpress = WORLD_LAYER_PROFILES.find((profile) => profile.id === "underworld-spirit-banquet-empress");
    const flowerFerryLady = WORLD_LAYER_PROFILES.find((profile) => profile.id === "jiangnan-flower-ferry-lady");
    const baroqueCountess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "baroque-secret-room-countess");
    const silkRoadHistorian = WORLD_LAYER_PROFILES.find((profile) => profile.id === "silk-road-scroll-historian");
    const moonlitDanceFairy = WORLD_LAYER_PROFILES.find((profile) => profile.id === "moonlit-flying-dance-fairy");
    const cloudCultivationGuardian = WORLD_LAYER_PROFILES.find((profile) => profile.id === "cloud-peak-cultivation-guardian");
    const coldRiverSpirit = WORLD_LAYER_PROFILES.find((profile) => profile.id === "cold-river-lantern-spirit");
    const coldMoonSword = WORLD_LAYER_PROFILES.find((profile) => profile.id === "cold-moon-sword-princess");
    const violetUnderworld = WORLD_LAYER_PROFILES.find((profile) => profile.id === "violet-underworld-bone-empress");
    const whiteFox = WORLD_LAYER_PROFILES.find((profile) => profile.id === "cold-forest-white-fox");
    const tangConsort = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-peony-imperial-consort");

    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("電影古裝仙女 Layer");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("墮羽夜庭魔姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("夜泊鳳凰樓主");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("雅典神殿祭儀");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("玄雷魔殿尊主");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("月闕瑤池聖妃");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("長安鳳燭新妃");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("大唐霓裳樂姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("春庭落櫻閨秀");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("凡爾賽花庭公主");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("九天霓裳神姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("寒江孤燈幽姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("寒月青霄劍姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("紫冥骸骨妖后");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("寒林白狐仙姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("盛唐牡丹貴妃");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("幽蛛夜宴魅姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("血月絲絨魔后");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("龍宮海國・滄海龍后");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("煙雨西塘・江南旅拍");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("月下撫琴・古院仙姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("墮天遺跡・雙翼審判者");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("戰場紅衣・女帝將軍");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("鳳凰神女・聖焰王庭");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("盛唐鳳儀・宮廷皇后");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("墮羽哀歌・黑翼墮天使");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("桃花藥園・春日採花娘");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("粉櫻水榭・江南仕女");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("龍庭皇后・九重帝宮");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("春庭金紗・宮廷郡主");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("煙柳江南・水鄉旅人");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("春櫻茶庭・桃花仕女");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("赤砂皇裔・大漠落日");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("赤金秘殿・異域祭司");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("月海星庭・銀月神女");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("白玫花神・晨曦花園");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("白玫仙庭・光之花靈");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("赤凰宮廷・故宮王姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("赤凰華庭・盛世宮妃");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("桃花仙境・江南仙姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("桃花女俠・海岸古道");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("盛唐宮姬・牡丹金扇");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("大唐花朝・宮廷貴姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("天界神女・雲海仙宮");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("冰霜夜宴魅姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("月下仙姬・桂花宮苑");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("大周女帝・金殿朝會");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("江南洗紗・溪畔女子");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("書香才女・書齋揮毫");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("夜宴貴姬・燭廊花箋");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("海棠仙旅・海岸花亭");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("暗黑魔后・亡靈王座");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("滿月骸骨權杖女王");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("荷塘仕女・蓮池紙傘");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("墮羽黑翼王女");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("聖域天使・天空神國");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("幽冥妖后・亡魂夜宴");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("江南花渡・水鄉花姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("暮色巴黎・密教女巫");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("雅典衛城・金光祭司");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("墮羽廢墟・暗黑翼姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("暮光聖殿・血珀夜姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("衛城夕照・奧林匹斯聖女");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("密室暗夜・巴洛克女爵");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("絲路旅人・西域旅卷女史");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("月下飛仙・古城舞姬");
    expect(WORLD_LAYER_PROFILES.map((profile) => profile.title)).toContain("雲巔仙宗・天機女修");
    expect(fairy.themeHint).toBe("古裝仙女");
    expect(fairy.layers.costumeLayer1).toContain("貼身柔白絲綢內襯");
    expect(fairy.layers.costumeLayer8).toContain("珍珠步搖");
    expect(succubus.layers.costumeLayer2).toContain("蕾絲邊胸腰支撐");
    expect(fallenFeather.category).toBe("西方奇幻");
    expect(fallenFeather.layers.costumeLayer1).toContain("sheer silk chiffon");
    expect(fallenFeather.layers.costumeLayer7).toContain("layered raven feathers");
    expect(fallenFeather.layers.costumeLayer9).toContain("gothic hand accessories");
    expect(fallenFeather.layers.costumeLayer2).toContain("黑曜石暗紋魚骨束身衣");
    expect(fallenFeather.layers.costumeLayer9).toContain("黑鐵尖刺浮雕魔冠");
    expect(fallenFeather.makeup).toContain("深酒紅與暗紫色煙燻");
    expect(fallenFeather.sceneAction).toContain("蹲坐於石階");
    expect(fallenFeather.sceneLighting).toContain("golden sunset soft edge separation light");
    expect(fallenFeather.sceneLighting).toContain("dreamy atmospheric bokeh");
    expect(phoenixRiver.category).toBe("中國朝代古裝");
    expect(phoenixRiver.layers.costumeLayer1).toContain("sheer silk chiffon");
    expect(phoenixRiver.layers.costumeLayer3).toContain("warm gold brocade silk");
    expect(phoenixRiver.layers.costumeLayer8).toContain("jade-gold ceremonial jewelry");
    expect(phoenixRiver.makeup).toContain("深棕與暖金色漸層");
    expect(phoenixRiver.sceneEnvironment).toContain("南方水岸古鎮夜宴");
    expect(phoenixRiver.sceneAction).toContain("單手持紙傘");
    expect(phoenixRiver.sceneLighting).toContain("warm lantern cinematic lighting");
    expect(athensTemple.category).toBe("世界地標旅拍");
    expect(athensTemple.layers.costumeLayer1).toContain("lightweight draped silk");
    expect(athensTemple.layers.costumeLayer3).toContain("ivory ceremonial silk");
    expect(athensTemple.layers.costumeLayer9).toContain("delicate greek ceremonial tiara");
    expect(athensTemple.makeup).toContain("warm bronze");
    expect(athensTemple.sceneEnvironment).toContain("雅典衛城黃昏祭儀");
    expect(athensTemple.sceneAction).toContain("披肩與裙擺隨晚風自然下墜");
    expect(athensTemple.sceneLighting).toContain("warm mediterranean sunlight");
    expect(thunderLord.category).toBe("仙俠修真");
    expect(thunderLord.layers.costumeLayer1).toContain("sheer obsidian silk");
    expect(thunderLord.layers.costumeLayer5).toContain("dark metallic armor detailing");
    expect(thunderLord.layers.costumeLayer9).toContain("ceremonial storm fan");
    expect(thunderLord.makeup).toContain("charcoal black");
    expect(thunderLord.sceneEnvironment).toContain("九幽雷域魔山");
    expect(thunderLord.sceneAction).toContain("濕滑岩石表面");
    expect(thunderLord.sceneLighting).toContain("lightning storm illumination");
    expect(moonPalace.category).toBe("中國神話");
    expect(moonPalace.layers.costumeLayer1).toContain("sheer moon-silk chiffon");
    expect(moonPalace.layers.costumeLayer8).toContain("moonstone ceremonial jewelry");
    expect(moonPalace.layers.costumeLayer9).toContain("ornate lunar imperial crown");
    expect(moonPalace.makeup).toContain("moonlit soft matte cinematic skin texture");
    expect(moonPalace.sceneEnvironment).toContain("白兔");
    expect(moonPalace.sceneAction).toContain("單手輕抬");
    expect(moonPalace.sceneLighting).toContain("moonlit cinematic glow");
    expect(changanBride.category).toBe("中國朝代古裝");
    expect(changanBride.layers.costumeLayer1).toContain("sheer champagne silk");
    expect(changanBride.layers.costumeLayer3).toContain("champagne-gold ceremonial embroidery");
    expect(changanBride.layers.costumeLayer9).toContain("delicate chinese bridal headpiece");
    expect(changanBride.makeup).toContain("warm cinematic bridal skin texture");
    expect(changanBride.sceneEnvironment).toContain("雙喜紋樣");
    expect(changanBride.sceneAction).toContain("雙手輕握紅色紙傘");
    expect(changanBride.sceneLighting).toContain("warm lantern glow");
    expect(tangDancer.category).toBe("中國朝代古裝");
    expect(tangDancer.layers.costumeLayer1).toContain("sheer ceremonial silk");
    expect(tangDancer.layers.costumeLayer3).toContain("crimson-red royal silk");
    expect(tangDancer.layers.costumeLayer9).toContain("ornate phoenix crown structure");
    expect(tangDancer.makeup).toContain("warm candlelit cinematic skin texture");
    expect(tangDancer.sceneEnvironment).toContain("牡丹壁畫");
    expect(tangDancer.sceneAction).toContain("古典舞姿延伸");
    expect(tangDancer.sceneLighting).toContain("warm imperial candlelight");
    expect(sakuraLady.category).toBe("中國田園旅拍");
    expect(sakuraLady.layers.costumeLayer1).toContain("sheer blush silk");
    expect(sakuraLady.layers.costumeLayer3).toContain("soft cherry-blossom textile");
    expect(sakuraLady.layers.costumeLayer9).toContain("cherry blossom floral hairpiece");
    expect(sakuraLady.makeup).toContain("soft spring daylight cinematic skin texture");
    expect(sakuraLady.sceneEnvironment).toContain("木造小屋");
    expect(sakuraLady.sceneAction).toContain("雙手輕捧櫻花花瓣");
    expect(sakuraLady.sceneLighting).toContain("warm spring sunlight");
    expect(versaillesPrincess.category).toBe("世界花園旅拍");
    expect(versaillesPrincess.layers.costumeLayer1).toContain("sheer blush silk");
    expect(versaillesPrincess.layers.costumeLayer3).toContain("pastel rose ceremonial textile");
    expect(versaillesPrincess.layers.costumeLayer9).toContain("自然波浪長髮");
    expect(versaillesPrincess.makeup).toContain("warm floral daylight cinematic skin texture");
    expect(versaillesPrincess.sceneEnvironment).toContain("玻璃穹頂");
    expect(versaillesPrincess.sceneAction).toContain("單手輕提裙擺");
    expect(versaillesPrincess.sceneLighting).toContain("warm greenhouse sunlight");
    expect(nineHeavensDancer.category).toBe("東方神話／飛天系列");
    expect(nineHeavensDancer.layers.costumeLayer1).toContain("sheer celestial silk");
    expect(nineHeavensDancer.layers.costumeLayer3).toContain("heavenly ceremonial textile");
    expect(nineHeavensDancer.layers.costumeLayer9).toContain("ornate heavenly crown");
    expect(nineHeavensDancer.makeup).toContain("soft heavenly cinematic skin texture");
    expect(nineHeavensDancer.sceneEnvironment).toContain("高聳白金神柱");
    expect(nineHeavensDancer.sceneAction).toContain("飛天舞姿延伸");
    expect(nineHeavensDancer.sceneLighting).toContain("soft divine daylight");
    expect(abyssSpider.category).toBe("夜宴魅姬／暗黑浪漫電影");
    expect(abyssSpider.layers.costumeLayer1).toContain("高訂深紫絲綢貼身襯裙");
    expect(abyssSpider.layers.costumeLayer4).toContain("translucent lace-edged gauze");
    expect(abyssSpider.layers.costumeLayer8).toContain("dark crystal jewelry");
    expect(abyssSpider.makeup).toContain("deep plum");
    expect(abyssSpider.sceneEnvironment).toContain("絲絨寢宮");
    expect(abyssSpider.sceneAction).toContain("端正坐姿");
    expect(abyssSpider.sceneLighting).toContain("soft candlelight");
    expect(bloodMoonSpider.category).toBe("夜宴魅姬／暗黑浪漫電影");
    expect(bloodMoonSpider.layers.costumeLayer1).toContain("深酒紅絲綢貼身襯裙");
    expect(bloodMoonSpider.layers.costumeLayer4).toContain("translucent crimson lace gauze");
    expect(bloodMoonSpider.layers.costumeLayer8).toContain("ruby gemstone jewelry");
    expect(bloodMoonSpider.makeup).toContain("deep crimson");
    expect(bloodMoonSpider.sceneEnvironment).toContain("血月絲絨夜宴寢宮");
    expect(bloodMoonSpider.sceneAction).toContain("端正坐姿");
    expect(bloodMoonSpider.sceneLighting).toContain("warm red candlelight");
    expect(dragonSeaEmpress.category).toBe("東方神話／深海龍宮／龍族王后／海國奇幻電影");
    expect(dragonSeaEmpress.layers.costumeLayer1).toContain("pearl-white silk foundation");
    expect(dragonSeaEmpress.layers.costumeLayer3).toContain("gold-thread dragon embroidery");
    expect(dragonSeaEmpress.layers.costumeLayer9).toContain("ornate deep-sea crown");
    expect(dragonSeaEmpress.aliases).toContain("深海月華鮫人姬");
    expect(dragonSeaEmpress.layers.costumeLayer10).toContain("月海鮫人聖女流動 silhouette");
    expect(dragonSeaEmpress.makeup).toContain("cinematic pearl skin texture");
    expect(dragonSeaEmpress.makeup).toContain("冷白水光肌");
    expect(dragonSeaEmpress.scene).toContain("深海月華鮫人姬");
    expect(dragonSeaEmpress.sceneEnvironment).toContain("巨大盤龍雕像");
    expect(dragonSeaEmpress.sceneAction).toContain("單手持龍珠");
    expect(dragonSeaEmpress.sceneAction).toContain("閉眼漂浮");
    expect(dragonSeaEmpress.sceneLighting).toContain("underwater volumetric light");
    expect(waterMirrorCrystal.category).toBe("月光奇幻／水鏡晶花／高級寫實奇幻");
    expect(waterMirrorCrystal.aliases).toContain("水下晶花女主視覺");
    expect(waterMirrorCrystal.makeup).toContain("保留原始臉型");
    expect(waterMirrorCrystal.makeup).toContain("不拉長眼型");
    expect(waterMirrorCrystal.scene).toContain("上方水面倒影");
    expect(waterMirrorCrystal.sceneEnvironment).toContain("深藍黑水下空間");
    expect(waterMirrorCrystal.sceneAction).toContain("一手輕托發光透明晶花");
    expect(waterMirrorCrystal.sceneLighting).toContain("cinematic caustics");
    expect(waterMirrorCrystal.layers.costumeLayer4).toContain("underwater flowing silk drapery");
    expect(waterMirrorCrystal.layers.costumeLayer8).toContain("透明發光晶花");
    expect(waterMirrorCrystal.layers.costumeLayer10).toContain("原始臉部辨識度");
    expect(xitangTravel.category).toBe("江南古鎮／電影旅拍／寫實東方美學");
    expect(xitangTravel.layers.costumeLayer1).toContain("warm ivory cotton-linen foundation");
    expect(xitangTravel.layers.costumeLayer4).toContain("ink-wash shawl drapery");
    expect(xitangTravel.layers.costumeLayer9).toContain("江南低髮髻");
    expect(xitangTravel.makeup).toContain("自然裸肌 cinematic skin texture");
    expect(xitangTravel.sceneEnvironment).toContain("烏篷船");
    expect(xitangTravel.sceneAction).toContain("側身回眸");
    expect(xitangTravel.sceneLighting).toContain("rainy soft diffuse light");
    expect(moonQin.category).toBe("東方古風／月夜庭院／琴師仙姬");
    expect(moonQin.layers.costumeLayer1).toContain("white silk foundation");
    expect(moonQin.layers.costumeLayer6).toContain("musician waist sash");
    expect(moonQin.layers.costumeLayer10).toContain("jade hair ornament");
    expect(moonQin.makeup).toContain("冷月光 cinematic skin texture");
    expect(moonQin.sceneEnvironment).toContain("古琴");
    expect(moonQin.sceneAction).toContain("雙手撫琴");
    expect(moonQin.sceneLighting).toContain("cold moonlight key light");
    expect(fallenJudge.category).toBe("黑暗奇幻／墮天使／史詩電影");
    expect(fallenJudge.layers.costumeLayer1).toContain("distressed white silk foundation");
    expect(fallenJudge.layers.costumeLayer5).toContain("羽翼骨架結構");
    expect(fallenJudge.layers.costumeLayer9).toContain("layered white-and-shadow feathers");
    expect(fallenJudge.makeup).toContain("灰金色煙燻");
    expect(fallenJudge.sceneEnvironment).toContain("天空裂縫");
    expect(fallenJudge.sceneAction).toContain("雙翼展開");
    expect(fallenJudge.sceneLighting).toContain("heavenly sacred balanced key light");
    expect(redGeneral.category).toBe("東方戰爭電影／女帝／古代戰場");
    expect(redGeneral.layers.costumeLayer1).toContain("deep crimson battle-robe foundation");
    expect(redGeneral.layers.costumeLayer3).toContain("flexible light armor waist support");
    expect(redGeneral.layers.costumeLayer10).toContain("cinematic red empress-general silhouette");
    expect(redGeneral.makeup).toContain("深紅棕色眼尾");
    expect(redGeneral.sceneEnvironment).toContain("戰旗");
    expect(redGeneral.sceneAction).toContain("轉身回眸");
    expect(redGeneral.sceneLighting).toContain("overcast natural light");
    expect(phoenixCourt.category).toBe("東方神話／鳳凰神女／王庭奇幻");
    expect(phoenixCourt.layers.costumeLayer1).toContain("black-gold silk foundation");
    expect(phoenixCourt.layers.costumeLayer4).toContain("layered phoenix-feather shoulders");
    expect(phoenixCourt.layers.costumeLayer9).toContain("ornate flame crown");
    expect(phoenixCourt.makeup).toContain("金紅鳳羽眼尾");
    expect(phoenixCourt.sceneEnvironment).toContain("火焰神鳥");
    expect(phoenixCourt.sceneAction).toContain("單手托臉但不遮擋臉部");
    expect(phoenixCourt.sceneLighting).toContain("golden halo lighting");
    expect(tangEmpress.category).toBe("盛唐宮廷／皇后／東方電影美學");
    expect(tangEmpress.layers.costumeLayer1).toContain("crimson embroidered silk foundation");
    expect(tangEmpress.layers.costumeLayer7).toContain("embroidered phoenix round fan");
    expect(tangEmpress.layers.costumeLayer9).toContain("ornate phoenix crown");
    expect(tangEmpress.makeup).toContain("大唐鳳尾眼線");
    expect(tangEmpress.sceneEnvironment).toContain("牡丹園");
    expect(tangEmpress.sceneAction).toContain("持團扇");
    expect(tangEmpress.sceneLighting).toContain("golden sunset balanced key light");
    expect(qingPalaceConsort.category).toBe("清宮古裝／水榭庭院／貴妃");
    expect(qingPalaceConsort.layers.costumeLayer1).toContain("灰藍色絲綢抹胸內襯");
    expect(qingPalaceConsort.layers.costumeLayer3).toContain("淺灰藍底色印花齊胸襦裙");
    expect(qingPalaceConsort.layers.costumeLayer10).toContain("深宮依欄思鄉之世家姬妾");
    expect(qingPalaceConsort.makeup).toContain("影視高清裸妝感");
    expect(qingPalaceConsort.scene).toContain("深宮依欄思鄉之世家姬妾");
    expect(qingPalaceConsort.sceneEnvironment).toContain("竹影搖曳");
    expect(qingPalaceConsort.sceneAction).toContain("雙手交疊放於腹前");
    expect(qingPalaceConsort.sceneLighting).toContain("realistic air perspective");
    expect(blackWingAngel.category).toBe("黑暗奇幻／墮天使／哥德電影／廢墟神殿");
    expect(blackWingAngel.layers.costumeLayer1).toContain("black silk foundation");
    expect(blackWingAngel.layers.costumeLayer6).toContain("damaged wing frame");
    expect(blackWingAngel.layers.costumeLayer9).toContain("layered raven-black feathers");
    expect(blackWingAngel.aliases).toContain("黑羽墮夜女王");
    expect(blackWingAngel.layers.costumeLayer2).toContain("burnt chiffon");
    expect(blackWingAngel.layers.costumeLayer7).toContain("cinematic raven wings");
    expect(blackWingAngel.layers.costumeLayer10).toContain("黑羽墮夜女王大輪廓");
    expect(blackWingAngel.makeup).toContain("黑色淚痕");
    expect(blackWingAngel.makeup).toContain("暗紫光影");
    expect(blackWingAngel.sceneEnvironment).toContain("崩毀哥德神殿");
    expect(blackWingAngel.sceneEnvironment).toContain("疲憊墮天使坐姿");
    expect(blackWingAngel.sceneAction).toContain("單手壓胸");
    expect(blackWingAngel.sceneAction).toContain("pin-up pose");
    expect(blackWingAngel.sceneLighting).toContain("high sacred light beam");
    expect(blackWingAngel.sceneLighting).toContain("floating ash");
    expect(peachFlowerGirl.category).toBe("江南古風／桃花庭院／春日寫實電影");
    expect(peachFlowerGirl.layers.costumeLayer1).toContain("ivory cotton-linen foundation");
    expect(peachFlowerGirl.layers.costumeLayer9).toContain("簡約木簪");
    expect(peachFlowerGirl.layers.costumeLayer10).toContain("竹籃農園配件");
    expect(peachFlowerGirl.makeup).toContain("柔霧 cinematic skin texture");
    expect(peachFlowerGirl.sceneEnvironment).toContain("藥園花圃");
    expect(peachFlowerGirl.sceneAction).toContain("雙手持木耙");
    expect(peachFlowerGirl.sceneLighting).toContain("soft spring daylight");
    expect(waterPavilionLady.category).toBe("江南園林／古風仕女／東方旅拍電影");
    expect(waterPavilionLady.layers.costumeLayer1).toContain("white silk foundation");
    expect(waterPavilionLady.layers.costumeLayer1).toContain("象牙白細棉平織貼身抹胸");
    expect(waterPavilionLady.layers.costumeLayer3).toContain("淺碧色交領襦裙");
    expect(waterPavilionLady.layers.costumeLayer3).toContain("淺湖水綠對襟襦裙");
    expect(waterPavilionLady.layers.costumeLayer7).toContain("pearl tassel fan accessory");
    expect(waterPavilionLady.layers.costumeLayer7).toContain("肩部疊紗");
    expect(waterPavilionLady.layers.costumeLayer8).toContain("天然海水白珍珠");
    expect(waterPavilionLady.layers.costumeLayer8).toContain("白玉鏤空香囊");
    expect(waterPavilionLady.layers.costumeLayer10).toContain("珍珠頸鍊配件");
    expect(waterPavilionLady.layers.costumeLayer10).toContain("江南水鄉園林世家閨秀");
    expect(waterPavilionLady.layers.costumeLayer10).toContain("深閨望月思鄉之貴族官眷");
    expect(waterPavilionLady.makeup).toContain("高級裸肌 cinematic skin texture");
    expect(waterPavilionLady.makeup).toContain("電影級高清啞光底妝");
    expect(waterPavilionLady.makeup).toContain("棕紅色系暈染");
    expect(waterPavilionLady.scene).toContain("江南水鄉園林世家閨秀");
    expect(waterPavilionLady.scene).toContain("園林晨曦古典仕女像");
    expect(waterPavilionLady.sceneEnvironment).toContain("蓮池");
    expect(waterPavilionLady.sceneEnvironment).toContain("晚清民初江南私家園林");
    expect(waterPavilionLady.sceneEnvironment).toContain("石柱");
    expect(waterPavilionLady.sceneAction).toContain("單手持團扇");
    expect(waterPavilionLady.sceneAction).toContain("端坐於木質迴廊窗台旁");
    expect(waterPavilionLady.sceneAction).toContain("右手輕扶格柵");
    expect(waterPavilionLady.sceneLighting).toContain("soft natural side light");
    expect(waterPavilionLady.sceneLighting).toContain("Golden hour soft edge separation light");
    expect(waterPavilionLady.sceneLighting).toContain("Lens Bloom");
    expect(dragonCourtEmpress.category).toBe("帝王宮廷／東方史詩電影／皇后");
    expect(dragonCourtEmpress.scene).toContain("金龍皇庭聖后");
    expect(dragonCourtEmpress.layers.costumeLayer1).toContain("golden silk foundation");
    expect(dragonCourtEmpress.layers.costumeLayer1).toContain("黑金絲綢貼身內襯");
    expect(dragonCourtEmpress.layers.costumeLayer2).toContain("imperial dragon embroidered robe");
    expect(dragonCourtEmpress.layers.costumeLayer6).toContain("龍首雕刻");
    expect(dragonCourtEmpress.layers.costumeLayer9).toContain("ornate imperial phoenix crown");
    expect(dragonCourtEmpress.layers.costumeLayer10).toContain("黑金龍庭女帝");
    expect(dragonCourtEmpress.makeup).toContain("金棕鳳尾眼線");
    expect(dragonCourtEmpress.sceneEnvironment).toContain("金龍浮雕");
    expect(dragonCourtEmpress.sceneEnvironment).toContain("巨型神龍盤繞");
    expect(dragonCourtEmpress.sceneAction).toContain("雙手交疊");
    expect(dragonCourtEmpress.sceneAction).toContain("雙手自然展開披袖");
    expect(dragonCourtEmpress.sceneLighting).toContain("warm golden palace lantern key light");
    expect(dragonCourtEmpress.sceneLighting).toContain("cinematic lens bloom");
    expect(goldGauzePrincess.category).toBe("盛唐宮廷／春日旅拍／東方電影美學");
    expect(goldGauzePrincess.layers.costumeLayer1).toContain("apricot-pink silk foundation");
    expect(goldGauzePrincess.layers.costumeLayer3).toContain("translucent golden gauze robe");
    expect(goldGauzePrincess.layers.costumeLayer9).toContain("small gold crown hair ornament");
    expect(goldGauzePrincess.makeup).toContain("柔金棕色");
    expect(goldGauzePrincess.sceneEnvironment).toContain("櫻花庭院");
    expect(goldGauzePrincess.sceneAction).toContain("側身回眸");
    expect(goldGauzePrincess.sceneLighting).toContain("golden sunset balanced key light");
    expect(willowTraveler.category).toBe("江南水鄉／寫實旅拍／東方電影感");
    expect(willowTraveler.layers.costumeLayer1).toContain("pale cyan silk foundation");
    expect(willowTraveler.layers.costumeLayer2).toContain("ink-wash floral skirt textile");
    expect(willowTraveler.layers.costumeLayer10).toContain("玉佩流蘇");
    expect(willowTraveler.makeup).toContain("自然裸肌 cinematic skin texture");
    expect(willowTraveler.sceneEnvironment).toContain("烏篷船");
    expect(willowTraveler.sceneAction).toContain("雙手自然交握");
    expect(willowTraveler.sceneLighting).toContain("spring afternoon natural light");
    expect(teaCourtyardLady.category).toBe("桃花庭院／東方電影／古風仕女");
    expect(teaCourtyardLady.scene).toContain("江南春庭閨秀");
    expect(teaCourtyardLady.layers.costumeLayer1).toContain("white inner silk dress");
    expect(teaCourtyardLady.layers.costumeLayer1).toContain("米白絲質內襯");
    expect(teaCourtyardLady.layers.costumeLayer7).toContain("embroidered tassel fan");
    expect(teaCourtyardLady.layers.costumeLayer10).toContain("玉石腰飾");
    expect(teaCourtyardLady.layers.costumeLayer10).toContain("江南閨秀柔和垂墜");
    expect(teaCourtyardLady.makeup).toContain("粉棕柔霧眼妝");
    expect(teaCourtyardLady.sceneEnvironment).toContain("茶席");
    expect(teaCourtyardLady.sceneEnvironment).toContain("牡丹盆景");
    expect(teaCourtyardLady.scene).toContain("春宴茶樓仕女");
    expect(teaCourtyardLady.layers.costumeLayer2).toContain("淡青色束腰內裙");
    expect(teaCourtyardLady.sceneAction).toContain("雙手捧茶盞");
    expect(teaCourtyardLady.sceneLighting).toContain("茶煙");
    expect(teaCourtyardLady.sceneAction).toContain("雙手持團扇");
    expect(teaCourtyardLady.sceneLighting).toContain("golden sunset balanced key light");
    expect(desertRoyal.category).toBe("絲路奇幻／大漠王族／電影級旅拍");
    expect(desertRoyal.layers.costumeLayer1).toContain("dark crimson silk foundation");
    expect(desertRoyal.layers.costumeLayer1).toContain("米金色貼身絲質內襯");
    expect(desertRoyal.layers.costumeLayer5).toContain("handcrafted metal waist chains");
    expect(desertRoyal.layers.costumeLayer5).toContain("雕花金腰封");
    expect(desertRoyal.layers.costumeLayer10).toContain("沙漠王族金飾配件");
    expect(desertRoyal.layers.costumeLayer10).toContain("絲路沙海皇妃 silhouette");
    expect(desertRoyal.makeup).toContain("金棕沙漠系眼妝");
    expect(desertRoyal.scene).toContain("絲路赤沙皇妃");
    expect(desertRoyal.sceneEnvironment).toContain("無盡沙丘");
    expect(desertRoyal.sceneEnvironment).toContain("遠方駱駝商隊");
    expect(desertRoyal.sceneEnvironment).toContain("王庭旗幟");
    expect(desertRoyal.sceneAction).toContain("站立於沙丘邊緣");
    expect(desertRoyal.sceneAction).toContain("向鏡頭伸手");
    expect(desertRoyal.sceneAction).toContain("身體前傾");
    expect(desertRoyal.sceneLighting).toContain("sand-particle reflection");
    expect(desertRoyal.sceneLighting).toContain("金色沙塵 volumetric light");
    expect(templePriestess.category).toBe("東方奇幻／異域神殿／神秘祭司");
    expect(templePriestess.layers.costumeLayer1).toContain("deep crimson silk foundation");
    expect(templePriestess.layers.costumeLayer4).toContain("high-collar gold-trim mantle");
    expect(templePriestess.layers.costumeLayer10).toContain("golden hand-chain armor");
    expect(templePriestess.makeup).toContain("星紋寶石額鏈");
    expect(templePriestess.sceneEnvironment).toContain("玻璃櫥櫃");
    expect(templePriestess.sceneAction).toContain("單手托臉");
    expect(templePriestess.sceneLighting).toContain("warm golden flame light");
    expect(silverMoon.category).toBe("月光奇幻／銀河神話／東方精靈");
    expect(silverMoon.layers.costumeLayer1).toContain("silver-white silk foundation");
    expect(silverMoon.layers.costumeLayer7).toContain("galaxy silk drapery");
    expect(silverMoon.layers.costumeLayer10).toContain("星光耳墜");
    expect(silverMoon.makeup).toContain("銀白月光眼妝");
    expect(silverMoon.sceneEnvironment).toContain("巨大月輪");
    expect(silverMoon.sceneAction).toContain("單手扶月輪");
    expect(silverMoon.sceneLighting).toContain("cold moon key light");
    expect(whiteRoseDawn.category).toBe("花園奇幻／森林精靈／電影童話");
    expect(whiteRoseDawn.layers.costumeLayer1).toContain("ivory floral inner dress");
    expect(whiteRoseDawn.layers.costumeLayer3).toContain("handcrafted white rose appliques");
    expect(whiteRoseDawn.layers.costumeLayer9).toContain("white rose floral crown");
    expect(whiteRoseDawn.makeup).toContain("淡金玫瑰色眼妝");
    expect(whiteRoseDawn.sceneEnvironment).toContain("森林花棚");
    expect(whiteRoseDawn.sceneAction).toContain("單手持白玫瑰");
    expect(whiteRoseDawn.sceneLighting).toContain("dawn balanced key light");
    expect(whiteRoseSpirit.category).toBe("夢幻電影／花靈仙境／高級寫實奇幻");
    expect(whiteRoseSpirit.layers.costumeLayer1).toContain("milk-white silk foundation");
    expect(whiteRoseSpirit.layers.costumeLayer5).toContain("soft vine wrapping");
    expect(whiteRoseSpirit.layers.costumeLayer10).toContain("珍珠花鏈飾品");
    expect(whiteRoseSpirit.aliases).toContain("繁花聖域花靈公主");
    expect(whiteRoseSpirit.layers.costumeLayer10).toContain("花界精靈女王夢幻 silhouette");
    expect(whiteRoseSpirit.makeup).toContain("自然奶茶金色眼妝");
    expect(whiteRoseSpirit.makeup).toContain("蜜桃粉底妝");
    expect(whiteRoseSpirit.scene).toContain("繁花聖域花靈公主");
    expect(whiteRoseSpirit.sceneEnvironment).toContain("白玫瑰花海");
    expect(whiteRoseSpirit.sceneAction).toContain("雙手輕捧花朵");
    expect(whiteRoseSpirit.sceneLighting).toContain("bright morning exposure");
    expect(forbiddenCityPrincess.category).toBe("故宮古風／宮廷電影／盛世王朝");
    expect(forbiddenCityPrincess.layers.costumeLayer1).toContain("gold-white silk foundation");
    expect(forbiddenCityPrincess.layers.costumeLayer5).toContain("phoenix embroidery");
    expect(forbiddenCityPrincess.layers.costumeLayer9).toContain("gold dangling hair ornaments");
    expect(forbiddenCityPrincess.makeup).toContain("赤金宮廷眼妝");
    expect(forbiddenCityPrincess.sceneEnvironment).toContain("故宮紅牆");
    expect(forbiddenCityPrincess.sceneAction).toContain("單手提裙");
    expect(forbiddenCityPrincess.sceneLighting).toContain("afternoon natural light");
    expect(palaceConsort.category).toBe("宮廷古裝／東方寫實電影／故宮美學");
    expect(palaceConsort.layers.costumeLayer1).toContain("crimson-white silk lining");
    expect(palaceConsort.layers.costumeLayer2).toContain("peony embroidered bodice support");
    expect(palaceConsort.layers.costumeLayer9).toContain("gold hair ornaments");
    expect(palaceConsort.aliases).toContain("大唐赤凰皇妃");
    expect(palaceConsort.layers.costumeLayer3).toContain("赤金鳳紋宮廷主袍");
    expect(palaceConsort.makeup).toContain("赤棕宮廷眼妝");
    expect(palaceConsort.makeup).toContain("金棕眼妝");
    expect(palaceConsort.sceneEnvironment).toContain("宮殿飛簷");
    expect(palaceConsort.sceneEnvironment).toContain("燭火長廊");
    expect(palaceConsort.sceneAction).toContain("單手扶衣襟");
    expect(palaceConsort.sceneAction).toContain("回眸凝視鏡頭");
    expect(palaceConsort.sceneLighting).toContain("warm golden sunset side light");
    expect(peachRiverFairy.category).toBe("桃花仙境｜江南仙姬｜古風電影旅拍");
    expect(peachRiverFairy.layers.costumeLayer1).toContain("silk inner dress");
    expect(peachRiverFairy.layers.costumeLayer6).toContain("gold floral headpiece");
    expect(peachRiverFairy.layers.costumeLayer10).toContain("peach-blossom river fairy");
    expect(peachRiverFairy.makeup).toContain("soft peach cinematic makeup");
    expect(peachRiverFairy.sceneEnvironment).toContain("古代石橋");
    expect(peachRiverFairy.sceneAction).toContain("gentle over-shoulder gaze");
    expect(peachRiverFairy.sceneLighting).toContain("golden hour sunlight");
    expect(coastalWuxia.category).toBe("桃花女俠｜江湖旅拍｜仙俠動作電影風");
    expect(coastalWuxia.layers.costumeLayer1).toContain("short silk inner dress");
    expect(coastalWuxia.layers.costumeLayer3).toContain("transparent green outer sleeves");
    expect(coastalWuxia.layers.costumeLayer10).toContain("wuxia coastal heroine");
    expect(coastalWuxia.makeup).toContain("fresh wuxia makeup");
    expect(coastalWuxia.sceneEnvironment).toContain("古代海邊村落");
    expect(coastalWuxia.sceneAction).toContain("bamboo staff");
    expect(coastalWuxia.sceneLighting).toContain("bright coastal sunlight");
    expect(tangPeonyFan.category).toBe("盛唐宮姬｜牡丹庭院｜宮廷旅拍");
    expect(tangPeonyFan.layers.costumeLayer1).toContain("white silk inner robe");
    expect(tangPeonyFan.layers.costumeLayer3).toContain("red phoenix outer robe");
    expect(tangPeonyFan.layers.costumeLayer7).toContain("royal folding fan");
    expect(tangPeonyFan.makeup).toContain("royal tang dynasty makeup");
    expect(tangPeonyFan.sceneEnvironment).toContain("牡丹花");
    expect(tangPeonyFan.sceneAction).toContain("gentle smile");
    expect(tangPeonyFan.sceneLighting).toContain("warm afternoon sunlight");
    expect(tangFlowerFestival.category).toBe("大唐花朝｜宮廷貴姬｜盛世古風電影");
    expect(tangFlowerFestival.layers.costumeLayer1).toContain("pink silk inner dress");
    expect(tangFlowerFestival.layers.costumeLayer6).toContain("luxury floral crown");
    expect(tangFlowerFestival.layers.costumeLayer10).toContain("cinematic noblewoman costume");
    expect(tangFlowerFestival.makeup).toContain("soft peony makeup");
    expect(tangFlowerFestival.sceneEnvironment).toContain("royal chinese pavilion");
    expect(tangFlowerFestival.sceneAction).toContain("holding floral round fan");
    expect(tangFlowerFestival.sceneLighting).toContain("warm sunset lighting");
    expect(cloudGoddess.category).toBe("天界神女｜仙宮神域｜東方神話電影");
    expect(cloudGoddess.layers.costumeLayer1).toContain("white silk inner gown");
    expect(cloudGoddess.layers.costumeLayer6).toContain("luxury heavenly crown");
    expect(cloudGoddess.layers.costumeLayer10).toContain("cinematic goddess costume");
    expect(cloudGoddess.makeup).toContain("soft divine makeup");
    expect(cloudGoddess.sceneEnvironment).toContain("golden cloud kingdom");
    expect(cloudGoddess.sceneAction).toContain("gentle reaching gesture");
    expect(cloudGoddess.sceneLighting).toContain("golden sunrise light");
    expect(frostQueen.category).toBe("冰霜夜宴魅姬｜哥德寢宮電影");
    expect(frostQueen.layers.costumeLayer1).toContain("冰藍黑絲綢貼身襯裙");
    expect(frostQueen.layers.costumeLayer6).toContain("冷白絲絨睡袍式外袍");
    expect(frostQueen.layers.costumeLayer10).toContain("cinematic cold dark romantic silhouette");
    expect(frostQueen.makeup).toContain("muted violet-gray eyeshadow");
    expect(frostQueen.sceneEnvironment).toContain("冰霜哥德夜宴寢宮");
    expect(frostQueen.sceneAction).toContain("水晶吊墜");
    expect(frostQueen.sceneLighting).toContain("cold blue moonlight");
    expect(osmanthusMoon.category).toBe("月下仙姬｜桂花宮苑｜中秋神話電影");
    expect(osmanthusMoon.layers.costumeLayer1).toContain("white silk underdress");
    expect(osmanthusMoon.layers.costumeLayer6).toContain("gold moon crown");
    expect(osmanthusMoon.layers.costumeLayer10).toContain("midautumn moon fairy");
    expect(osmanthusMoon.makeup).toContain("soft moonlight makeup");
    expect(osmanthusMoon.sceneEnvironment).toContain("gold osmanthus trees");
    expect(osmanthusMoon.sceneAction).toContain("holding jade bottle");
    expect(osmanthusMoon.sceneLighting).toContain("moonlight illumination");
    expect(zhouEmpress.category).toBe("大周女帝｜皇朝史詩｜宮廷電影風");
    expect(zhouEmpress.layers.costumeLayer1).toContain("imperial silk underrobe");
    expect(zhouEmpress.layers.costumeLayer6).toContain("phoenix empress crown");
    expect(zhouEmpress.layers.costumeLayer10).toContain("cinematic empress styling");
    expect(zhouEmpress.makeup).toContain("royal empress makeup");
    expect(zhouEmpress.sceneEnvironment).toContain("royal ministers kneeling");
    expect(zhouEmpress.sceneAction).toContain("seated empress posture");
    expect(zhouEmpress.sceneLighting).toContain("warm imperial firelight");
    expect(silkWashing.category).toBe("江南水鄉｜古風生活旅拍｜療癒系電影");
    expect(silkWashing.layers.costumeLayer1).toContain("white inner robe");
    expect(silkWashing.layers.costumeLayer5).toContain("jade hair accessory");
    expect(silkWashing.layers.costumeLayer10).toContain("Jiangnan slice-of-life");
    expect(silkWashing.makeup).toContain("natural soft makeup");
    expect(silkWashing.sceneEnvironment).toContain("washing silk fabric");
    expect(silkWashing.sceneAction).toContain("gentle hand movement");
    expect(silkWashing.sceneLighting).toContain("soft afternoon sunlight");
    expect(calligraphyLady.category).toBe("書香才女｜古典文人｜文藝電影風");
    expect(calligraphyLady.layers.costumeLayer1).toContain("white inner garment");
    expect(calligraphyLady.layers.costumeLayer4).toContain("jade tassel belt");
    expect(calligraphyLady.layers.costumeLayer10).toContain("literary lady silhouette");
    expect(calligraphyLady.aliases).toContain("白牡丹書香仕女");
    expect(calligraphyLady.layers.costumeLayer10).toContain("江南名門仕女典雅 silhouette");
    expect(calligraphyLady.makeup).toContain("soft literary makeup");
    expect(calligraphyLady.makeup).toContain("奶油白底妝");
    expect(calligraphyLady.scene).toContain("牡丹屏風");
    expect(calligraphyLady.sceneEnvironment).toContain("calligraphy brush");
    expect(calligraphyLady.sceneAction).toContain("mid-writing posture");
    expect(calligraphyLady.sceneLighting).toContain("window sunlight");
    expect(nightBanquet.category).toBe("夜宴貴姬｜古風宮廷｜夜景電影旅拍");
    expect(nightBanquet.layers.costumeLayer1).toContain("cream silk inner robe");
    expect(nightBanquet.layers.costumeLayer6).toContain("night palace jewelry");
    expect(nightBanquet.layers.costumeLayer10).toContain("palace evening noble-lady");
    expect(nightBanquet.makeup).toContain("warm evening makeup");
    expect(nightBanquet.sceneEnvironment).toContain("夜色宮廷長廊");
    expect(nightBanquet.sceneAction).toContain("flower letter card");
    expect(nightBanquet.sceneLighting).toContain("candlelight illumination");
    expect(coastalBegonia.category).toBe("海棠仙旅｜東方旅拍｜古風電影感");
    expect(coastalBegonia.layers.costumeLayer1).toContain("white inner garment");
    expect(coastalBegonia.layers.costumeLayer6).toContain("light floral hair accessories");
    expect(coastalBegonia.layers.costumeLayer10).toContain("cinematic eastern fantasy styling");
    expect(coastalBegonia.makeup).toContain("fresh spring makeup");
    expect(coastalBegonia.sceneEnvironment).toContain("seaside chinese pavilion");
    expect(coastalBegonia.sceneAction).toContain("touching cherry blossoms");
    expect(coastalBegonia.sceneLighting).toContain("bright spring daylight");
    expect(darkNecromancer.category).toBe("暗黑魔后｜亡靈王座｜哥德奇幻電影");
    expect(darkNecromancer.layers.costumeLayer1).toContain("black corset structure");
    expect(darkNecromancer.layers.costumeLayer6).toContain("crystal royal staff");
    expect(darkNecromancer.layers.costumeLayer10).toContain("cinematic necromancer queen costume");
    expect(darkNecromancer.makeup).toContain("dark queen makeup");
    expect(darkNecromancer.sceneEnvironment).toContain("undead gothic castle");
    expect(darkNecromancer.sceneAction).toContain("holding dark staff");
    expect(darkNecromancer.sceneLighting).toContain("blue moonlight");
    expect(fullmoonScepterQueen.category).toBe("暗黑王族｜滿月權杖｜哥德軍勢電影");
    expect(fullmoonScepterQueen.aliases).toContain("骷髏權杖女王");
    expect(fullmoonScepterQueen.makeup).toContain("不變成 AI 仙女臉");
    expect(fullmoonScepterQueen.layers.costumeLayer8).toContain("大型紅寶石骸骨權杖");
    expect(fullmoonScepterQueen.layers.costumeLayer10).toContain("滿月暗黑王族近景主視覺");
    expect(fullmoonScepterQueen.sceneEnvironment).toContain("巨大滿月");
    expect(fullmoonScepterQueen.sceneAction).toContain("不遮擋臉部");
    expect(fullmoonScepterQueen.sceneLighting).toContain("ruby candle glow");
    expect(lotusPondLady.category).toBe("荷塘仕女｜江南園林｜古風生活電影");
    expect(lotusPondLady.layers.costumeLayer1).toContain("pink silk inner robe");
    expect(lotusPondLady.layers.costumeLayer6).toContain("lotus floral hair ornaments");
    expect(lotusPondLady.layers.costumeLayer10).toContain("elegant summer styling");
    expect(lotusPondLady.makeup).toContain("soft lotus makeup");
    expect(lotusPondLady.sceneEnvironment).toContain("lotus pond garden");
    expect(lotusPondLady.sceneAction).toContain("holding umbrella and round fan");
    expect(lotusPondLady.sceneLighting).toContain("golden sunset light");
    expect(blackFeatherEnchantress.category).toBe("黑暗墮天使／黑羽史詩電影");
    expect(blackFeatherEnchantress.layers.costumeLayer1).toContain("black corset inner structure");
    expect(blackFeatherEnchantress.layers.costumeLayer6).toContain("fallen feather wing structure");
    expect(blackFeatherEnchantress.layers.costumeLayer10).toContain("黑羽墮天使史詩線而非夜宴魅魔線");
    expect(blackFeatherEnchantress.makeup).toContain("soft dark fantasy makeup");
    expect(blackFeatherEnchantress.sceneEnvironment).toContain("ruined gothic cathedral");
    expect(blackFeatherEnchantress.sceneAction).toContain("kneeling elegant pose");
    expect(blackFeatherEnchantress.sceneLighting).toContain("warm sunset god rays");
    expect(holySkyPaladin.category).toBe("聖域天使｜天空神國｜史詩奇幻電影");
    expect(holySkyPaladin.layers.costumeLayer1).toContain("white armored bodysuit");
    expect(holySkyPaladin.layers.costumeLayer5).toContain("celestial shoulder armor");
    expect(holySkyPaladin.layers.costumeLayer10).toContain("live-action fantasy realism");
    expect(holySkyPaladin.makeup).toContain("natural holy makeup");
    expect(holySkyPaladin.sceneEnvironment).toContain("floating heavenly kingdom");
    expect(holySkyPaladin.sceneAction).toContain("holding holy sword");
    expect(holySkyPaladin.sceneLighting).toContain("bright heavenly sunlight");
    expect(spiritBanquetEmpress.category).toBe("幽冥妖后｜亡魂夜宴｜東方暗黑奇幻");
    expect(spiritBanquetEmpress.layers.costumeLayer1).toContain("dark corset foundation");
    expect(spiritBanquetEmpress.layers.costumeLayer6).toContain("arcane crown halo");
    expect(spiritBanquetEmpress.layers.costumeLayer10).toContain("cinematic spirit queen costume");
    expect(spiritBanquetEmpress.makeup).toContain("purple fantasy makeup");
    expect(spiritBanquetEmpress.sceneEnvironment).toContain("moonlit spirit palace");
    expect(spiritBanquetEmpress.sceneAction).toContain("summoning spirit flame");
    expect(spiritBanquetEmpress.sceneLighting).toContain("purple magical glow");
    expect(flowerFerryLady.category).toBe("江南花渡｜水鄉古風｜東方電影旅拍");
    expect(flowerFerryLady.layers.costumeLayer1).toContain("pink silk inner robe");
    expect(flowerFerryLady.layers.costumeLayer7).toContain("floating silk outer drapery");
    expect(flowerFerryLady.layers.costumeLayer10).toContain("cinematic water-town costume");
    expect(flowerFerryLady.makeup).toContain("soft romantic makeup");
    expect(flowerFerryLady.sceneEnvironment).toContain("ancient riverside pavilion");
    expect(flowerFerryLady.sceneAction).toContain("holding floral fan");
    expect(flowerFerryLady.sceneLighting).toContain("golden sunset glow");
    expect(parisWitch.category).toBe("歐陸密教｜近代奇幻｜暮色懸疑電影");
    expect(parisWitch.layers.costumeLayer1).toContain("black velvet foundation slip");
    expect(parisWitch.layers.costumeLayer6).toContain("grey textured coat");
    expect(parisWitch.layers.costumeLayer10).toContain("cinematic occult Paris witch silhouette");
    expect(parisWitch.makeup).toContain("bold red lips");
    expect(parisWitch.sceneEnvironment).toContain("Notre-Dame Cathedral");
    expect(parisWitch.sceneAction).toContain("雙手交握");
    expect(parisWitch.sceneLighting).toContain("Blue Hour");
    expect(goldenOracle.category).toBe("古典神話｜希臘史詩｜神諭史詩電影");
    expect(goldenOracle.layers.costumeLayer1).toContain("ivory silk peplos");
    expect(goldenOracle.layers.costumeLayer9).toContain("intricate golden olive crown");
    expect(goldenOracle.layers.costumeLayer10).toContain("cinematic Greek oracle priestess silhouette");
    expect(goldenOracle.makeup).toContain("golden skin glow");
    expect(goldenOracle.sceneEnvironment).toContain("Parthenon Temple");
    expect(goldenOracle.sceneAction).toContain("指尖輕觸左肩");
    expect(goldenOracle.sceneLighting).toContain("Golden Hour Sunset");
    expect(darkWingPrincess.category).toBe("墮落天使｜末日神話｜魔幻史詩電影");
    expect(darkWingPrincess.layers.costumeLayer2).toContain("gothic metal corset");
    expect(darkWingPrincess.layers.costumeLayer6).toContain("massive dark wings");
    expect(darkWingPrincess.layers.costumeLayer10).toContain("apocalyptic fallen angel silhouette");
    expect(darkWingPrincess.makeup).toContain("dark crimson lips");
    expect(darkWingPrincess.sceneEnvironment).toContain("decaying gothic pillars");
    expect(darkWingPrincess.sceneAction).toContain("mythic dark glaive");
    expect(darkWingPrincess.sceneLighting).toContain("Volumetric Storm Light");
    expect(vampireCountess.category).toBe("血族神話｜哥德歌劇｜吸血鬼暗黑電影");
    expect(vampireCountess.scene).toContain("血月古堡夫人");
    expect(vampireCountess.layers.costumeLayer2).toContain("lace gothic corset");
    expect(vampireCountess.layers.costumeLayer7).toContain("dark purple wings");
    expect(vampireCountess.layers.costumeLayer10).toContain("gothic vampire countess silhouette");
    expect(vampireCountess.layers.costumeLayer10).toContain("血月夜宴夫人 silhouette");
    expect(vampireCountess.makeup).toContain("glossy red lips");
    expect(vampireCountess.sceneEnvironment).toContain("stained glass window");
    expect(vampireCountess.sceneEnvironment).toContain("血月古堡露台");
    expect(vampireCountess.sceneAction).toContain("graceful gait");
    expect(vampireCountess.sceneAction).toContain("單手持黑玫瑰");
    expect(vampireCountess.sceneLighting).toContain("gothic balanced key light");
    expect(vampireCountess.sceneLighting).toContain("blood moon cold light");
    expect(olympusSaint.category).toBe("神話紀實｜歷史史詩｜文藝復興電影");
    expect(olympusSaint.layers.costumeLayer1).toContain("pure white cotton-linen inner gown");
    expect(olympusSaint.layers.costumeLayer5).toContain("embroidered golden belt");
    expect(olympusSaint.layers.costumeLayer10).toContain("Olympus saint historical silhouette");
    expect(olympusSaint.makeup).toContain("nude peach lips");
    expect(olympusSaint.sceneEnvironment).toContain("The Parthenon");
    expect(olympusSaint.sceneAction).toContain("放鬆站姿");
    expect(olympusSaint.sceneLighting).toContain("warm lens flare");
    expect(baroqueCountess.category).toBe("室內宮廷｜古典懸疑｜巴洛克黑色電影");
    expect(baroqueCountess.scene).toContain("暗夜假面伯爵夫人");
    expect(baroqueCountess.layers.costumeLayer2).toContain("gothic velvet corset");
    expect(baroqueCountess.layers.costumeLayer5).toContain("金屬紅寶石腰封");
    expect(baroqueCountess.layers.costumeLayer8).toContain("intricate gold necklaces");
    expect(baroqueCountess.layers.costumeLayer10).toContain("baroque noir countess silhouette");
    expect(baroqueCountess.layers.costumeLayer10).toContain("哥德夜宴女王");
    expect(baroqueCountess.makeup).toContain("vampy dark red lips");
    expect(baroqueCountess.sceneEnvironment).toContain("etched marble wall");
    expect(baroqueCountess.sceneEnvironment).toContain("黑玫瑰歌劇廳");
    expect(baroqueCountess.sceneAction).toContain("食指輕托下巴");
    expect(baroqueCountess.sceneAction).toContain("單手持面具權杖");
    expect(baroqueCountess.sceneLighting).toContain("Chiaroscuro lighting");
    expect(baroqueCountess.sceneLighting).toContain("stage spotlight");
    expect(silkRoadHistorian.category).toBe("絲路旅人｜西域長歌｜大漠電影旅拍");
    expect(silkRoadHistorian.layers.costumeLayer1).toContain("soft white inner robe");
    expect(silkRoadHistorian.layers.costumeLayer7).toContain("wind-reactive silk drapery");
    expect(silkRoadHistorian.layers.costumeLayer10).toContain("cinematic silk layering");
    expect(silkRoadHistorian.makeup).toContain("natural cinematic makeup");
    expect(silkRoadHistorian.sceneEnvironment).toContain("silk road desert camp");
    expect(silkRoadHistorian.sceneAction).toContain("holding travel scroll");
    expect(silkRoadHistorian.sceneLighting).toContain("golden sunset lighting");
    expect(moonlitDanceFairy.category).toBe("月下飛仙｜古風舞姬｜仙俠奇幻電影");
    expect(moonlitDanceFairy.layers.costumeLayer1).toContain("blue silk inner dress");
    expect(moonlitDanceFairy.layers.costumeLayer1).toContain("紫色貼身絲質中衣");
    expect(moonlitDanceFairy.layers.costumeLayer4).toContain("floating celestial ribbons");
    expect(moonlitDanceFairy.layers.costumeLayer4).toContain("超長透明紫紗水袖");
    expect(moonlitDanceFairy.layers.costumeLayer4).toContain("月光披帛");
    expect(moonlitDanceFairy.layers.costumeLayer10).toContain("dynamic ribbon movement silhouette");
    expect(moonlitDanceFairy.layers.costumeLayer10).toContain("月夜宮廷舞姬 silhouette");
    expect(moonlitDanceFairy.makeup).toContain("moonlit fantasy makeup");
    expect(moonlitDanceFairy.makeup).toContain("冷紫調眼妝");
    expect(moonlitDanceFairy.scene).toContain("月庭紫霄舞姬");
    expect(moonlitDanceFairy.scene).toContain("月夜樓閣");
    expect(moonlitDanceFairy.sceneEnvironment).toContain("ancient moonlit city");
    expect(moonlitDanceFairy.sceneEnvironment).toContain("月夜宮廷樓閣");
    expect(moonlitDanceFairy.sceneAction).toContain("raised-arm dance movement");
    expect(moonlitDanceFairy.sceneAction).toContain("雙臂展開舞袖");
    expect(moonlitDanceFairy.sceneLighting).toContain("cool moonlight contrast");
    expect(moonlitDanceFairy.sceneLighting).toContain("月光柔和邊緣分離光");
    expect(cloudCultivationGuardian.category).toBe("雲巔仙宗｜修真古境｜仙俠電影");
    expect(cloudCultivationGuardian.layers.costumeLayer1).toContain("white inner cultivation robe");
    expect(cloudCultivationGuardian.layers.costumeLayer6).toContain("immortal hair ornaments");
    expect(cloudCultivationGuardian.layers.costumeLayer10).toContain("live-action immortal realism");
    expect(cloudCultivationGuardian.makeup).toContain("clean immortal makeup");
    expect(cloudCultivationGuardian.sceneEnvironment).toContain("floating mountain temple");
    expect(cloudCultivationGuardian.sceneAction).toContain("holding ancient scroll");
    expect(cloudCultivationGuardian.sceneLighting).toContain("high-altitude daylight");
    expect(coldRiverSpirit.category).toBe("聊齋志異／幽冥系列");
    expect(coldRiverSpirit.layers.costumeLayer1).toContain("sheer moon-silk");
    expect(coldRiverSpirit.layers.costumeLayer3).toContain("pale ash ceremonial textile");
    expect(coldRiverSpirit.layers.costumeLayer9).toContain("minimal ghostly hair ornament");
    expect(coldRiverSpirit.makeup).toContain("cold moonlit cinematic skin texture");
    expect(coldRiverSpirit.sceneEnvironment).toContain("殘破渡口");
    expect(coldRiverSpirit.sceneAction).toContain("單手持紙傘");
    expect(coldRiverSpirit.sceneLighting).toContain("moonlit fog illumination");
    expect(coldMoonSword.category).toBe("仙俠修真／月夜劍修");
    expect(coldMoonSword.layers.costumeLayer1).toContain("translucent frost chiffon");
    expect(coldMoonSword.layers.costumeLayer3).toContain("pale celestial blue textile");
    expect(coldMoonSword.layers.costumeLayer9).toContain("celestial sword-princess crown");
    expect(coldMoonSword.makeup).toContain("cool moonlit cinematic skin texture");
    expect(coldMoonSword.sceneEnvironment).toContain("寒月仙城夜境");
    expect(coldMoonSword.sceneAction).toContain("單手持劍前指");
    expect(coldMoonSword.sceneLighting).toContain("cold blue soft edge separation lighting");
    expect(violetUnderworld.category).toBe("黑暗奇幻／冥界妖后");
    expect(violetUnderworld.layers.costumeLayer1).toContain("translucent violet chiffon");
    expect(violetUnderworld.layers.costumeLayer5).toContain("skull-emblem embroidery");
    expect(violetUnderworld.layers.costumeLayer9).toContain("ornate necromancer crown");
    expect(violetUnderworld.makeup).toContain("dark moonlit cinematic skin texture");
    expect(violetUnderworld.sceneEnvironment).toContain("巨大骸骨王座");
    expect(violetUnderworld.sceneAction).toContain("單手托舉紫焰靈火");
    expect(violetUnderworld.sceneLighting).toContain("purple ghost-flame lighting");
    expect(whiteFox.category).toBe("聊齋志異／狐仙系列");
    expect(whiteFox.layers.costumeLayer1).toContain("sheer moon-silk");
    expect(whiteFox.layers.costumeLayer3).toContain("pale ivory ceremonial textile");
    expect(whiteFox.layers.costumeLayer10).toContain("cinematic white fox maiden silhouette");
    expect(whiteFox.makeup).toContain("moonlit cinematic skin texture");
    expect(whiteFox.sceneEnvironment).toContain("白狐");
    expect(whiteFox.sceneAction).toContain("單手微抬");
    expect(whiteFox.sceneLighting).toContain("moonlit forest illumination");
    expect(tangConsort.category).toBe("大唐宮廷／盛世貴妃系列");
    expect(tangConsort.layers.costumeLayer1).toContain("peach-gold silk foundation");
    expect(tangConsort.layers.costumeLayer3).toContain("embroidered peony brocade");
    expect(tangConsort.layers.costumeLayer8).toContain("layered phoenix crown structure");
    expect(tangConsort.makeup).toContain("warm imperial cinematic skin texture");
    expect(tangConsort.sceneEnvironment).toContain("盛唐皇城春日宮苑");
    expect(tangConsort.sceneAction).toContain("雙手自然交疊");
    expect(tangConsort.sceneLighting).toContain("golden-hour imperial lighting");
    const purpleMoonProfile = WORLD_LAYER_PROFILES.find((profile) => profile.id === "purple-moon-night-court-empress");
    const tangFlowerFestivalProfile = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-flower-festival-noble-lady");

    expect(purpleMoonProfile.scene).toContain("星淵紫庭魔后");
    expect(purpleMoonProfile.layers.costumeLayer2).toContain("紫晶馬甲結構");
    expect(purpleMoonProfile.layers.costumeLayer10).toContain("宇宙魔后壓迫式 silhouette");
    expect(purpleMoonProfile.sceneAction).toContain("雙手操控紫色能量球");
    expect(purpleMoonProfile.sceneLighting).toContain("宇宙 soft edge separation light");
    expect(tangFlowerFestivalProfile.scene).toContain("大唐春殿樂姬");
    expect(tangFlowerFestivalProfile.layers.costumeLayer1).toContain("粉色絲質貼身內襯");
    expect(tangFlowerFestivalProfile.sceneEnvironment).toContain("紅柱宮殿長廊");
    expect(tangFlowerFestivalProfile.sceneAction).toContain("一手扶柱");
    expect(tangFlowerFestivalProfile.sceneLighting).toContain("volumetric light");

    const templeDancer = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-western-temple-dancer");
    const westernPriestess = WORLD_LAYER_PROFILES.find((profile) => profile.id === "tang-western-temple-priestess");
    const moonEclipseSaint = WORLD_LAYER_PROFILES.find((profile) => profile.id === "moon-eclipse-ancient-temple-saint");
    const tigerSwordswoman = WORLD_LAYER_PROFILES.find((profile) => profile.id === "autumn-tiger-road-swordswoman");
    const puppetQueen = WORLD_LAYER_PROFILES.find((profile) => profile.id === "marionette-theater-soul-dominion");
    const arcticQueen = WORLD_LAYER_PROFILES.find((profile) => profile.id === "arctic-icefield-queen");
    const nightMusician = WORLD_LAYER_PROFILES.find((profile) => profile.id === "changan-night-banquet-musician");
    const darkDomainQueen = WORLD_LAYER_PROFILES.find((profile) => profile.id === "dark-domain-ancient-temple-queen");
    const qingluanSaint = WORLD_LAYER_PROFILES.find((profile) => profile.id === "qingluan-temple-hidden-saint");

    expect(templeDancer.sceneEnvironment).toContain("全身完整入鏡");
    expect(templeDancer.sceneLighting).toContain("volumetric light haze");
    expect(westernPriestess.sceneLighting).toContain("floating dust particles");
    expect(moonEclipseSaint.sceneLighting).toContain("dreamy atmospheric bokeh");
    expect(tigerSwordswoman.sceneLighting).toContain("realistic air perspective");
    expect(puppetQueen.sceneLighting).toContain("natural lens bloom");
    expect(arcticQueen.sceneLighting).toContain("dreamy atmospheric bokeh");
    expect(nightMusician.sceneLighting).toContain("floating petals");
    expect(nightMusician.layers.costumeLayer7).toContain("盛唐花宴主視覺");
    expect(nightMusician.makeup).toContain("朱紅花鈿");
    expect(nightMusician.sceneLighting).toContain("volumetric light haze");
    expect(nightMusician.scene).toContain("真人身份保留");
    expect(nightMusician.sceneEnvironment).toContain("宴席群演");
    expect(nightMusician.sceneEnvironment).toContain("祖母綠帷幕");
    expect(nightMusician.sceneLighting).toContain("vivid luxury color grading");
    expect(nightMusician.sceneLighting).toContain("jewel-tone highlights");
    expect(darkDomainQueen.layers.costumeLayer10).toContain("月蝕古殿不朽聖女");
    expect(darkDomainQueen.scene).toContain("長安夜宴暗影刺客");
    expect(darkDomainQueen.scene).toContain("月蝕古殿不朽聖女／不朽祭司");
    expect(darkDomainQueen.sceneAction).toContain("雙腳平穩著地挺拔站立");
    expect(darkDomainQueen.sceneLighting).toContain("冷霧與 floating dust particles");
    expect(qingluanSaint.category).toBe("東方玄幻史詩電影");
    expect(qingluanSaint.layers.costumeLayer7).toContain("非對稱青羽肩飾");
    expect(qingluanSaint.layers.costumeLayer8).toContain("天然翡翠禁步");
    expect(qingluanSaint.makeup).toContain("淡青色眼尾微光");
    expect(qingluanSaint.sceneEnvironment).toContain("斑駁佛像浮雕");
    expect(qingluanSaint.sceneAction).toContain("端莊盤腿坐於石質地面");
    expect(qingluanSaint.sceneLighting).toContain("volumetric light haze");
    expect(moonEclipseSaint.scene).toContain("崑崙雪夜聖女");
    expect(moonEclipseSaint.scene).toContain("崑崙冰原祭祀天女");
    expect(moonEclipseSaint.scene).toContain("月蝕神殿白虎聖女");
    expect(moonEclipseSaint.sceneEnvironment).toContain("佛像浮雕");
    expect(moonEclipseSaint.sceneAction).toContain("左手或右手自然搭在巨型白虎頭頂");
    expect(tigerSwordswoman.layers.costumeLayer4).toContain("絲路皇妃女俠客");
    expect(tigerSwordswoman.layers.costumeLayer4).toContain("樓蘭沙海黃沙皇妃");
    expect(tigerSwordswoman.makeup).toContain("乾燥健康小麥色");
    expect(tigerSwordswoman.scene).toContain("絲路沙海異域女俠");
    expect(tigerSwordswoman.scene).toContain("絲路沙海異域祭司");
    expect(tigerSwordswoman.sceneEnvironment).toContain("全身跟拍中遠景");
    expect(puppetQueen.layers.costumeLayer5).toContain("非對稱黑烏羽飾");
    expect(puppetQueen.makeup).toContain("局部亮片反光");
    expect(puppetQueen.scene).toContain("墮羽夜庭魔界王后");
    expect(puppetQueen.scene).toContain("墮羽夜庭黑翼王后");
    expect(puppetQueen.sceneAction).toContain("扯動緊繃的銀色鋼絲");
    expect(puppetQueen.sceneLighting).toContain("volumetric light haze");

    for (const [id, title, layerKeyword, sceneKeyword] of BATCH_PROFILE_EXPECTATIONS) {
      const profile = WORLD_LAYER_PROFILES.find((item) => item.id === id);
      expect(profile).toBeTruthy();
      expect(profile.title).toBe(title);
      expect(Object.values(profile.layers).join("\n")).toContain(layerKeyword);
      expect(`${profile.scene}\n${profile.sceneEnvironment}`).toContain(sceneKeyword);
    }
  });

  it("keeps night-banquet charm profiles soft, cinematic, and separate from black-wing epic templates", () => {
    const charmIds = [
      "dark-succubus",
      "abyss-spider-enchantress",
      "blood-moon-spider-empress",
      "frost-succubus-gothic-queen",
      "moon-weaving-dream-enchantress",
    ];
    const profiles = charmIds.map((id) => WORLD_LAYER_PROFILES.find((profile) => profile.id === id));

    for (const profile of profiles) {
      const text = [
        profile.title,
        profile.category,
        profile.scene,
        profile.sceneEnvironment,
        profile.sceneAction,
        profile.sceneLighting,
        ...Object.values(profile.layers),
      ].join(" ");

      expect(text).toMatch(/絲綢|silk/);
      expect(text).toMatch(/睡袍式|robe|絲絨/);
      expect(text).toMatch(/薄紗|雪紡|蕾絲|chiffon|gauze|lace/);
      expect(text).toMatch(/燭|candle|寢宮|chamber/);
      expect(text).not.toMatch(/洞窟|巢穴|蝙蝠翼|bat wing|戰甲/i);
    }

    const blackWing = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fallen-black-feather-enchantress");
    expect(blackWing.category).toBe("黑暗墮天使／黑羽史詩電影");
    expect(blackWing.layers.costumeLayer10).toContain("非夜宴魅魔線");
  });

  it("raises generated prompts from character sheet to preserved-identity commercial fantasy visual language", () => {
    const prompt = buildPrompt({
      theme: "長安夜宴樂姬",
      scene: "長安盛唐花宴大殿",
      cameraFraming: "全身",
    });

    expect(prompt).toContain("總控：preserved real-person identity first");
    expect(prompt).toContain("preserved real-person identity");
    expect(prompt).toContain("recognizable original face");
    expect(prompt).toContain("dominant silhouette");
    expect(prompt).toContain("vivid jewel-tone grading");
    expect(prompt).toContain("jewel-tone highlights");
    expect(prompt).toContain("red-gold lantern glow");
    expect(prompt).toContain("ruby red silk");
    expect(prompt).toContain("真人身份保留的東方奇幻電影主視覺");
    expect(prompt).toContain("preserved-real-identity eastern fantasy key visual");
    expect(prompt).toContain("deep garnet velvet");
    expect(prompt).toContain("emerald drapery");
    expect(prompt).toContain("wet floor color reflection");
    expect(prompt).toContain("airborne translucent shawls");
    expect(prompt).toContain("cinematic trailing sleeves");
    expect(prompt).toContain("宴會群演");
    expect(prompt).toContain("畫面事件");
    expect(prompt).toContain("動作鏡頭語言");
    expect(prompt).toContain("盛唐夜宴女主角穿過燈籠與花瓣回身");
    expect(prompt).toContain("50mm eye-level cinematic blocking");
    expect(prompt).toContain("臉部完整可見");
    expect(prompt).toContain("肩頸、胸腔、骨盆與雙腳重心符合真實成年人體結構");
    expect(prompt).toContain("cinematic reveal");
    expect(prompt).toContain("visual narrative");
    expect(prompt).toContain("電影主視覺：");
    expect(prompt).toContain("長安宮廷花宴");
    expect(prompt).toContain("紅金夜宴大殿");
    expect(prompt).not.toContain("Character Sheet");
    expect(prompt).not.toContain("AI 必須");
    expect(prompt).not.toContain("明確排除");
    expect(prompt).not.toContain("Primary Read 70%");
    expect(prompt).not.toContain("Hero Shot");
    expect(prompt).not.toContain("heroine screen presence");
    expect(prompt).not.toContain("暗紫絲絨寢宮");
    expect(prompt).not.toContain("不要");
  });

  it("supports vivid visual weight controls without changing the five-field output shape", () => {
    const darkBanquet = buildPrompt({
      theme: "紫蝶夜宴魅魔",
      scene: "暗紫絲絨寢宮",
      visualMode: "暗黑夜宴",
      colorIntensity: "暗紫酒紅",
      fabricMotion: "大動態飄紗",
    });
    const netflixMode = buildPrompt({
      theme: "白牡丹書香仕女",
      scene: "中式書房牡丹屏風",
      visualMode: "Netflix 東方奇幻",
      colorIntensity: "盛唐花宴",
      fabricMotion: "靜態垂墜",
    });

    expect(darkBanquet).toContain("主視覺模式：暗黑夜宴電影");
    expect(darkBanquet).toContain("amethyst violet atmosphere");
    expect(darkBanquet).toContain("deep wine-red silk");
    expect(darkBanquet).toContain("extra-long flowing silk drapery");
    expect(darkBanquet).toContain("暗紫絲絨寢宮");
    expect(darkBanquet).toContain("夜宴魅姬式緩慢轉身");
    expect(darkBanquet).toContain("單手輕扶絲絨外袍");
    expect(darkBanquet).toContain("另一手自然帶起半透明薄紗");
    expect(darkBanquet).toContain("眼神越過燭光直視鏡頭");
    expect(netflixMode).toContain("主視覺模式：真人身份保留的東方奇幻電影主視覺");
    expect(netflixMode).toContain("preserved-real-identity eastern fantasy key visual");
    expect(netflixMode).toContain("peony crimson");
    expect(netflixMode).toContain("重點放在真實布料重量、絲綢反光、裙襬堆疊");
    expect(darkBanquet).toContain("分類：");
    expect(darkBanquet).toContain("主題：");
    expect(darkBanquet).toContain("服裝：");
    expect(darkBanquet).toContain("妝容：");
    expect(darkBanquet).toContain("場景：");
    expect(darkBanquet).not.toContain("角色定位：");
    expect(darkBanquet).not.toContain("AI 必須");
    expect(darkBanquet).not.toContain("明確排除安靜寫實路線");
    expect(darkBanquet).not.toContain("不要灰藍低飽和");
    expect(darkBanquet).not.toContain("場景可加入");
    expect(darkBanquet).not.toContain("不要");
    expect(netflixMode).not.toContain("主視覺模式：電影角色設定檔");
    expect(netflixMode).not.toContain("柔和電影主調");
  });

  it("keeps template prompts concise by using supplemental director notes instead of repeating filled fields", () => {
    const fullmoon = WORLD_LAYER_PROFILES.find((profile) => profile.id === "fullmoon-skull-scepter-queen");
    const prompt = buildPrompt({
      category: fullmoon.category,
      theme: fullmoon.themeHint,
      makeup: fullmoon.makeup,
      scene: fullmoon.scene,
      sceneEnvironment: fullmoon.sceneEnvironment,
      sceneAction: fullmoon.sceneAction,
      sceneLighting: fullmoon.sceneLighting,
      ...fullmoon.layers,
    });

    expect(prompt.length).toBeLessThan(3100);
    expect(prompt).toContain("空間層級補強");
    expect(prompt).toContain("動作鏡頭語言補強");
    expect(prompt).toContain("光影補強");
    expect(prompt).toContain("最高優先保留原始臉型");
    expect(prompt).toContain("不變成 AI 仙女臉");
    expect((prompt.match(/silhouette/g) || []).length).toBeLessThanOrEqual(2);
    expect((prompt.match(/ruby/g) || []).length).toBeLessThanOrEqual(3);
    expect(prompt).not.toContain("動作鏡頭語言：人物採近景半身");
    expect(prompt).not.toContain("場景以可拍攝的近景、中景、遠景建立電影空間");
  });

  it("allows optional director-layer fields to override visual focus and frame event", () => {
    const prompt = buildPrompt({
      theme: "黑金盛唐夜宴女王",
      scene: "長安夜宴宮殿",
      visualFocus: "紅金披帛形成巨大 S 型流線，女主角眼神與動態袖幅是第一焦點",
      frameEvent: "她剛穿過燭火與花瓣回身，群演與燈籠在遠景襯托她出場",
    });

    expect(prompt).toContain("電影主視覺：紅金披帛形成巨大 S 型流線");
    expect(prompt).toContain("畫面事件：她剛穿過燭火與花瓣回身");
    expect(prompt).toContain("動作鏡頭語言");
    expect(prompt).toContain("布料、披帛、長袖、外袍或髮絲跟隨動作產生可拍攝的 visual leading lines");
    expect(prompt).toContain("movie still");
    expect(prompt).not.toContain("Primary Read 70%");
    expect(prompt).not.toContain("不要把所有元素平均塞進畫面");
    expect(prompt).not.toContain("不要生成");
  });

  it("adds dark royal mature body presence only for dark fantasy categories", () => {
    const darkRoyal = buildPrompt({
      category: "奇幻異世界 / 暗黑王族",
      theme: "暗夜王座女王",
      scene: "哥德王座廳",
    });
    const changan = buildPrompt({
      category: "中國朝代古裝 / 中國神話",
      theme: "長安夜宴樂姬",
      scene: "長安盛唐花宴大殿",
    });
    const inferredDarkRoyal = buildPrompt({
      theme: "紫蝶夜宴魅魔",
      scene: "暗紫絲絨寢宮",
    });

    expect(darkRoyal).toContain("暗黑王族身形預設");
    expect(darkRoyal).toContain("成熟豐滿但真實的成年女性體積感");
    expect(darkRoyal).toContain("真實人體骨架追加：罩杯:J");
    expect(darkRoyal).toContain("couture support");
    expect(darkRoyal).toContain("真實胸腔厚度");
    expect(darkRoyal).toContain("視覺焦點集中在黑暗王族氣場");
    expect(inferredDarkRoyal).toContain("真實人體骨架追加：罩杯:J");
    expect(darkRoyal).not.toContain("不做動漫誇張身材");
    expect(changan).not.toContain("暗黑王族身形預設");
    expect(changan).not.toContain("罩杯:J");
  });

  it("builds an identity-first cinematic prompt", () => {
    const prompt = buildPrompt({
      category: "世界地標旅拍",
      theme: "巴黎黃昏旅拍女主",
      ratio: "9:16",
    });

    expect(prompt).toContain("【輸出格式】");
    expect(prompt).toContain("分類：世界地標旅拍");
    expect(prompt).toContain("主題：巴黎黃昏旅拍女主");
    expect(prompt).toContain("服裝：");
    expect(prompt).toContain("妝容：");
    expect(prompt).toContain("場景：依據「巴黎黃昏旅拍女主」建立電影場景");
    expect(prompt).not.toContain("主題格式規則：");
    expect(prompt).not.toContain("正確方向：大唐西域公主");
    expect(prompt).not.toContain("角色定位：");
    expect(prompt).not.toContain("臉部辨識優先權：");
    expect(prompt).not.toContain("動作與鏡頭：");
    expect(prompt).not.toContain("光影與攝影：");
    expect(prompt).not.toContain("輸出比例：");
    expect(prompt).not.toContain("負面規則：");
    expect(prompt).not.toContain("【真人電影級 AI 咒語建檔系統｜完整版母板 V2.0】");
    expect(prompt).not.toContain("【真人身份鎖定】");
    expect(prompt).not.toContain("【本次出圖關鍵補足｜貼在核心咒語規範後方】");
    expect(prompt).not.toContain("********** 使用規範 **********");
    expect(prompt).toContain("近景 / 中景 / 遠景");
    expect(prompt).toContain("角色情緒動作");
  });

  it("requires theme before building", () => {
    expect(() => buildPrompt({ scene: "雨夜街道" })).toThrow("主題為必填欄位");
  });

  it("uses explicit costume layers when provided", () => {
    const prompt = buildPrompt({
      theme: "紫蝶夜宴魅魔",
      costume: "dark romantic gothic couture, luxury silk robe, velvet chamber",
      costumeLayer1: "skin-tight black silk inner lining",
      costumeLayer2: "lace-trim couture support",
      costumeLayer8: "luxury gemstone chains and gothic jewelry",
    });

    expect(prompt).toContain("服裝：");
    expect(prompt).toContain("dark romantic gothic couture");
    expect(prompt).toContain("服裝 Layer 參考");
    expect(prompt).toContain("服裝主視覺集中在主輪廓");
    expect(prompt).toContain("L1: skin-tight black silk inner lining");
    expect(prompt).toContain("L8: luxury gemstone chains and gothic jewelry");
    expect(prompt).not.toContain("L2: lace-trim couture support");
  });

  it("normalizes obsolete output mode without changing the clean five-field prompt shape", () => {
    const prompt = buildPrompt({
      theme: "賽博都市特工",
      outputMode: "compact",
      scene: "雨夜霓虹街道",
      costume: "霧面機能長外套",
    });

    expect(prompt).toContain("【輸出格式】");
    expect(prompt).toContain("主題：賽博都市特工");
    expect(prompt).not.toContain("主題格式規則：");
    expect(prompt).not.toContain("正確方向：大唐西域公主");
    expect(prompt).not.toContain("臉部辨識優先權：");
    expect(prompt).not.toContain("動作與鏡頭：");
    expect(prompt).toContain("服裝：霧面機能長外套");
    expect(prompt).not.toContain("visual priority");
  });

  it("expands short costume text into a cinematic layer system", () => {
    const form = expandCostumeToLayers({
      theme: "紫蝶夜宴魅魔",
      costume: "紫色蝴蝶 蕾絲邊 睡袍式禮服 哥德式配件 鍊條 透明紗",
    });
    const prompt = buildPrompt(form);

    expect(form.costumeLayer1).toContain("紫色蕾絲邊");
    expect(form.costumeLayer4).toContain("蝴蝶");
    expect(form.costumeLayer6).toContain("透明紗");
    expect(form.costumeLayer8).toContain("鍊條");
    expect(prompt).toContain("L1:");
    expect(prompt).not.toContain("L10:");
    expect(prompt).toContain("Layer 細節自然融入高訂戲服");
  });

  it("overwrites stale costume layers with Tang dynasty layer expansion", () => {
    const form = expandCostumeToLayers({
      theme: "大唐西域公主",
      costume: "大唐公主重工刺繡襦裙 金絲披帛 玉石步搖 真實絲綢垂墜",
      costumeLayer1: "舊資料不應保留",
    });

    expect(form.costumeLayer1).toContain("柔白絲綢貼身內襯");
    expect(form.costumeLayer4).toContain("重工刺繡襦裙");
    expect(form.costumeLayer6).toContain("金絲披帛");
    expect(form.costumeLayer8).toContain("玉石步搖");
    expect(form.costumeLayer1).not.toContain("舊資料不應保留");
  });

  it("expands scene text into director fields and uses them in output", () => {
    const form = expandSceneToDirectorFields({
      theme: "暗夜王座女王",
      scene: "哥德式石柱王座廳",
      cameraFraming: "膝蓋以上",
    });
    const prompt = buildPrompt(form);

    expect(form.sceneEnvironment).toContain("哥德式石柱王座廳");
    expect(form.sceneEnvironment).toContain("近景");
    expect(form.sceneEnvironment).toContain("遠景");
    expect(form.sceneAction).toContain("夜宴魅姬式緩慢轉身");
    expect(form.sceneAction).toContain("身體三分之一側向鏡頭");
    expect(form.sceneAction).toContain("50mm eye-level cinematic blocking");
    expect(form.sceneAction).toContain("臉部完整清楚");
    expect(form.sceneAction).toContain("肩頸、胸腔、骨盆與雙腳重心符合真實成年人體結構");
    expect(form.sceneCamera).toContain("50mm");
    expect(form.sceneCamera).toContain("中遠景");
    expect(form.sceneCamera).toContain("人物構圖：膝蓋以上");
    expect(form.sceneLighting).toContain("真實光源邏輯");
    expect(form.sceneLighting).toContain("空氣透視");
    expect(prompt).toContain("環境：");
    expect(prompt).toContain("動作：");
    expect(prompt).toContain("鏡頭：");
    expect(prompt).toContain("光影：");
  });

  it("normalizes invalid controls to safe defaults", () => {
    const form = normalizeForm({ theme: "絕美女神", scene: "雨夜街道", ratio: "bad-ratio", cameraFraming: "超近臉部" });
    expect(form.theme).toBe("真人電影角色真人電影角色");
    expect(form.scene).toBe("雨夜街道");
    expect(form.ratio).toBe("9:16");
    expect(form.cameraFraming).toBe("全身");
  });

  it("replaces risky beauty language before prompt assembly", () => {
    expect(sanitizeInput("絕美女神 網紅感 少女感")).toBe("真人電影角色真人電影角色 真人電影角色 真人電影角色");
    expect(sanitizeInput("精緻五官 大眼睛 小V臉")).toBe("原始真人五官 原始真人五官 原始真人五官");
    expect(sanitizeInput("anime girl waifu Vogue supermodel")).toBe(
      "真人電影世界觀 真人電影世界觀 commercial fantasy cinema key visual cinematic film still",
    );
    expect(sanitizeInput("巨乳 seductive pin-up NSFW")).toBe("高級電影魅力 高級電影魅力 高級電影魅力");
  });

  it("assesses risky theme wording and suggests role-positioning rewrites", () => {
    const risky = assessThemeInput("高冷仙氣女神");
    const styleOnly = assessThemeInput("賽博朋克");
    const safe = assessThemeInput("大唐西域公主");

    expect(risky.level).toBe("danger");
    expect(risky.issues[0].name).toBe("AI 美女模板詞");
    expect(risky.suggestion).toBe("雲海仙門聖女");
    expect(styleOnly.level).toBe("danger");
    expect(styleOnly.suggestion).toBe("賽博都市特工");
    expect(safe.level).toBe("ok");
    expect(suggestThemeRewrite("哥德御姐")).toBe("哥德王座女王");
  });

  it("wraps the prompt for ChatGPT image generation", () => {
    const instruction = buildChatGptInstruction({ theme: "雲海仙門旅拍" });
    expect(instruction).toContain("【真人電影級 AI 電影角色系統｜V4.0 Ultimate】");
    expect(instruction).toContain("真人演員被拍進奇幻世界");
    expect(instruction).toContain("原始臉型");
    expect(instruction).toContain("原始眼型");
    expect(instruction).toContain("原始鼻型");
    expect(instruction).toContain("【Facial Identity Lock｜最高優先】");
    expect(instruction).toContain("Do NOT redesign the face.");
    expect(instruction).toContain("Do NOT beautify the face.");
    expect(instruction).toContain("original eyelid structure");
    expect(instruction).toContain("The fantasy world exists around the real photographed person");
    expect(instruction).toContain("50mm 全片幅中遠景電影構圖");
    expect(instruction).toContain("【輸出格式】");
    expect(instruction).toContain("分類：");
    expect(instruction).toContain("服裝：");
    expect(instruction).toContain("【最高核心原則】");
    expect(instruction).toContain("【負面咒語系統】");
    expect(instruction.indexOf("分類：")).toBeGreaterThan(instruction.indexOf("【輸出格式】"));
    expect(instruction.indexOf("分類：")).toBeLessThan(instruction.indexOf("【最終核心】"));
    expect(instruction).not.toContain("==================================================");
    expect(instruction).not.toContain("********** 使用規範 **********");
    expect(instruction).not.toContain("### Layer 1");
    expect(instruction).not.toContain("Primary Read");
    expect(instruction).toContain("雲海仙門旅拍");
    expect(instruction).not.toContain("罩杯:J");
  });

  it("injects the dark royal cup preset into the fixed skeleton section only for dark fantasy instructions", () => {
    const darkInstruction = buildChatGptInstruction({
      category: "奇幻異世界 / 暗黑王族",
      theme: "紫蝶夜宴魅魔",
      scene: "暗紫絲絨寢宮",
    });
    const normalInstruction = buildChatGptInstruction({
      category: "中國朝代古裝 / 中國神話",
      theme: "長安夜宴樂姬",
      scene: "長安宮廷花宴",
    });

    expect(darkInstruction).toContain("【真實人體骨架】");
    expect(darkInstruction).toContain("- 罩杯:J（僅限奇幻異世界 / 暗黑王族分類");
    expect(darkInstruction.indexOf("- 罩杯:J")).toBeGreaterThan(darkInstruction.indexOf("【真實人體骨架】"));
    expect(darkInstruction.indexOf("- 罩杯:J")).toBeLessThan(darkInstruction.indexOf("【成熟成年女性體積感】"));
    expect(normalInstruction).not.toContain("- 罩杯:J");
  });
});
