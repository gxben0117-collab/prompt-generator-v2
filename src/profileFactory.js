export function createLayerProfile({
  id,
  title,
  themeHint,
  category,
  parentCategory,
  aliases,
  cupSize,
  costume,
  makeup,
  scene,
  sceneEnvironment,
  sceneAction,
  sceneLighting,
  layers,
}) {
  return {
    id,
    title,
    themeHint: themeHint || title,
    category,
    parentCategory,
    aliases,
    cupSize: cupSize || "正常比例",
    costume,
    makeup,
    scene,
    sceneEnvironment,
    sceneAction,
    sceneLighting,
    layers: Object.fromEntries(layers.map((layer, index) => [`costumeLayer${index + 1}`, layer])),
  };
}

export function createCuratedRoleProfile({
  id,
  title,
  parentCategory,
  series,
  themeHint,
  aliases,
  identity,
  palette,
  costumeCore,
  jewelry,
  prop,
  place,
  foreground,
  midground,
  background,
  action,
  lighting,
  atmosphere = "高級商業奇幻電影主視覺",
  cupSize = "正常比例",
}) {
  const fullTheme = `${title} ${themeHint || ""} ${parentCategory} ${series}`.trim();
  return createLayerProfile({
    id,
    title,
    themeHint: fullTheme,
    category: `${series}／${parentCategory}`,
    parentCategory,
    aliases: [...new Set([parentCategory, series, title, ...(aliases || [])])],
    cupSize,
    costume:
      `${identity}電影角色卡，${palette}、${costumeCore}、${jewelry}與${prop}組成${atmosphere}；服裝只服務真人身份與畫面主輪廓，保留上傳人物原始臉部辨識度，不重塑成 AI 模板臉。`,
    layers: [
      `${palette}內層真絲或細織襯底建立真人成年骨架、肩頸與胸腔厚度`,
      `${costumeCore}基礎支撐結構貼合角色身份，保持正常軀幹深度與可穿戴邏輯`,
      `${costumeCore}主體輪廓形成第一視覺，不追求極端腰臀比例`,
      `透明外紗、披帛、斗篷或外袍依${place}空氣流動自然垂落`,
      `${jewelry}固定腰線、肩線與角色文化符號，反射真實光源`,
      `大型外袍、裙擺、披風或戰袍形成 dominant cinematic silhouette`,
      `肩飾、袖口、髮帶或身份飾件建立${series}辨識度，不遮擋臉部`,
      `${prop}作為角色記憶點，與手部動作自然互動`,
      `髮髻、冠飾、髮簪或帽飾貼合真人頭型與髮際線，完整露出原始五官`,
      `${palette}、${costumeCore}、${prop}、${place}與空氣光影共同形成${parentCategory}電影角色卡主視覺輪廓`,
    ],
    makeup:
      `${identity}電影妝感，保留上傳真人原始臉型、眼型、鼻型、嘴型、下顎線、臉頰肉感、成熟年齡感與真實皮膚紋理；妝容只強化${palette}、角色氣質與眼神表演，不換成新演員臉、網紅臉或 AI 仙女臉。`,
    scene:
      `${place}，${foreground}、${midground}、${background}共同形成${parentCategory}電影場景。`,
    sceneEnvironment:
      `${place}，前景${foreground}提供鏡頭遮擋與空氣層次，中景${midground}，遠景${background}建立世界觀、地域與故事縱深；背景預設不放路人，若主題需要人物只能是極淡遠景剪影。`,
    sceneAction:
      `${action}；臉部保持正面或微側正面看向鏡頭，手不遮臉，肩頸、胸腔、骨盆、雙腳重心與布料受力符合真實成年人體結構。`,
    sceneLighting:
      `${lighting}；臉部明亮可辨識，有自然 catchlight，布料、珠寶、金屬、霧氣與景深分離符合真實攝影，不做灰暗設定卡、塑膠 HDR 或遊戲 CG 感。`,
  });
}
