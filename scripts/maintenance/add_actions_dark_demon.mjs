import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

console.log('=== 為暗黑魔族角色卡添加50mm電影級動作鏡頭語言 ===\n');

// 定義暗黑魔族4大系列包含的分類
const darkDemonCategories = [
  '魅魔系列', '莉莉絲', '魅魔魔王', '暗黑魅魔', '魅魔暗殿', '魅魔王座',
  '女王系列', '夜之女王', '魔冕女皇', '冥界女王', '吸血鬼女王', '亡靈女王', '冰雪女王', '龍族女王',
  '女魔王', '滅世魔女', '魔女', '女巫', '暗夜魔女', '暗魔女巫', '預言女巫',
  '墮天使系列', '奇幻魔法｜墮天使系列', '墮天使', '暗黑哥德 v0.27', '暗黑哥德',
  '魔界系列', '冥界系列', '火獄系列', '暗黑史詩', '冥界魔后', '暗黑古風',
  '暗黑東方', '暗黑戰甲', '武俠江湖（暗黑變體）', '世界地標旅拍（暗黑幻想）',
  '世界民族服飾（暗黑變體）'
];

// 50mm電影級動作鏡頭語言模板庫（參考魅魔和墮天使已有的動作）
const actionTemplates = [
  // 站立系列
  'standing motionless with flowing fabric moving naturally behind, face fully visible and stable, arms relaxed at sides, calm powerful expression, hair moving softly, wide cinematic composition, 50mm full-frame realism, dramatic backlight, volumetric atmospheric lighting, epic dark fantasy atmosphere',

  'standing directly facing camera, face fully visible and unobstructed, chin slightly lowered, intense direct eye contact, shoulders relaxed but confident, hands resting naturally near waist, natural cinematic posture, centered framing, 50mm full-frame lens, shallow depth of field, soft dark background separation, dark fantasy film frame',

  'standing beneath dramatic lighting, body angled slightly toward camera, face remaining fully visible, one shoulder lowered naturally, hair moving softly in wind, subtle breathing motion, cinematic medium shot, 50mm lens, rim lighting, soft fog diffusion, dark fantasy atmosphere',

  // 手部動作系列
  'raising one hand naturally while dark energy gathers around fingers, face fully visible toward camera, stable realistic posture, subtle breathing motion, calm focused gaze, dark fantasy cinematic shot, 50mm lens, floating magical particles, controlled volumetric lighting, natural fantasy realism',

  'slowly spreading arms with fabric flowing dramatically behind, face remaining fully visible, balanced body posture, natural hand movement, hair moving with motion, elegant dominant presence, cinematic hero framing, 50mm realism, slow-motion atmosphere, soft particle lighting, dramatic fabric motion',

  'one hand lightly touching nearby surface, face fully visible throughout composition, natural relaxed posture, subtle finger movement, calm expression, stable body position, cinematic portrait framing, 50mm photography, foreground blur, atmospheric depth, natural lighting',

  // 坐姿系列
  'sitting upright on dark throne, face fully visible toward camera, chin slightly lowered, hands resting naturally on armrests, calm dominant expression, stable body posture, low-angle cinematic composition, 50mm portrait photography, soft firelight reflections, foreground depth blur, dark luxury atmosphere',

  'sitting elegantly with one leg crossed, face fully visible and stable, hands resting gracefully on lap, confident calm expression, natural posture, cinematic medium shot, 50mm lens, soft side lighting, shallow depth of field, dark elegant atmosphere',

  // 行走系列
  'slowly walking toward camera, face fully visible, maintaining direct eye contact, one hand lightly holding flowing fabric near waist, natural relaxed shoulder posture, subtle breathing motion, physically natural movement, cinematic tracking shot, 50mm full-frame lens, shallow depth of field, soft atmospheric haze, natural cinematic lighting',

  'walking slowly through dark atmospheric space, face fully visible throughout, long fabric layers moving naturally, stable cinematic posture, one hand brushing lightly against nearby surface, tracking composition, 50mm photography, foreground blur, volumetric light beams, dark fantasy film realism',

  // 轉身系列
  'slowly turning to face camera, face becoming fully visible, hair and fabric flowing naturally with motion, arms moving gracefully, natural body rotation, cinematic reveal shot, 50mm lens, dramatic lighting transition, soft motion blur, dark fantasy atmosphere',

  'turning head slowly toward camera while body remains still, face fully visible, intense eye contact, hair moving softly, shoulders relaxed, subtle mysterious smile, cinematic close-up, 50mm portrait lens, shallow depth of field, soft rim lighting, dark atmospheric background',

  // 低頭/抬頭系列
  'head lowered slightly while eyes look directly toward camera, face fully unobstructed, hands relaxed naturally near waist, subtle unreadable smile, natural shoulder balance, physically realistic posture, cinematic portrait framing, 50mm photography, soft shallow depth of field, subtle atmospheric glow, dark fantasy film frame',

  'slowly raising head to reveal face, eyes meeting camera directly, hair falling naturally into place, calm powerful expression, hands at sides, natural body posture, cinematic reveal shot, 50mm lens, dramatic lighting, soft focus background, dark fantasy atmosphere',

  // 特殊環境系列
  'standing before burning flames, face fully visible and stable, eyes locked toward camera, hands resting naturally near waist, physically realistic posture, slow graceful movement, cinematic firelit portrait, 50mm composition, warm ember reflections, dark atmospheric depth, natural cinematic contrast',

  'standing within drifting smoke or mist, face fully visible throughout, arms relaxed at sides, calm dangerous expression, hair and fabric moving softly, wide cinematic composition, 50mm lens, dramatic backlight, volumetric lighting, epic dark fantasy atmosphere',

  'standing in falling particles or petals, face fully visible and stable, one hand extended naturally, calm serene expression, natural body posture, particles moving around but not obscuring face, cinematic medium shot, 50mm lens, soft diffused lighting, shallow depth of field, dark fantasy atmosphere',

  // 互動系列
  'reaching toward camera with one hand, face fully visible, direct eye contact, natural arm extension, other hand at side, confident expression, stable body posture, cinematic POV shot, 50mm lens, shallow focus on face, soft atmospheric lighting, dark fantasy atmosphere',

  'holding dark object naturally in hands, face fully visible above, calm focused expression, hands positioned naturally at chest level, stable posture, cinematic medium shot, 50mm lens, soft key lighting, foreground blur, dark atmospheric background',

  // 靜態凝視系列
  'standing completely still with intense gaze toward camera, face fully visible and sharp, minimal movement except subtle breathing, hands relaxed at sides, powerful calm presence, cinematic portrait, 50mm lens, dramatic lighting, shallow depth of field, dark fantasy atmosphere'
];

let updateCount = 0;
let actionIndex = 0;

// 遍歷所有分類
cats.forEach(cat => {
  if (!darkDemonCategories.includes(cat.name)) {
    return;
  }

  cat.entries.forEach(entry => {
    const hasAction = entry.action && entry.action.trim() !== '';

    if (!hasAction) {
      // 使用模板庫中的動作（循環使用）
      entry.action = actionTemplates[actionIndex % actionTemplates.length];

      updateCount++;
      console.log(`✓ ${entry.name}`);
      console.log(`  分類: ${cat.name}`);
      console.log(`  動作: ${entry.action.substring(0, 100)}...`);
      console.log('');

      actionIndex++;
    }
  });
});

// 將更新後的數據轉換回 JSON
const newCatsJson = JSON.stringify(cats, null, 2);
html = html.replace(/const CATS = \[[\s\S]*?\n\];/, `const CATS = ${newCatsJson};`);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('='.repeat(60));
console.log(`✅ 完成！共為 ${updateCount} 個暗黑魔族角色卡添加了50mm電影級動作鏡頭語言`);
