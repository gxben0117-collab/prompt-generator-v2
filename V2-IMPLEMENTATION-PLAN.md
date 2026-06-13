# v2.0 完整實施計畫書

**版本**: v2.0 Final Implementation Plan  
**日期**: 2026-06-13  
**預估工期**: 10-15 天  
**目標**: 全新創建 540 張角色卡 + 五層 Prompt 引擎架構  

---

## 📋 專案總覽

### 核心目標
1. ✅ 建立 27 個分類（已定義）
2. ✅ 創建 540 張角色卡（27 × 20）
3. ✅ 實現五層 Prompt 引擎
4. ✅ 100% 保留咒語鎖臉系統
5. ✅ 模組化架構便於維護

### 成功標準
- 每個分類有 20 張獨特角色卡
- 臉部還原度 85%+
- Prompt Token 優化 40%
- 風格統一專業
- UI 完整整合

---

## 🏗️ 新架構設計

### 檔案結構樹

```
src/
├── core/                                    # 核心引擎
│   ├── faceLockEngine.js                   # Layer 1: 身份鎖定
│   ├── sceneEngine.js                      # Layer 2: 場景引擎
│   ├── costumeLayerEngine.js               # Layer 3: 10 層服裝
│   ├── photographyEngine.js                # Layer 4: 攝影參數
│   ├── styleEngine.js                      # Layer 5: 畫風選擇
│   └── promptBuilder.js                    # Prompt 組裝器
│
├── categories/                              # 27 個分類定義
│   ├── 01-eastern-court/                   # 東方宮廷史實（9個）
│   │   ├── tang-daming.js                  # 盛唐大明宮
│   │   ├── tang-jiaofang.js                # 盛唐教坊
│   │   ├── han-changxin.js                 # 漢宮長信
│   │   ├── weijin-qingtan.js               # 魏晉清談
│   │   ├── song-bianliang.js               # 宋韻汴梁
│   │   ├── ming-zhijin.js                  # 明宮織金
│   │   ├── qing-qizhuang.js                # 清宮旗裝
│   │   ├── tang-yingshi.js                 # 泛唐影視
│   │   └── qingong-chongfei.js             # 寢宮寵妃
│   │
│   ├── 02-eastern-regional/                # 東方民族地域（3個）
│   │   ├── changxiangsi.js                 # 長相思
│   │   ├── miaojiang.js                    # 苗疆銀飾
│   │   └── dunhuang.js                     # 敦煌飛天
│   │
│   ├── 03-mythology/                        # 神話妖靈（5個）
│   │   ├── jiuwei-fox.js                   # 九尾妖狐
│   │   ├── meimu.js                        # 夜宴魅魔
│   │   ├── fallen-angel.js                 # 墮羽黑翼
│   │   ├── xianxia.js                      # 仙俠劇風
│   │   └── dark-royalty.js                 # 暗黑王族
│   │
│   ├── 04-scenery-travel/                  # 江南田園（2個）
│   │   ├── jiangnan.js                     # 江南煙雨
│   │   └── countryside.js                  # 田園花海
│   │
│   ├── 05-world-fashion/                   # 世界旅拍（4個）
│   │   ├── landmarks.js                    # 巴黎鐵塔
│   │   ├── wedding.js                      # 高訂婚紗
│   │   ├── cyberpunk.js                    # 賽博機甲
│   │   └── anime-street.js                 # 二次元
│   │
│   └── 06-epic-classic/                    # 武俠史詩（4個）
│       ├── hongloumeng.js                  # 紅樓金陵
│       ├── wuxia.js                        # 武俠江湖
│       ├── western-epic.js                 # 西方史詩
│       └── fairy-garden.js                 # 花園精靈
│
├── profiles/                                # 540 張角色卡 JSON
│   ├── tang-daming-profiles.json           # 20 張
│   ├── tang-jiaofang-profiles.json         # 20 張
│   ├── ... (共 27 個檔案)
│   └── fairy-garden-profiles.json          # 20 張
│
├── engines/                                 # 業務邏輯
│   ├── categoryClassifier.js              # 分類推斷
│   ├── profileFactory.js                   # 角色卡工廠
│   └── categoryLoader.js                   # 分類載入器
│
├── ui/                                      # UI 層
│   ├── App.jsx                             # 主應用
│   ├── CategorySelector.jsx               # 分類選擇器
│   └── ProfileCard.jsx                     # 角色卡展示
│
└── data.js                                  # 主入口（整合所有模組）
```

---

