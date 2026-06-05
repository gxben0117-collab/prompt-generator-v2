import { normalizeForSearch } from "./searchSynonyms.js";

export const ALL_FILTER_LABEL = "全部";

export const PARENT_ROLE_CATEGORIES = [
  {
    label: "長相思旅拍",
    exclude: [],
    keywords: ["長相思旅拍", "長相思", "西安古城", "雪城紅裳", "宮廊紅袖", "紅綾持劍", "西炎", "皓翎", "辰榮", "塗山"],
  },
  {
    label: "民族古城旅拍",
    exclude: ["現代", "都市", "賽博", "西方", "歐洲", "雅典", "希臘", "哥德", "魅魔", "墮天使"],
    keywords: ["民族古城旅拍", "民族風", "民族服", "苗風", "苗族", "銀冠", "古城夜景", "古城河岸", "草原民族", "白裘", "紙傘", "月洞門", "鼓樓"],
  },
  {
    label: "敦煌飛天",
    exclude: [],
    keywords: ["敦煌飛天", "敦煌", "飛天", "莫高窟", "敦煌壁畫", "鳴沙", "月牙泉", "洞窟", "飛天伎樂"],
  },
  {
    label: "九尾妖狐",
    exclude: [],
    keywords: ["九尾", "妖狐", "狐仙", "狐后", "狐姬", "狐火", "靈狐", "天狐", "青丘", "狐族"],
  },
  {
    label: "魅魔",
    exclude: [],
    keywords: ["魅魔", "夜宴魅姬", "冰霜夜宴魅姬", "紫蝶夜宴", "高訂睡袍", "暗黑浪漫電影"],
  },
  {
    label: "暗黑墮天使",
    exclude: ["魅魔", "魅姬"],
    keywords: ["暗黑墮天使", "墮天使", "墮羽", "黑羽", "黑翼", "殘翼", "末日神話"],
  },
  {
    label: "水下龍宮海國",
    exclude: ["小龍女", "金庸", "神鵰", "神鵰俠侶", "古墓派"],
    keywords: ["水下龍宮海國", "龍宮", "海國", "深海", "水下", "滄海", "水母", "靈珠", "海月", "聽潮", "龍女"],
  },
  {
    label: "埃及豔后／尼羅河女兒／埃及神話女神",
    exclude: ["世界頂級網紅地標旅拍", "世界地標", "網紅打卡", "iconic-checkin"],
    keywords: ["埃及豔后", "尼羅河女兒", "埃及神話女神", "埃及神話", "埃及女神", "克麗奧佩特拉", "Cleopatra", "尼羅河", "伊西斯", "哈索爾", "巴斯特", "塞赫美特", "奈芙蒂斯", "努特", "瑪特", "聖甲蟲", "紙莎草"],
  },
  {
    label: "盛唐宮廷考據／大明宮貴妃／史實考據",
    exclude: [],
    keywords: ["盛唐宮廷考據／大明宮貴妃／史實考據", "盛唐宮廷考據", "大明宮貴妃", "tang-daming-palace-research", "tang-huaqing-palace-research", "tang-xingqing-palace-research", "tang-qujiang-research", "tang-linde-hall-research", "tang-hanyuan-hall-research", "tang-imperial-library-research", "tang-jiaofang-research-consort", "tang-silk-workshop-research", "tang-lotus-pavilion-research"],
  },
  {
    label: "盛唐風月／教坊平康／胡姬樂舞",
    exclude: [],
    keywords: ["盛唐風月／教坊平康／胡姬樂舞", "盛唐風月", "教坊平康", "胡姬樂舞", "tang-entertainment-extra", "tang-jiaofang-inner-dancer", "tang-jiaofang-pipa-star", "tang-jiaofang-drum-dancer", "tang-jiaofang-flute-performer", "tang-jiaofang-court-vocalist", "tang-pingkang-beili-courtesan", "tang-pingkang-poetry-queen", "tang-pingkang-lute-courtesan", "tang-pingkang-incense-hostess", "tang-pingkang-masked-dancer", "tang-sogdian-winehouse-huji", "tang-persian-caravan-huji", "tang-kucha-drum-huji", "tang-samarqand-blue-huji", "tang-turkic-horsewoman-huji"],
  },
  {
    label: "漢宮禮樂／長信宮燈／漢代仕女考據",
    exclude: [],
    keywords: ["漢宮禮樂／長信宮燈／漢代仕女考據", "han-court-rite-"],
  },
  {
    label: "魏晉風骨／洛水女神／清談名姝",
    exclude: [],
    keywords: ["魏晉風骨／洛水女神／清談名姝", "weijin-luoshui-"],
  },
  {
    label: "宋韻雅集／汴梁茶香／文人仕女",
    exclude: [],
    keywords: ["宋韻雅集／汴梁茶香／文人仕女", "song-bianliang-"],
  },
  {
    label: "明宮織金／牡丹王姬／禮制服制",
    exclude: [],
    keywords: ["明宮織金／牡丹王姬／禮制服制", "dynasty-specialty-ming-palace-"],
  },
  {
    label: "清宮旗裝／雪苑貴妃／晚清宮廷寫實",
    exclude: [],
    keywords: ["清宮旗裝／雪苑貴妃／晚清宮廷寫實", "dynasty-specialty-qing-palace-"],
  },
  {
    label: "唐朝服飾／泛唐風古裝",
    exclude: ["長相思", "西安古城", "敦煌", "飛天", "莫高窟", "九尾", "妖狐", "狐仙", "魅魔", "魅姬", "魔妃", "暗黑", "哥德", "墮天使", "龍宮", "海國", "深海", "水下", "盛唐宮廷考據", "大明宮貴妃", "盛唐風月", "教坊平康", "胡姬樂舞"],
    keywords: ["唐朝服飾", "泛唐風古裝", "大唐", "盛唐", "唐代", "唐朝", "長安", "唐闕", "唐珠", "唐制", "霓裳", "飛天伎樂", "花鈿", "襦裙", "披帛"],
  },
  {
    label: "江南旅拍",
    exclude: [],
    keywords: ["江南旅拍", "江南", "江東", "水鄉", "水榭", "古鎮", "西塘", "荷塘", "桃花庭院", "蘇州", "水岸"],
  },
  {
    label: "田園花園旅拍",
    exclude: ["古裝", "唐", "大唐", "盛唐", "仙俠", "神話", "魅魔", "哥德", "暗黑", "墮天使"],
    keywords: ["田園花園旅拍", "田園", "牧場", "草地", "鄉村花園", "花園露台", "粉色雪紡", "木平台", "山谷草原", "戶外洋裝"],
  },
  {
    label: "高訂婚紗禮服",
    exclude: ["暗黑", "哥德", "魅魔", "戰場", "賽博"],
    keywords: ["高訂婚紗禮服", "婚紗", "禮服", "晚禮服", "水晶禮服", "舞會禮裙", "高訂花裙", "公主禮裙"],
  },
  {
    label: "海岸度假旅拍",
    exclude: ["龍宮", "水下", "海國", "人魚", "賽博", "戰場"],
    keywords: ["海岸度假旅拍", "海灘", "海岸", "沙灘", "浪花", "礁石", "比基尼", "泳裝", "海邊", "度假"],
  },
  {
    label: "室內生活寫真",
    exclude: ["王座", "哥德", "暗黑", "婚紗", "戰場", "賽博"],
    keywords: ["室內生活寫真", "室內", "沙發", "臥室", "窗邊", "居家", "辦公桌", "電腦桌", "生活寫真"],
  },
  {
    label: "賽博機甲 / 科幻戰姬",
    exclude: ["古裝", "漢服", "婚紗"],
    keywords: ["賽博機甲", "科幻戰姬", "機甲", "鋼彈", "戰甲", "未來裝甲", "太空艙", "機械", "cyber mech"],
  },
  {
    label: "動漫次文化街拍",
    exclude: ["古裝", "漢服", "婚紗", "世界地標"],
    keywords: ["動漫次文化街拍", "次文化", "遊戲致敬", "電子寵物", "貓耳", "cosplay", "霓虹塗鴉", "格鬥女忍", "魔法少女"],
  },
  {
    label: "東方和風旅拍",
    exclude: ["九尾", "妖狐", "賽博", "現代都市"],
    keywords: ["東方和風旅拍", "和風", "和服", "日式", "紙傘", "櫻花傘", "花魁", "巫女"],
  },
  {
    label: "東方旗袍夜宴",
    exclude: ["現代都市", "賽博", "婚紗"],
    keywords: ["東方旗袍夜宴", "旗袍", "黑金旗袍", "中式夜宴", "雕花王座", "東方名伶"],
  },
  {
    label: "世界頂級網紅地標旅拍",
    exclude: [],
    keywords: ["世界頂級網紅地標旅拍", "網紅打卡", "iconic-checkin", "頂級網紅地標"],
  },
  {
    label: "現代都市夜景",
    exclude: ["艾菲爾", "自由女神", "威尼斯", "人面獅身", "金字塔", "塔橋", "哈里發塔", "羅馬競技場", "泰姬陵", "雪梨歌劇院", "聖家堂", "聖托里尼", "伏見稻荷", "佩特拉", "舍夫沙萬", "卡帕多奇亞", "Hollywood Sign", "中央公園"],
    keywords: ["現代都市夜景", "都市夜景", "現代", "都市", "都會", "夜景", "霓虹", "街拍", "首爾", "上海", "香港", "台北", "賽博", "捷運", "city pop"],
  },
  {
    label: "歷史小說名著人物",
    exclude: ["西方", "歐洲", "雅典", "希臘", "奧林匹斯", "凡爾賽", "哥德", "魅魔", "魔后", "暗黑", "賽博", "現代"],
    keywords: [
      "歷史小說名著人物",
      "三國演義",
      "三國",
      "東吳",
      "小喬",
      "大喬",
      "貂蟬",
      "西施",
      "紅樓夢",
      "金庸",
      "射鵰",
      "神鵰",
      "倚天",
      "天龍八部",
      "笑傲江湖",
      "黃蓉",
      "小龍女",
      "趙敏",
      "任盈盈",
      "王語嫣",
      "周芷若",
      "木婉清",
      "阿紫",
      "阿朱",
      "郭襄",
      "李莫愁",
      "程靈素",
      "燕子塢",
      "峨眉",
      "水滸傳",
      "西遊記",
    ],
  },
  {
    label: "中國歷代服裝／泛朝代總覽",
    exclude: ["歷史小說名著人物", "三國演義", "三國", "東吳", "西方", "歐洲", "歐陸", "雅典", "希臘", "奧林匹斯", "凡爾賽", "哥德", "墮羽", "墮天使", "魔后", "魅魔", "魅姬", "血族", "暗黑"],
    keywords: [
      "中國歷代服裝",
      "泛朝代總覽",
      "中國朝代",
      "漢代",
      "宋代",
      "魏晉",
      "隋宮",
      "元代",
      "明代",
      "大唐",
      "盛唐",
      "唐代",
      "長安",
      "大周",
      "宮闕",
      "宮燈華裳",
      "雅宴",
      "雅集",
      "花朝",
      "花殿",
      "華宴",
      "盛節",
      "清宮",
      "故宮",
      "宮廷",
      "富家千金",
      "大官之女",
      "歌伎",
      "歌伎系",
      "宮廷名姬",
      "性感歌伎",
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
    exclude: ["西方", "歐洲", "雅典", "希臘", "凡爾賽", "哥德", "魅魔", "魅姬"],
    keywords: ["武俠", "江湖", "女俠", "劍", "戰場", "女將", "長城", "邊關", "血色江湖", "劍門", "華山"],
  },
  {
    label: "仙俠神話 / 古裝陸劇",
    exclude: [
      "雅典",
      "希臘",
      "奧林匹斯",
      "神諭",
      "凡爾賽",
      "歐陸",
      "西方",
      "世界地標",
      "血族",
      "吸血鬼",
      "哥德",
      "歌德",
      "巴洛克",
      "墮天使",
      "墮羽",
      "黑羽",
      "黑翼",
      "暗黑",
      "魅魔",
      "魔姬",
      "魔后",
      "夜庭",
    ],
    keywords: [
      "仙俠",
      "修真",
      "神話",
      "飛天",
      "聖女",
      "神女",
      "仙姬",
      "天界",
      "聖域",
      "天使",
      "天空神國",
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
    exclude: ["雅典", "希臘", "奧林匹斯", "凡爾賽", "歐陸", "西方", "哥德", "血族"],
    keywords: ["西域", "絲路", "大漠", "沙漠", "樓蘭", "敦煌", "莫高窟", "波斯", "中亞", "沙海", "赤砂", "異域", "秘殿", "駱駝"],
  },
  {
    label: "奇幻異世界 / 暗黑王族",
    exclude: ["雅典", "希臘", "奧林匹斯", "凡爾賽", "世界地標", "世界旅拍", "巴黎", "威尼斯", "首爾"],
    keywords: [
      "魅魔",
      "魔姬",
      "魔后",
      "魔王",
      "魔殿",
      "暗黑",
      "黑暗",
      "哥德",
      "歌德",
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
      "魔域",
    ],
  },
  {
    label: "西方古典 / 歐陸史詩",
    exclude: ["大唐", "盛唐", "長安", "江南", "清宮", "故宮", "仙俠", "修真", "東方神話"],
    keywords: ["雅典", "希臘", "奧林匹斯", "神諭", "巴洛克", "歐陸", "文藝復興", "古堡", "聖殿", "凡爾賽", "歌劇"],
  },
  {
    label: "世界景點旅拍",
    exclude: ["大唐", "盛唐", "長安", "仙俠", "修真", "魅魔", "魔后", "墮天使", "冥界", "雅典", "希臘", "奧林匹斯", "聖殿", "神諭", "歌劇"],
    keywords: ["世界地標", "世界旅拍", "歐洲", "巴黎", "威尼斯", "首爾", "北境", "水城", "古橋", "海岸", "旅拍", "水巷"],
  },
  {
    label: "現代都市 / 街拍電影",
    exclude: ["大唐", "盛唐", "長安", "江南", "仙俠", "修真", "神話", "哥德", "凡爾賽"],
    keywords: ["現代", "都市", "都會", "city pop", "霓虹", "街頭", "街拍", "韓系", "賽博", "電競", "格鬥", "未來"],
  },
  {
    label: "花園童話 / 自然精靈",
    exclude: ["凡爾賽", "雅典", "希臘", "大唐", "盛唐", "長安", "哥德", "暗黑", "血族"],
    keywords: ["花園", "花靈", "森林", "精靈", "童話", "白玫", "花神", "夢幻", "花海", "晶花", "水鏡", "自然", "紫陽花"],
  },
];

const PRIORITY_PARENT_CATEGORY_LABELS = [
  "長相思旅拍",
  "盛唐宮廷考據／大明宮貴妃／史實考據",
  "盛唐風月／教坊平康／胡姬樂舞",
  "漢宮禮樂／長信宮燈／漢代仕女考據",
  "魏晉風骨／洛水女神／清談名姝",
  "宋韻雅集／汴梁茶香／文人仕女",
  "明宮織金／牡丹王姬／禮制服制",
  "清宮旗裝／雪苑貴妃／晚清宮廷寫實",
  "民族古城旅拍",
  "敦煌飛天",
  "九尾妖狐",
  "魅魔",
  "暗黑墮天使",
  "水下龍宮海國",
  "埃及豔后／尼羅河女兒／埃及神話女神",
  "唐朝服飾／泛唐風古裝",
  "江南旅拍",
  "世界頂級網紅地標旅拍",
  "現代都市夜景",
];
const PROFILE_PARENT_CATEGORY_CACHE = new WeakMap();
const LEGACY_PARENT_CATEGORY_LABELS = new Map([
  ["唐朝服飾", "唐朝服飾／泛唐風古裝"],
  ["中國歷代服裝", "中國歷代服裝／泛朝代總覽"],
  ["世界地標旅拍", "世界景點旅拍"],
]);

export function normalizeSearchText(value) {
  return normalizeForSearch(value);
}

export function profileCategoryText(profile) {
  return `${profile.title} ${profile.themeHint} ${profile.category} ${profile.id} ${(profile.aliases || []).join(" ")}`;
}

export function parentCategoryForText(value) {
  const rawHaystack = String(value || "").toLowerCase();
  const haystack = normalizeSearchText(value);
  const priorityCandidate = PRIORITY_PARENT_CATEGORY_LABELS
    .map((label) => PARENT_ROLE_CATEGORIES.find((parent) => parent.label === label))
    .filter(Boolean)
    .find((parent) => {
    const blocked = (parent.exclude || []).some((keyword) => rawHaystack.includes(String(keyword).toLowerCase()));
    if (blocked) return false;
    return parent.keywords.some((keyword) => rawHaystack.includes(String(keyword).toLowerCase()));
    });
  if (priorityCandidate) return priorityCandidate.label;

  const candidates = PARENT_ROLE_CATEGORIES.map((parent, index) => {
    const blocked = (parent.exclude || []).some((keyword) => haystack.includes(normalizeSearchText(keyword)));
    if (blocked) return null;

    const matchedKeywords = parent.keywords.filter((keyword) => haystack.includes(normalizeSearchText(keyword)));
    if (matchedKeywords.length === 0) return null;

    return {
      index,
      label: parent.label,
      hits: matchedKeywords.length,
      strongestKeywordLength: Math.max(...matchedKeywords.map((keyword) => String(keyword).length)),
    };
  }).filter(Boolean);

  candidates.sort(
    (left, right) =>
      right.hits - left.hits ||
      right.strongestKeywordLength - left.strongestKeywordLength ||
      left.index - right.index,
  );

  return candidates[0]?.label;
}

export function parentCategoryForProfile(profile) {
  if (profile && typeof profile === "object" && PROFILE_PARENT_CATEGORY_CACHE.has(profile)) {
    return PROFILE_PARENT_CATEGORY_CACHE.get(profile);
  }
  const hasTrustedParentCategory = (
    profile?.id?.startsWith("ref-temp-") ||
    profile?.id?.startsWith("eighth-") ||
    profile?.id?.startsWith("ninth-") ||
    profile?.id?.startsWith("tenth-") ||
    profile?.id?.startsWith("style-ref-") ||
    profile?.id?.startsWith("iconic-checkin-")
  ) && profile.parentCategory && profile.parentCategory !== "中國歷代服裝";
  if (hasTrustedParentCategory) {
    const category = LEGACY_PARENT_CATEGORY_LABELS.get(profile.parentCategory) || profile.parentCategory;
    PROFILE_PARENT_CATEGORY_CACHE.set(profile, category);
    return category;
  }
  const inferredCategory = parentCategoryForText(profileCategoryText(profile));
  let category;
  if (PRIORITY_PARENT_CATEGORY_LABELS.includes(inferredCategory)) {
    category = inferredCategory;
  } else if (profile?.parentCategory === "中國歷代服裝" && inferredCategory) {
    category = inferredCategory;
  } else if (profile?.parentCategory) {
    category = LEGACY_PARENT_CATEGORY_LABELS.get(profile.parentCategory) || profile.parentCategory;
  } else {
    category = inferredCategory;
  }

  if (profile && typeof profile === "object") {
    PROFILE_PARENT_CATEGORY_CACHE.set(profile, category);
  }
  return category;
}

