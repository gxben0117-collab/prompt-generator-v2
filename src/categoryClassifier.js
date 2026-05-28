export const ALL_FILTER_LABEL = "全部";

export const PARENT_ROLE_CATEGORIES = [
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
      "水滸傳",
      "西遊記",
    ],
  },
  {
    label: "中國歷代服裝",
    exclude: ["歷史小說名著人物", "三國演義", "三國", "東吳", "西方", "歐洲", "歐陸", "雅典", "希臘", "奧林匹斯", "凡爾賽", "哥德", "墮羽", "墮天使", "魔后", "魅魔", "魅姬", "血族", "暗黑"],
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
    exclude: ["西方", "歐洲", "雅典", "希臘", "凡爾賽", "哥德", "魅魔", "魅姬"],
    keywords: ["武俠", "江湖", "女俠", "劍", "戰場", "女將", "長城", "邊關", "血色江湖", "劍門", "華山"],
  },
  {
    label: "仙俠神話 / 古裝陸劇",
    exclude: ["雅典", "希臘", "奧林匹斯", "神諭", "凡爾賽", "歐陸", "西方", "世界地標", "血族", "吸血鬼", "哥德", "巴洛克"],
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
    exclude: ["大唐", "盛唐", "長安", "仙俠", "修真", "魅魔", "魔后", "墮天使", "冥界"],
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

export function normalizeSearchText(value) {
  return String(value || "").toLowerCase();
}

export function profileCategoryText(profile) {
  return `${profile.title} ${profile.themeHint} ${profile.category} ${profile.id} ${(profile.aliases || []).join(" ")}`;
}

export function parentCategoryForText(value) {
  const haystack = normalizeSearchText(value);
  return PARENT_ROLE_CATEGORIES.find((parent) => {
    const blocked = (parent.exclude || []).some((keyword) => haystack.includes(normalizeSearchText(keyword)));
    if (blocked) return false;
    return parent.keywords.some((keyword) => haystack.includes(normalizeSearchText(keyword)));
  })?.label;
}

export function parentCategoryForProfile(profile) {
  return parentCategoryForText(profileCategoryText(profile));
}