## 📅 實施時程（15 天）

### 第 1 天：建立核心引擎骨架

#### 任務清單
- [ ] 建立 `src/core/` 資料夾
- [ ] 創建 `faceLockEngine.js`（提取現有咒語鎖臉邏輯）
- [ ] 創建 `sceneEngine.js`（場景模板引擎）
- [ ] 創建 `costumeLayerEngine.js`（保留 10 層邏輯）
- [ ] 創建 `photographyEngine.js`（攝影參數引擎）
- [ ] 創建 `styleEngine.js`（畫風選擇引擎）
- [ ] 創建 `promptBuilder.js`（組裝引擎）

#### 預期產出
- 6 個核心引擎檔案
- 基礎 Prompt 組裝邏輯
- 單元測試檔案

---

### 第 2-3 天：建立 27 個分類定義

#### 任務清單
- [ ] 建立 6 個主題資料夾
- [ ] 撰寫 27 個分類定義檔案

#### 每個分類檔案包含

```javascript
// categories/01-eastern-court/tang-daming.js
export default {
  id: 'tang-daming',
  name: '盛唐大明宮｜貴妃考據｜史實禮制',
  parentCategory: '東方宮廷史實',
  
  // 視覺特色
  visualStyle: {
    palette: ['牡丹紅', '金色', '孔雀綠', '寶石藍'],
    costumeKeywords: ['襦裙', '半臂', '披帛', '鳳冠'],
    sceneKeywords: ['大明宮', '含元殿', '宮燈', '廊柱'],
    propKeywords: ['玉璽', '團扇', '金步搖', '寶石'],
  },
  
  // 場景模板
  sceneTemplate: {
    location: 'Daming Palace Hanyuan Hall',
    atmosphere: 'grand Tang dynasty imperial court',
    lighting: 'warm palace lantern glow with golden rim light',
    foreground: 'palace lanterns, silk curtains',
    midground: 'character in ceremonial pose',
    background: 'grand palace pillars, distant palace gates',
  },
  
  // 服裝偏好
  costumePreferences: {
    dynasty: 'Tang',
    rank: 'imperial consort',
    formality: 'high ceremonial',
    colors: ['peony red', 'gold', 'peacock green'],
    materials: ['silk', 'brocade', 'gauze'],
    embroidery: ['peony patterns', 'phoenix motifs', 'cloud patterns'],
  },
  
  // 攝影建議
  photographyPreset: 'palace-portrait',
  
  // 推薦畫風
  recommendedStyle: 'photorealistic',
  
  // 分類推斷規則
  classificationRules: {
    keywords: ['大明宮', '盛唐', '貴妃', '宮廷', '襦裙'],
    priority: 10,
    exclusions: ['魏晉', '宋代', '明代', '清代'],
  },
};
```

#### 預期產出
- 27 個完整的分類定義檔案
- 每個分類有完整的視覺、場景、服裝、攝影配置

---

### 第 4-13 天：創建 540 張角色卡（每天 54 張）

#### 任務分配

**第 4-5 天**：東方宮廷史實（9 個分類，180 張）
- 盛唐大明宮 (20)
- 盛唐教坊 (20)
- 漢宮長信 (20)
- 魏晉清談 (20)
- 宋韻汴梁 (20)
- 明宮織金 (20)
- 清宮旗裝 (20)
- 泛唐影視 (20)
- 寢宮寵妃 (20)

**第 6 天**：東方民族地域（3 個分類，60 張）
- 長相思 (20)
- 苗疆銀飾 (20)
- 敦煌飛天 (20)

**第 7-8 天**：神話妖靈奇幻（5 個分類，100 張）
- 九尾妖狐 (20)
- 夜宴魅魔 (20)
- 墮羽黑翼 (20)
- 仙俠劇風 (20)
- 暗黑王族 (20)

**第 9 天**：江南田園旅拍（2 個分類，40 張）
- 江南煙雨 (20)
- 田園花海 (20)

**第 10 天**：世界旅拍時尚（4 個分類，80 張）
- 巴黎鐵塔 (20)
- 高訂婚紗 (20)
- 賽博機甲 (20)
- 二次元 (20)

**第 11 天**：武俠史詩經典（4 個分類，80 張）
- 紅樓金陵 (20)
- 武俠江湖 (20)
- 西方史詩 (20)
- 花園精靈 (20)

**第 12-13 天**：微調與補充

#### 角色卡 JSON 格式

