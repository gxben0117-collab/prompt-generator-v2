// 美片咒語產生器 - 核心邏輯
// 版本：v2.0.0 (2026-05-24) - 繁體中文版

// ═══════════════════════════════════════════════════════════
// STEP 1: 真人身份優先
// ═══════════════════════════════════════════════════════════

const STEP1_IDENTITY_LOCK = `【真人身份優先｜最高權重】

生成前先讀取上傳照片中的真實臉部身份與人體比例。

所有奇幻風格、服裝、妝容、場景設計，
都只能建立在原始真人身份之上。

不可重新設計一張新的臉。

AI 必須先建立：
真人身份、
真實人體比例、
真實攝影結構，

其次才建立奇幻風格。

人物主體權重高於場景特效權重。

優先呈現真人攝影感，
而不是 AI 概念藝術感。

不可因為奇幻風格而重新設計真人五官比例。

保留上傳照片中的完整臉部身份與五官。

不可改變：
臉型、
眼型、
鼻型、
嘴型、
下顎線、
五官比例、
可辨識特徵。

保留自然臉部不對稱、
真實年齡細節、
真人感。

若奇幻、服裝、妝容、電影感與臉部身份衝突，
一律保留真人臉部身份。

If any cinematic, fantasy, costume, or makeup styling conflicts with facial identity preservation, preserve the real facial identity first.

避免：
AI 美女臉、
網紅濾鏡感、
娃娃臉比例、
模板美女臉、
標準化五官。`;

// ═══════════════════════════════════════════════════════════
// STEP 2: 真實人體骨架
// ═══════════════════════════════════════════════════════════

const STEP2_BODY_STRUCTURE = `【真實人體骨架】

優先建立真實成年女性骨架。

頭部大小必須與肩膀、身體維持真實人體比例。

保持：
平衡肩寬、
真實鎖骨、
自然胸腔厚度、
正常軀幹深度、
自然脖子連接。

禁止：
大頭比例、
壓縮上半身、
過窄肩膀、
娃娃比例、
頭重腳輕、
身體過小、
動漫骨架、
卡通化人體。

人物身體必須與真實臉部自然融合。`;

// 擴展版：統一使用，強化真實身體比例描述
const STEP2_BODY_STRUCTURE_EXTENDED = `【真實人體骨架】

優先建立真實成年女性骨架。

頭部大小必須與肩膀、身體維持真實人體比例。

保持：
平衡肩寬、
真實鎖骨、
自然胸腔厚度、
正常軀幹深度、
自然脖子連接。

維持真實成熟成年女性體積感。

自然豐滿胸型需建立在真實胸腔骨架結構之上。

保持自然胸部重量與真實軀幹厚度。

維持肩膀與胸部之間的自然比例平衡。

布料張力需自然貼合人體結構。

避免動漫式誇張胸型。

避免極端沙漏型身材。

避免不合理腰臀比例。

維持真實可信的人體比例。

保持成熟成年女性骨架比例。

胸部體積需符合真實重力與站姿。

胸型需跟隨姿勢與布料自然變化。

避免 AI 性感模板身材。

避免網紅式極細腰身。

避免誇張挺胸姿勢。

避免 Pin-up 女郎姿勢。

維持自然脊椎與身體重心。

胸腔厚度需符合真實人體結構。

人物整體體積感需優先於性感化誇張。

禁止：
大頭比例、
壓縮上半身、
過窄肩膀、
娃娃比例、
頭重腳輕、
身體過小、
動漫骨架、
卡通化人體。

人物身體必須與真實臉部自然融合。`;

// 動態生成帶罩杯設定的身體結構（根據角色卡的 cupSize 欄位）
function buildBodyStructureWithCupSize(cupSize) {
  return `【真實人體骨架】

優先建立真實成年女性骨架。

頭部大小必須與肩膀、身體維持真實人體比例。

保持：
平衡肩寬、
真實鎖骨、
自然胸腔厚度、
正常軀幹深度、
自然脖子連接。

維持真實成熟成年女性體積感。

自然豐滿胸型需建立在真實胸腔骨架結構之上。

保持自然胸部重量與真實軀幹厚度。

維持肩膀與胸部之間的自然比例平衡。

胸腔厚度需符合真實人體結構。

布料張力需自然貼合人體結構。

胸型需跟隨姿勢與布料自然變化。

胸部體積需符合真實重力與站姿。

保持成熟成年女性骨架比例。

維持真實可信的人體比例。

罩杯預設${cupSize}。

避免極端沙漏型身材。

避免不合理腰臀比例。

避免動漫式誇張胸型。

避免 AI 性感模板身材。

避免網紅式極細腰身。

避免誇張挺胸姿勢。

避免 Pin-up 女郎姿勢。

維持自然脊椎與身體重心。

人物整體體積感需優先於性感化誇張。

禁止：
大頭比例、
壓縮上半身、
過窄肩膀、
娃娃比例、
頭重腳輕、
身體過小、
動漫骨架、
卡通化人體。

人物身體必須與真實臉部自然融合。`;
}

