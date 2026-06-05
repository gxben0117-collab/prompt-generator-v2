import { createCuratedRoleProfile } from "../profileFactory.js";

const RED_EPIC_PALETTES = {
  "紅巾飛天": "烈焰紅、沙金、蒼穹藍與古銅色",
  "女將軍": "戰旗紅、鎏金、玄黑與城牆灰",
  "抖音爆款": "高飽和正紅、暖燈金、雪白與電影夜藍",
};

const RED_EPIC_COSTUMES = {
  "紅巾飛天": "紅色大袖古裝長裙、飛天披帛、金線腰封與風沙旅拍斗篷",
  "女將軍": "紅色女將軍戰袍裙、金屬軟甲、長披風與硬挺軍旅腰封",
  "抖音爆款": "紅色古裝旅拍長裙、長披帛、金線腰封與適合短影音動態的飄逸外袍",
};

const RED_EPIC_JEWELRY = {
  "紅巾飛天": "金色髮冠、紅玉耳墜、細鏈臂釧與風沙護符腰飾",
  "女將軍": "金屬戰冠、紅玉耳墜、軍符腰牌與護腕鏈飾",
  "抖音爆款": "金色髮簪、紅玉耳墜、宮鈴腰佩與細緻流蘇髮飾",
};

const RED_EPIC_ROWS = [
  [
    "changxiangsi-red-epic-desert-scarf-sky",
    "長相思・大漠紅巾飛九天",
    "紅巾飛天",
    "大漠高沙丘與遠方古城天門",
    "長紅巾與沙丘腳印",
    "單手牽住紅巾尾端，紅巾向天空飛揚"
  ],
  [
    "changxiangsi-red-epic-mingsha-wind-ribbon-dance",
    "長相思・鳴沙長風舞紅綾",
    "紅巾飛天",
    "鳴沙山月牙泉外圍沙丘風口",
    "兩道紅綾與風鈴",
    "一手揚起紅綾，一手壓低袖口，舞步停格"
  ],
  [
    "changxiangsi-red-epic-thousand-mile-sand-red-dress",
    "長相思・萬里黃沙紅裳起",
    "紅巾飛天",
    "萬里黃沙古道與風蝕岩峽",
    "紅色披風、遠行手札與沙漠羅盤",
    "回身看向鏡頭，一手握住披風領口"
  ],
  [
    "changxiangsi-red-epic-cliff-red-sleeve-cloudwalk",
    "長相思・懸崖赤袖踏雲行",
    "紅巾飛天",
    "高山懸崖棧道與雲海天門",
    "長袖披帛、雲海石階與紅色髮帶",
    "牽起赤袖停步回望，披帛在雲海前展開"
  ],
  [
    "changxiangsi-red-epic-red-veil-heaven-gate",
    "長相思・紅紗破風臨天關",
    "紅巾飛天",
    "高聳古城天關門樓前",
    "紅紗長披帛與城門燈火",
    "牽住紅紗尾端，紅紗從兩側破風飛起"
  ],
  [
    "changxiangsi-red-epic-long-wind-snow-red-face",
    "長相思・長風捲雪映紅顏",
    "紅巾飛天",
    "雪覆古城牆與高風城樓",
    "紅披風、雪燈與飛雪紅帶",
    "收住披風前襟回眸，紅帶從身後掠過"
  ],
  [
    "changxiangsi-red-epic-lone-peak-red-robe-sun",
    "長相思・孤峰紅袍迎烈日",
    "紅巾飛天",
    "孤峰岩台與高空烈日雲層",
    "長披風、山巔旗桿與日輪紋飾",
    "扶旗桿收住披風，披風向側後方展開"
  ],
  [
    "changxiangsi-red-epic-warhorse-scarf-wasteland",
    "長相思・戰馬紅巾越荒原",
    "紅巾飛天",
    "廣闊荒原古道與遠山營旗",
    "戰馬韁繩、紅巾與旅行弓袋",
    "在馬側或低速騎行停格，紅巾沿風向飛揚"
  ],
  [
    "changxiangsi-red-epic-crimson-song-under-sky",
    "長相思・蒼穹之下紅衣歌",
    "紅巾飛天",
    "開闊高原草坡與巨大蒼穹",
    "紅色披帛、小琴囊與風鈴髮帶",
    "微抬下顎看向鏡頭，一手牽起披帛"
  ],
  [
    "changxiangsi-red-epic-cloud-sea-gate-red-feather",
    "長相思・雲海天門赤羽行",
    "紅巾飛天",
    "雲海天門石階與高山祭台",
    "赤羽披帛、天門石柱與雲鈴",
    "沿天門石階停步回望，羽紋披帛垂落"
  ],
  [
    "changxiangsi-red-epic-phoenix-city-scarf-split-sky",
    "長相思・鳳城紅巾裂天",
    "女將軍",
    "鳳城主城樓高台",
    "紅巾戰旗、長槍與城樓鼓槌",
    "扶長槍垂立，紅巾向天空裂開般飛揚"
  ],
  [
    "changxiangsi-red-epic-thousand-flags-general",
    "長相思・萬旗風起女將軍",
    "女將軍",
    "邊城閱兵台與旗陣通道",
    "萬面紅旗、軍令卷與長柄戰槍",
    "持軍令卷扶長槍，披風與戰旗同向翻飛"
  ],
  [
    "changxiangsi-red-epic-red-flame-spear-army",
    "長相思・赤焰長槍破千軍",
    "女將軍",
    "古戰場火盆陣與破曉軍陣前",
    "長槍、赤焰戰旗與戰場火盆",
    "長槍貼身垂立不遮臉，姿態穩定壓場"
  ],
  [
    "changxiangsi-red-epic-sunset-lonely-city-red-walk",
    "長相思・落日孤城紅衣行",
    "女將軍",
    "落日邊城主街與孤城城門",
    "紅披風、城門軍令與馬鞭",
    "低持軍令走過城門前，回身看向鏡頭"
  ],
  [
    "changxiangsi-red-epic-sand-road-war-goddess",
    "長相思・風沙古道女戰神",
    "女將軍",
    "風沙古道關隘與破舊旗台",
    "長刀、紅色戰旗與行軍水袋",
    "扶刀鞘壓住披風，身體微側正面凝視"
  ],
  [
    "changxiangsi-red-epic-city-wall-battle-flags",
    "長相思・城樓戰旗滿天飛",
    "女將軍",
    "高城樓戰旗平台",
    "滿天戰旗、城樓鼓與長槍",
    "扶長槍牽披風，戰旗在頭頂與身後大片飛舞"
  ],
  [
    "changxiangsi-red-epic-blood-sunset-queen-return",
    "長相思・血色殘陽女王歸",
    "女將軍",
    "王城城門與殘陽大道",
    "王城令牌、紅色拖尾與殘旗",
    "低持令牌扶披風前襟，正面凝視鏡頭"
  ],
  [
    "changxiangsi-red-epic-snowfield-red-robe-army",
    "長相思・雪原紅袍踏萬軍",
    "女將軍",
    "雪原軍陣前與冰封邊城",
    "軍旗、戰靴腳印與銀色長槍",
    "扶長槍壓住披風，踏雪而來停在鏡頭前"
  ],
  [
    "changxiangsi-red-epic-red-ribbon-snow-river",
    "長相思・紅綾飛雪鎮山河",
    "女將軍",
    "雪山關口與山河觀景台",
    "紅綾、山河軍旗與長劍",
    "低持長劍牽起紅綾，穩定鎮守山河"
  ],
  [
    "changxiangsi-red-epic-gold-armor-red-border-city",
    "長相思・金甲紅衣守邊城",
    "女將軍",
    "夜色邊城城牆巡守道",
    "城防令旗、長戟與邊城燈火",
    "扶長戟握住令旗，披風在夜風中展開"
  ],
  [
    "changxiangsi-red-epic-city-wall-running-red-dress",
    "長相思・城牆奔跑紅裙飛揚",
    "抖音爆款",
    "古城牆長步道與角樓前",
    "紅色披帛、城牆燈籠與手持小宮燈",
    "回身奔跑瞬間，一手輕提裙擺一手持燈"
  ],
  [
    "changxiangsi-red-epic-desert-lookback-scarf-sky",
    "長相思・大漠回首紅巾漫天",
    "抖音爆款",
    "大漠沙丘轉角與高風天空",
    "多條紅巾、旅行手札與沙丘腳印",
    "回首瞬間牽起紅巾，紅巾漫天鋪開"
  ],
  [
    "changxiangsi-red-epic-snow-old-city-red-umbrella",
    "長相思・風雪古城紅傘獨行",
    "抖音爆款",
    "風雪古城街巷與城門燈火",
    "紅傘、宮燈與雪地腳印",
    "紅傘偏肩側不遮臉，慢步停格看向鏡頭"
  ],
  [
    "changxiangsi-red-epic-sun-sand-red-ride",
    "長相思・烈日黃沙紅衣騎行",
    "抖音爆款",
    "烈日大漠古道與沙丘騎行路線",
    "馬韁、紅披風與沙漠水袋",
    "扶韁繩牽披風邊緣，紅衣在黃沙中飛揚"
  ],
  [
    "changxiangsi-red-epic-old-bridge-red-robe-turn",
    "長相思・古橋紅袍轉身瞬間",
    "抖音爆款",
    "古橋水岸與護城河黃昏",
    "紅披帛、橋邊燈籠與小折扇",
    "轉身瞬間牽披帛，裙擺形成圓弧"
  ],
  [
    "changxiangsi-red-epic-flower-street-red-ribbon",
    "長相思・落花長街紅綾飛舞",
    "抖音爆款",
    "落花古城長街與木樓檐下",
    "紅綾、花枝與街邊宮燈",
    "揚紅綾輕提裙側，像轉身後紅綾飛過鏡頭"
  ],
  [
    "changxiangsi-red-epic-thousand-lantern-street-night",
    "長相思・萬燈長街紅衣夜行",
    "抖音爆款",
    "萬燈古城長街與夜市牌樓",
    "手提宮燈、紅披帛與夜市燈籠",
    "慢步夜行，手提宮燈照亮臉部"
  ],
  [
    "changxiangsi-red-epic-mountain-top-red-robe-wings",
    "長相思・山巔迎風紅袍展翼",
    "抖音爆款",
    "山巔觀景台與雲海風口",
    "展翼披風、山巔旗繩與雲鈴",
    "雙手牽起披風下緣形成展翼輪廓"
  ],
  [
    "changxiangsi-red-epic-red-veil-ancient-city",
    "長相思・紅紗掠過千年古城",
    "抖音爆款",
    "千年古城城門與青磚長街",
    "長紅紗、城門燈籠與小玉扇",
    "紅紗從鏡頭前掠過但不遮臉，微側回眸"
  ],
  [
    "changxiangsi-red-epic-snow-night-lantern-girl",
    "長相思・雪夜執燈紅衣少女",
    "抖音爆款",
    "雪夜古城巷口與燈火橋邊",
    "手提宮燈、紅傘與雪地腳印",
    "提宮燈於胸口下方，另一手自然牽披風"
  ]
];