```json
{
  "id": "tang-daming-01",
  "title": "盛唐大明宮貴妃・牡丹晨光",
  "categoryId": "tang-daming",
  "aliases": ["牡丹貴妃", "晨光王姬", "大明宮貴妃"],
  
  "scene": {
    "location": "Daming Palace Hanyuan Hall grand terrace",
    "time": "golden morning sunlight",
    "weather": "clear spring day",
    "atmosphere": "majestic imperial ceremony",
    "props": ["jade imperial seal", "palace fan", "peony flowers"]
  },
  
  "makeup": {
    "base": "natural Tang dynasty court makeup",
    "eyes": "subtle peony red eyeshadow",
    "lips": "cherry red lips",
    "hair": "elaborate Tang dynasty updo with phoenix crown"
  },
  
  "costume": {
    "layer1": "silk inner lining, natural body proportion, chest and torso foundation",
    "layer2": "Tang dynasty ruqun base structure, high waist support",
    "layer3": "golden embroidered waist band, peony pattern, jade clasps",
    "layer4": "multi-layer silk skirt panels in peony red and peacock green",
    "layer5": "jade waist ornaments, golden tassels, ceremonial details",
    "layer6": "flowing silk披帛 draping from shoulders, natural fabric physics",
    "layer7": "embroidered半臂 jacket, golden thread phoenix motifs",
    "layer8": "jade jewelry set, golden髮簪, pearl earrings",
    "layer9": "phoenix crown with golden ornaments and pearl tassels",
    "layer10": "overall Tang empress ceremonial silhouette, grand and dignified"
  },
  
  "action": {
    "pose": "standing gracefully on palace steps, holding jade seal",
    "hands": "both hands gently holding jade seal at waist level",
    "gaze": "confident dignified gaze toward camera",
    "bodyLanguage": "upright posture, natural weight distribution"
  },
  
  "photography": {
    "framing": "medium close-up, waist-up",
    "cameraAngle": "eye-level, slight low angle for majesty",
    "focus": "face and upper body in sharp focus",
    "depthOfField": "shallow, background softly blurred"
  },
  
  "lighting": {
    "keyLight": "golden morning sunlight from front-left",
    "rimLight": "soft edge separation on hair and phoenix crown",
    "fillLight": "subtle palace lantern warmth",
    "ambient": "warm imperial palace atmosphere"
  },
  
  "style": "photorealistic",
  
  "negativePrompt": [
    "no AI beauty filter",
    "no face swap",
    "no generic pretty face",
    "no doll-like features",
    "avoid revealing clothing",
    "avoid modern accessories"
  ]
}
```

#### 預期產出
- 27 個 JSON 檔案
- 每個檔案包含 20 張角色卡
- 總計 540 張完整定義

---

### 第 14 天：整合與測試

#### 任務清單
- [ ] 更新 `src/engines/categoryLoader.js`（載入 27 個分類）
- [ ] 更新 `src/engines/profileFactory.js`（從 JSON 創建角色卡）
- [ ] 更新 `src/data.js`（主入口整合）
- [ ] 實現 `promptBuilder.js` 完整邏輯
- [ ] UI 整合（分類選擇器、角色卡展示）
- [ ] 測試 50 組角色卡輸出

#### promptBuilder.js 完整邏輯

```javascript
// src/core/promptBuilder.js
import { FACE_LOCK_PROMPT } from './faceLockEngine.js';
import { buildScenePrompt } from './sceneEngine.js';
import { buildCostumePrompt } from './costumeLayerEngine.js';
import { PHOTOGRAPHY_PRESETS } from './photographyEngine.js';
import { VISUAL_STYLES } from './styleEngine.js';

export function buildFinalPrompt(profile, category) {
  const parts = [];
  
  // Layer 1: 身份鎖定（最高權重）
  parts.push('// FACE LOCK - HIGHEST PRIORITY');
  parts.push(FACE_LOCK_PROMPT.mandatory.join(', '));
  parts.push('');
  
  // Layer 2: 場景
  parts.push('// SCENE');
  const scene = buildScenePrompt(profile.scene, category.sceneTemplate);
  parts.push(scene);
  parts.push('');
  
  // Layer 3: 服裝（10 層）
  parts.push('// COSTUME - 10 LAYERS');
  const costume = buildCostumePrompt(profile.costume);
  parts.push(costume);
  parts.push('');
  
  // Layer 4: 攝影
  parts.push('// PHOTOGRAPHY');
  const photography = PHOTOGRAPHY_PRESETS[profile.photography.framing];
  parts.push(photography.join(', '));
  parts.push('');
  
  // Layer 5: 畫風
  parts.push('// VISUAL STYLE');
  const style = VISUAL_STYLES[profile.style];
  parts.push(style.join(', '));
  parts.push('');
  
  // Negative Prompt
  const negative = [
    ...FACE_LOCK_PROMPT.prohibitions,
    ...profile.negativePrompt
  ];
  parts.push('// NEGATIVE PROMPT');
  parts.push(negative.join(', '));
  
  return {
    positive: parts.join('\n'),
    negative: negative.join(', '),
    layers: {
      faceLock: FACE_LOCK_PROMPT.mandatory,
      scene,
      costume,
      photography,
      style
    }
  };
}
```