// 魅魔系列專用版：包含罩杯F設定（保留作為向後兼容）
const STEP2_BODY_STRUCTURE_SUCCUBUS = buildBodyStructureWithCupSize('F');

// 需要使用擴展版身體描述的風格關鍵字
// ═══════════════════════════════════════════════════════════
// 注意：所有角色卡統一使用擴展版身體比例描述
// 如果角色卡有 cupSize 欄位（英文或數字），則使用帶罩杯設定的版本
// 魅魔系列使用專用版本（包含罩杯F設定）
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// STEP 3: 電影攝影結構
// ═══════════════════════════════════════════════════════════

const STEP3_CINEMA_STRUCTURE = `【電影攝影結構】

固定使用：
50mm 全片幅電影攝影視角。

真實人像拍攝距離。

全身完整入鏡。

電影感中遠景構圖。

人物與場景必須保持真實空間透視。

避免：
人像特寫、
自拍視角、
誇張透視、
半身近拍、
腰上人像、
臉部放大、
beauty framing。

避免臉部主導畫面比例。

優先呈現完整人物與環境關係。`;

// ═══════════════════════════════════════════════════════════
// STEP 4: 真實攝影感
// ═══════════════════════════════════════════════════════════

const STEP4_PHOTO_REALISM = `【真實攝影感】

畫面必須像：

「真實攝影師拍攝的真人奇幻電影海報」

而不是 AI 插畫。

強調：

真實光影、

真實空氣感、

真實環境互動、

真實皮膚反光、

真實布料重量、

真實人體站姿。

奇幻世界只能襯托真人，
不能取代真人。

人物必須是被拍進奇幻世界的真人，
不是重新設計的奇幻女主角。

The fantasy world must support the photographed real person.

The person must remain a real photographed woman, not a redesigned fantasy heroine.

Prioritize real-person photographic identity and cinematic realism over fantasy beauty aesthetics.

真人演員被拍進奇幻世界。

奇幻世界支撐真人照片身份，
而不是重新設計奇幻角色。`;

// ═══════════════════════════════════════════════════════════
// STEP 5: 動作控制
// ═══════════════════════════════════════════════════════════

const STEP5_ACTION_CONTROL = `【動作控制】

電影海報式站姿。

自然人體重心。

肩膀與軀幹平衡。

手部比例正確。

腿部比例正確。

自然手指結構。

自然站姿。

姿勢需配合臉部角度自然生成。

避免：

扭曲四肢、

錯誤手指、

不合理肢體、

過度誇張動作、

不自然姿勢、

跳躍、

旋轉、

背對鏡頭、

手遮臉、

手舉過頭。`;

// ═══════════════════════════════════════════════════════════
// STEP 6: 主題、場景、服裝、妝容
// ═══════════════════════════════════════════════════════════

function cleanPromptText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.。；;:])/g, '$1')
    .trim();
}

function buildSceneCostumeProps(data) {
  const parts = [];

  // 主題
  if (data.theme) {
    parts.push(`主題：${data.theme}`);
  }

  // 場景
  const sceneContent = data.scene || `使用配合主題的電影場景。

動作配合主題。

若主題無動作提示，
則由 AI 設計合乎角色風格的動作。`;
  parts.push(`【場景】\n\n${sceneContent}`);

  // 動作與道具
  const actionContent = cleanPromptText(data.action);
  if (actionContent) {
    parts.push(`【動作與道具】\n\n${actionContent}`);
  }

  // 服裝
  const costumeContent = data.costume || `配合主題，
若主題無服飾提示，
讓 AI 設計服裝裝飾要有華麗感，
但仍保有真實攝影感。`;
  parts.push(`【服裝】\n\n${costumeContent}`);

  // 妝容
  const makeupContent = data.makeup || '配合主題讓 AI 設計妝容與髮型。';
  parts.push(`【妝容】\n\n在不改變原始臉部結構前提下：\n\n${makeupContent}\n\n僅限表面妝容效果。\n\n不可改變骨相。\n\n不可 AI 美顏化。`);

  // 固定的品質描述
  parts.push(`【固定品質描述】

8K 超高細節。

電影級光影。

真實皮膚紋理。

高細節布料物理。

超高畫質。`);

  return parts.join('\n\n');
}

