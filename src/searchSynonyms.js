export const SEARCH_SYNONYM_GROUPS = [
  { canonical: "貴妃", terms: ["貴妃", "娘娘", "宮妃", "妃", "妃嬪"] },
  { canonical: "公主", terms: ["公主", "王姬", "帝姬", "郡主", "王女"] },
  { canonical: "皇后", terms: ["皇后", "后妃", "女后", "王后"] },
  { canonical: "樂姬", terms: ["樂姬", "乐姬", "歌姬", "歌伎", "歌姬", "歌娘", "歌伶", "伎樂", "伎人", "舞姬"] },
  { canonical: "旅拍", terms: ["旅拍", "旅行", "旅遊", "旅游", "景點", "景点", "景拍", "出遊", "出游"] },
  { canonical: "魅魔", terms: ["魅魔", "魅姬", "魔姬", "魔妃", "魔后"] },
  { canonical: "歌德", terms: ["歌德", "哥德", "gothic"] },
  { canonical: "仙俠", terms: ["仙俠", "仙侠", "修真", "神女", "仙姬", "聖女"] },
  { canonical: "西域", terms: ["西域", "絲路", "丝路", "大漠", "沙海", "樓蘭", "楼兰", "龜茲", "敦煌", "異域"] },
  { canonical: "宮廷", terms: ["宮廷", "宫廷", "內廷", "內苑", "皇城", "王庭"] },
  { canonical: "夜宴", terms: ["夜宴", "花宴", "宮宴", "晚宴", "宴庭", "宴席"] },
  { canonical: "花園", terms: ["花園", "花海", "花境", "花庭", "森林", "精靈", "童話"] },
  { canonical: "都市", terms: ["都市", "都會", "街拍", "夜景", "city pop", "citypop", "賽博", "霓虹"] },
];

const SIMPLE_VARIANT_REPLACEMENTS = [
  [/乐/g, "樂"],
  [/后/g, "后"],
  [/宫/g, "宮"],
  [/乡/g, "鄉"],
  [/楼/g, "樓"],
  [/门/g, "門"],
  [/风/g, "風"],
  [/云/g, "雲"],
  [/灯/g, "燈"],
  [/霓裳/g, "霓裳"],
];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeForSearch(value) {
  let text = String(value || "").toLowerCase();
  for (const [pattern, replacement] of SIMPLE_VARIANT_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  text = text.replace(/[・｜／/|,_-]+/g, " ").replace(/\s+/g, " ").trim();

  for (const group of SEARCH_SYNONYM_GROUPS) {
    const canonical = String(group.canonical).toLowerCase();
    const terms = [...new Set([group.canonical, ...(group.terms || [])])]
      .map((term) => String(term).toLowerCase())
      .sort((left, right) => right.length - left.length);

    for (const term of terms) {
      if (!term || term === canonical) continue;
      text = text.replace(new RegExp(escapeRegex(term), "g"), canonical);
    }
  }
  return text.replace(/\s+/g, " ").trim();
}