export const CHANGXIANGSI_RED_EPIC_PROFILES = RED_EPIC_ROWS.map(([id, title, volume, place, prop, action]) =>
  createCuratedRoleProfile({
    id,
    title,
    parentCategory: "長相思旅拍",
    series: "長相思・紅衣封神旅拍／" + volume,
    themeHint: "長相思 紅衣 紅巾 紅綾 戰旗 風沙 古城 旅拍 " + title,
    aliases: ["長相思旅拍", "長相思", "紅衣", "紅巾", "紅綾", "戰旗", volume, title],
    identity: title.replace("長相思・", "") + "電影旅拍女主",
    palette: RED_EPIC_PALETTES[volume],
    costumeCore: RED_EPIC_COSTUMES[volume],
    jewelry: RED_EPIC_JEWELRY[volume],
    prop,
    place,
    foreground: prop + "、飛舞紅巾、紅紗前景、風沙或飛雪粒子與服裝邊緣",
    midground: "真人紅衣女主位於畫面中央，臉部清楚可辨，紅巾、紅綾或戰旗形成動態線條",
    background: place + "延伸出的古城、山河、雲海、黃沙、雪夜或萬燈遠景，沒有路人干擾",
    action,
    lighting: "高級古裝電影光，紅衣高飽和透光，背景空氣層次分明，臉部明亮可辨識並保留自然 catchlight",
    atmosphere: "長相思紅衣封神旅拍電影主視覺，紅巾、紅綾、戰旗、風沙、雪夜與古城大場面共同形成短影音爆款感",
  }),
);