// ═══════════════════════════════════════════════════════════
// STEP 7: 構圖
// ═══════════════════════════════════════════════════════════

function buildCompositionSection(data) {
  const ratioLabels = {
    r_11: '1:1',
    r_23: '2:3',
    r_34: '3:4',
    r_43: '4:3',
    r_916: '9:16',
    r_cinema: '2.39:1'
  };
  const ratioName = ratioLabels[data.ratio] || '9:16';
  const ratioLine = data.ratio === 'r_916' ? '預設9:16手機螢幕' : `其他 ${ratioName}`;

  const compositionContent = cleanPromptText(data.composition);
  const compositionExtra = compositionContent ? `\n\n角色卡構圖：${compositionContent}` : '';

  return `構圖 (${ratioLine})

人物整體存在感優先於臉部特寫。

臉部不可過度銳化。

避免臉部主導畫面。

避免時尚雜誌封面感。

優先呈現完整人物與環境關係。

全身完整入鏡。

使用中遠景真人攝影距離。

避免自拍感與近距離人像特寫。

避免臉部主導畫面比例。${compositionExtra}`;
}

// ═══════════════════════════════════════════════════════════
// STEP 8: 負面詞
// ═══════════════════════════════════════════════════════════

const STEP8_NEGATIVE_PROMPTS = `【負面詞｜非常重要】

禁止：
AI 美女臉、
美肌濾鏡感、
塑膠皮膚、
過度磨皮、
大頭比例、
人像特寫臉部放大、
自拍視角、
娃娃比例、
卡通化人體、
動漫骨架、
肩膀過窄、
壓縮上半身、
身體過小、
錯誤四肢、
扭曲手指、
不自然動作、
誇張透視、
AI 插畫感、
過度性感化、
CG 遊戲角色感、
AI 時尚大片感、
fashion editorial、
magazine cover、
beauty campaign、
臉部過度平滑、
過度銳利眼睛、
假睫毛過重、
塑膠嘴唇、
不自然皮膚發光、
角色卡面風格、
手機自拍感、
網美風、
臉部主導畫面、
模板美女臉、
標準化五官、
過度 HDR、
塑膠感 cinematic realism。`;

// ═══════════════════════════════════════════════════════════
// 主要 Prompt 生成函式
// ═══════════════════════════════════════════════════════════

function buildPrompt(styleData) {
  const sections = [];

  // STEP 1: 身份鎖定
  sections.push(STEP1_IDENTITY_LOCK);

  // STEP 2: 真實人體骨架（根據 cupSize 欄位或系列選擇版本）
  // 優先檢查 cupSize 欄位（如果有英文或數字）
  if (styleData.cupSize && /[A-Za-z0-9]/.test(styleData.cupSize)) {
    sections.push(buildBodyStructureWithCupSize(styleData.cupSize));
  } else {
    // 向後兼容：魅魔系列使用預設 F 罩杯
    const isSuccubusSeries = styleData.sub === '魅魔系列' || styleData.series === '魅魔系列';
    if (isSuccubusSeries) {
      sections.push(STEP2_BODY_STRUCTURE_SUCCUBUS);
    } else {
      sections.push(STEP2_BODY_STRUCTURE_EXTENDED);
    }
  }

  // STEP 3: 電影攝影結構
  sections.push(STEP3_CINEMA_STRUCTURE);

  // STEP 4: 真實攝影感
  sections.push(STEP4_PHOTO_REALISM);

  // STEP 5: 動作控制
  sections.push(STEP5_ACTION_CONTROL);

  // STEP 6: 主題、場景、服裝、妝容
  sections.push(buildSceneCostumeProps(styleData));

  // STEP 7: 構圖
  sections.push(buildCompositionSection(styleData));

  // STEP 8: 負面詞
  sections.push(STEP8_NEGATIVE_PROMPTS);

  // 組合所有段落
  let finalPrompt = sections.join('\n\n');

  // 檢查建議長度限制（5000字元）
  if (finalPrompt.length > 5000) {
    console.warn(`⚠️ Prompt 長度 ${finalPrompt.length} 超過 5000 字元建議上限`);
  }

  return finalPrompt;
}

// ═══════════════════════════════════════════════════════════
// 匯出
// ═══════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildPrompt };
}