#### 預期產出
- 完整的 Prompt 組裝系統
- UI 正常運作
- 測試報告

---

### 第 15 天：文件、部署與上線

#### 任務清單
- [ ] 撰寫 README.md
- [ ] 撰寫 CHANGELOG.md
- [ ] 更新 package.json 版本號（v2.0.0）
- [ ] `npm run build`
- [ ] 測試 100 組角色卡
- [ ] Git commit 與 push
- [ ] 部署到生產環境

#### 預期產出
- 完整文件
- v2.0.0 正式版本
- 生產環境部署

---

## 🔧 核心引擎詳細設計

### 1. faceLockEngine.js

```javascript
// src/core/faceLockEngine.js

export const FACE_LOCK_PROMPT = {
  mandatory: [
    "preserve uploaded face identity",
    "maintain original facial features",
    "keep original eye shape and nose structure",
    "retain natural face asymmetry",
    "preserve real skin texture",
    "maintain jawline and face proportions",
    "keep mature age appearance",
    "realistic facial bone structure",
  ],
  
  prohibitions: [
    "no AI beauty filter",
    "no face swap",
    "no generic AI model face",
    "no instagram filter",
    "no doll-like features",
    "no plastic skin",
    "no face template",
  ],
  
  chinese: [
    "保留上傳照片原始臉型",
    "保留原始眼型、鼻型、嘴型",
    "保留下顎線與五官比例",
    "保留自然不對稱特徵",
    "保留真實皮膚紋理",
    "保留成熟年齡感",
    "禁止AI美女模板臉",
    "禁止換臉",
    "禁止網紅濾鏡",
  ],
  
  weight: 1.5, // 最高權重
};

export function getFaceLockPrompt(language = 'english') {
  if (language === 'chinese') {
    return FACE_LOCK_PROMPT.chinese.join('，');
  }
  return FACE_LOCK_PROMPT.mandatory.join(', ');
}
```

---

### 2. sceneEngine.js

```javascript
// src/core/sceneEngine.js

export function buildScenePrompt(profileScene, categoryTemplate) {
  const parts = [];
  
  // 主場景
  parts.push(profileScene.location || categoryTemplate.location);
  
  // 氛圍
  if (profileScene.atmosphere || categoryTemplate.atmosphere) {
    parts.push(profileScene.atmosphere || categoryTemplate.atmosphere);
  }
  
  // 時間與天氣
  if (profileScene.time) parts.push(profileScene.time);
  if (profileScene.weather) parts.push(profileScene.weather);
  
  // 前景、中景、遠景
  const foreground = profileScene.foreground || categoryTemplate.foreground;
  const midground = profileScene.midground || categoryTemplate.midground;
  const background = profileScene.background || categoryTemplate.background;
  
  if (foreground) parts.push(`foreground: ${foreground}`);
  if (midground) parts.push(`midground: ${midground}`);
  if (background) parts.push(`background: ${background}`);
  
  // 道具
  if (profileScene.props && profileScene.props.length > 0) {
    parts.push(`props: ${profileScene.props.join(', ')}`);
  }
  
  return parts.join(', ');
}
```

---

### 3. costumeLayerEngine.js

```javascript
// src/core/costumeLayerEngine.js

export function buildCostumePrompt(costumeLayers) {
  const layers = [];
  
  for (let i = 1; i <= 10; i++) {
    const layerKey = `layer${i}`;
    if (costumeLayers[layerKey]) {
      layers.push(`Layer ${i}: ${costumeLayers[layerKey]}`);
    }
  }
  
  return layers.join('. ');
}

export function validateCostumeLayers(costumeLayers) {
  const requiredLayers = [1, 2, 3, 10];
  
  for (const layer of requiredLayers) {
    if (!costumeLayers[`layer${layer}`]) {
      throw new Error(`Required costume layer ${layer} is missing`);
    }
  }
  
  return true;
}
```

---

### 4. photographyEngine.js

```javascript
// src/core/photographyEngine.js

export const PHOTOGRAPHY_PRESETS = {
  'portrait': {
    lens: '50mm portrait lens',
    framing: 'medium close-up, face and upper body',
    focus: 'face in sharp focus, shallow depth of field f/2.8',
    composition: 'rule of thirds, eyes at upper third line',
  },
  
  'full-body': {
    lens: '35mm lens',
    framing: 'full body shot, head to toe visible',
    focus: 'entire figure in focus, f/5.6',
    composition: 'centered with environmental context',
  },
  
  'palace-portrait': {
    lens: '50mm portrait lens',
    framing: 'waist-up, ceremonial pose',
    focus: 'face and costume details in focus, f/4',
    composition: 'symmetrical, grand and dignified',
  },
};

export const LIGHTING_PRESETS = {
  'golden-hour': [
    'golden hour natural light',
    'soft warm sunlight from front-left',
    'gentle rim light on hair and shoulders',
    'subtle fill light for face',
  ],
  
  'palace-lantern': [
    'warm palace lantern glow',
    'golden amber key light',
    'soft edge separation lighting',
    'subtle bounce light from silk fabrics',
  ],
  
  'moonlight': [
    'cool moonlight from above',
    'silvery blue rim light',
    'soft shadows',
    'ethereal atmosphere',
  ],
};

export function getPhotographyPrompt(preset, lighting) {
  const photo = PHOTOGRAPHY_PRESETS[preset];
  const light = LIGHTING_PRESETS[lighting];
  
  return [
    ...Object.values(photo),
    ...light,
    'cinematic photography',
    'high facial detail',
    'realistic skin texture',
    'professional color grading',
  ].join(', ');
}
```

---

### 5. styleEngine.js

```javascript
// src/core/styleEngine.js

export const VISUAL_STYLES = {
  photorealistic: [
    'photorealistic portrait',
    'cinematic movie still',
    'realistic lighting and shadow',
    'natural color palette',
    'high detail photograph',
    'professional photography',
  ],
  
  webtoon: [
    'Korean webtoon illustration style',
    'soft digital painting',
    'semi-realistic character art',
    'fantasy illustration',
    'smooth rendering',
  ],
  
  chineseCG: [
    'Chinese fantasy CG illustration',
    'high-end character design',
    'epic fantasy art style',
    'detailed digital painting',
    'cinematic illustration',
  ],
};

export function getStylePrompt(styleName) {
  return VISUAL_STYLES[styleName] || VISUAL_STYLES.photorealistic;
}
```

---

## 📊 品質控制檢查清單

### 每張角色卡必須包含
- [ ] 完整的 10 層服裝描述
- [ ] 場景的前景/中景/遠景
- [ ] 明確的人物動作與姿態
- [ ] 攝影參數（鏡頭、構圖、景深）
- [ ] 光線描述（主光、輪廓光、補光）
- [ ] Negative Prompt

### 每個分類必須確保
- [ ] 20 張角色卡風格統一
- [ ] 色彩、服飾符合分類特色
- [ ] 場景多樣化（不重複）
- [ ] 動作姿態有變化

### 系統整體檢查
- [ ] 所有 27 個分類載入正常
- [ ] Prompt 組裝邏輯正確
- [ ] UI 顯示完整
- [ ] 分類推斷功能正常
- [ ] 測試 100 組角色卡無錯誤

---

## 🎯 里程碑與交付物

### 里程碑 1（第 1 天）
**交付物**：
- 6 個核心引擎檔案
- 基礎架構完成

### 里程碑 2（第 3 天）
**交付物**：
- 27 個分類定義檔案
- 分類載入器完成

### 里程碑 3（第 13 天）
**交付物**：
- 540 張角色卡 JSON
- 所有角色卡定義完成

### 里程碑 4（第 14 天）
**交付物**：
- UI 整合完成
- 測試通過

### 里程碑 5（第 15 天）
**交付物**：
- v2.0 正式上線
- 完整文件

---

## ✅ 最終確認

- [x] 27 個分類已定義
- [x] 五層 Prompt 引擎架構已設計
- [x] 540 張角色卡格式已確定
- [x] 15 天實施計畫已完成
- [ ] **等待開始實施 v2.0 開發**

---

**準備好了！隨時可以開始 v2.0 開發工作！**
