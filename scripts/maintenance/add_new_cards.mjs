import fs from 'fs';

const htmlPath = 'c:\\AIProjects\\001專案完成區\\美片咒語產生器\\index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 提取 CATS 數組
const catsMatch = html.match(/const CATS = (\[[\s\S]*?\n\]);/);
if (!catsMatch) {
  console.error('找不到 CATS 數組');
  process.exit(1);
}

const cats = JSON.parse(catsMatch[1]);

// 基礎高級訂製描述
const baseOutfit = 'high-end couture structure, cinematic fabric weight, realistic tailoring construction, natural fabric draping, realistic transparent layering, luxury embroidery craftsmanship, realistic gold-thread details, realistic jewelry craftsmanship, realistic metal ornaments, high-end cinematic costume silhouette, natural air flow sensation, realistic fabric translucency, multi-layer garment structure';

// 10組新魅魔角色卡
const newSuccubus = [
  {
    name: '暗影誘惑魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'dark shadow realm with floating crimson mist, mysterious silhouettes in background',
    outfit: 'shadow black and deep crimson ' + baseOutfit + ', seductive crimson lace lingerie beneath flowing shadow veils, transparent dark layers, shadow pattern accents, crimson jewelry, elegant curved black demon horns with shadow patterns',
    action: ''
  },
  {
    name: '月夜幻夢魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'moonlit dream realm, floating silver particles, ethereal night atmosphere',
    outfit: 'moonlit silver and midnight blue ' + baseOutfit + ', delicate silver lace bodysuit beneath transparent moonlight fabric, sheer blue layers, silver moon accents, sapphire jewelry, graceful translucent blue butterfly wings with silver moon patterns',
    action: ''
  },
  {
    name: '血玫瑰魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'dark rose garden with blood-red roses, black thorns, gothic atmosphere',
    outfit: 'blood red and thorn black ' + baseOutfit + ', blood-red rose-pattern lace corset beneath sheer black fabric, transparent thorn layers, rose accents, ruby jewelry, sharp black crystalline demon horns with rose-thorn texture',
    action: ''
  },
  {
    name: '星空迷醉魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'cosmic starry void, floating nebula clouds, celestial atmosphere',
    outfit: 'cosmic deep purple and starlight white ' + baseOutfit + ', starlight white lace lingerie beneath transparent cosmic fabric, sheer purple layers, star pattern accents, amethyst jewelry, elegant purple crystalline demon horns with star patterns',
    action: ''
  },
  {
    name: '冰焰雙生魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'realm of ice and fire collision, blue frost meeting red flames',
    outfit: 'ice blue and flame red gradient ' + baseOutfit + ', gradient blue-red lace bodysuit beneath sheer dual-tone fabric, transparent ice-fire layers, dual element accents, crystal jewelry, elegant ice-blue bat wings with flame-red membrane edges',
    action: ''
  },
  {
    name: '暗金奢華魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'dark luxury chamber, golden candlelight, black velvet curtains',
    outfit: 'dark gold and obsidian black ' + baseOutfit + ', luxurious gold lace corset beneath sheer black luxury fabric, transparent golden layers, gold ornament accents, gold jewelry, ornate golden demon horns with jeweled decorations',
    action: ''
  },
  {
    name: '紫霧迷幻魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'purple mist realm, floating silver particles, dreamlike atmosphere',
    outfit: 'mystic purple and silver mist ' + baseOutfit + ', mysterious purple lace lingerie beneath flowing silver mist fabric, transparent purple layers, mist pattern accents, amethyst jewelry, ethereal translucent purple butterfly wings with mist patterns',
    action: ''
  },
  {
    name: '暗夜女王魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'dark throne room, violet ambient light, royal dominance atmosphere',
    outfit: 'royal black and deep violet ' + baseOutfit + ', dominant violet-black lace bodysuit beneath royal sheer fabric, transparent power layers, royal accents, violet jewelry, majestic black crystalline demon horns with violet glow',
    action: ''
  },
  {
    name: '血月狂宴魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'blood moon night, dark eclipse sky, crimson moonlight atmosphere',
    outfit: 'blood moon red and eclipse black ' + baseOutfit + ', blood-red lace corset beneath transparent eclipse fabric, sheer crimson layers, moon pattern accents, ruby jewelry, elegant curved red-black demon horns with moon patterns',
    action: ''
  },
  {
    name: '水晶幻影魅魔',
    sub: '魅魔系列',
    cup: 'J',
    scene: 'crystal cave realm, amethyst formations, refracting light atmosphere',
    outfit: 'crystal clear and dark amethyst ' + baseOutfit + ', crystalline amethyst lace lingerie beneath transparent crystal fabric, sheer crystal layers, crystal accents, amethyst jewelry, sharp translucent crystal demon horns with inner glow',
    action: ''
  }
];

// 10組新墮天使角色卡
const newFallenAngels = [
  {
    name: '破曉審判墮天使',
    sub: '墮天使系列',
    scene: 'dawn battlefield with falling divine light, broken holy weapons scattered',
    outfit: 'corrupted dawn judgment gown, torn golden-white silk layers, shattered holy armor fragments, white-to-black gradient wing feathers, fallen morning star symbols, battle-scarred divine fabric, cracked celestial crown, heavy judgment fabric draping',
    action: ''
  },
  {
    name: '永夜哀歌墮天使',
    sub: '墮天使系列',
    scene: 'eternal night realm, no stars, only dark moon, sorrowful atmosphere',
    outfit: 'eternal night mourning dress, flowing midnight chiffon layers, silver moonlight filigree, black raven feather shoulder cape, corrupted lunar blessing ornaments, elegantly weathered night fabric, dark sapphire tear-drop jewelry, natural nocturnal fabric flow',
    action: ''
  },
  {
    name: '血誓背叛墮天使',
    sub: '墮天使系列',
    scene: 'broken altar with blood oath symbols, shattered divine contracts',
    outfit: 'blood oath betrayer gown, crimson-stained ceremonial silk, broken covenant chain armor, blood-red feather accents, shattered holy vow symbols, torn betrayal fabric edges, blood ruby guilt ornaments, heavy remorse fabric weight',
    action: ''
  },
  {
    name: '冰封懺悔墮天使',
    sub: '墮天使系列',
    scene: 'frozen cathedral ruins, ice crystals everywhere, eternal winter',
    outfit: 'frozen repentance cathedral dress, ice-crystal layered fabric, frost-covered silver armor, frozen white feather structure, ice-preserved holy relics, frost-cracked fabric details, frozen tear crystal jewelry, cold heavy fabric behavior',
    action: ''
  },
  {
    name: '焚天罪業墮天使',
    sub: '墮天使系列',
    scene: 'burning divine realm, falling ash, flames consuming heaven',
    outfit: 'burning sin punishment gown, flame-scorched divine fabric, molten gold armor remnants, ash-covered burnt feathers, fire-corrupted sacred symbols, flame-damaged holy fabric, ember-glowing jewelry, heat-warped fabric draping',
    action: ''
  },
  {
    name: '虛空放逐墮天使',
    sub: '墮天使系列',
    scene: 'void between dimensions, reality cracks, endless darkness',
    outfit: 'void exile ceremonial dress, reality-torn translucent fabric, void-corrupted metal armor, dissolving ethereal feathers, void-touched divine ornaments, reality-fractured fabric edges, void crystal jewelry, weightless floating fabric',
    action: ''
  },
  {
    name: '雷罰天譴墮天使',
    sub: '墮天使系列',
    scene: 'eternal storm realm, constant lightning, thunder judgment',
    outfit: 'thunder punishment warrior dress, storm-torn battle fabric, lightning-scarred armor plates, electric-charged feather details, storm god punishment symbols, lightning-burnt fabric damage, storm crystal ornaments, wind-battered fabric movement',
    action: ''
  },
  {
    name: '鏡界迷失墮天使',
    sub: '墮天使系列',
    scene: 'infinite mirror maze, multiple reflections, lost identity',
    outfit: 'mirror realm lost gown, reflective shattered fabric, mirror-fragment armor, crystalline reflection feathers, fractured identity symbols, mirror-cracked fabric texture, reflective shard jewelry, distorted reality fabric physics',
    action: ''
  },
  {
    name: '時間囚徒墮天使',
    sub: '墮天使系列',
    scene: 'frozen time realm, stopped clocks, eternal moment prison',
    outfit: 'time prison ceremonial dress, frozen-moment fabric layers, clockwork chain armor, time-stopped feather structure, eternal moment symbols, time-worn aged fabric, hourglass crystal jewelry, temporal-locked fabric state',
    action: ''
  },
  {
    name: '記憶抹除墮天使',
    sub: '墮天使系列',
    scene: 'realm of forgotten memories, fading images, identity loss',
    outfit: 'memory erasure mourning gown, fading translucent fabric, forgotten silver armor, disappearing feather details, erased identity ornaments, memory-faded fabric texture, forgotten crystal jewelry, ethereal fading fabric',
    action: ''
  }
];

// 10組新女王角色卡
const newQueens = [
  {
    name: '暗夜星辰女王',
    sub: '女王系列',
    scene: 'starlit night palace, floating star particles, cosmic royal atmosphere',
    outfit: 'midnight black and starlight silver ' + baseOutfit + ', star-pattern embroidery, silver crown with star motifs, cosmic jewelry, dark metal ornaments',
    action: ''
  },
  {
    name: '血焰戰爭女王',
    sub: '女王系列',
    scene: 'war throne room, burning banners, battle victory atmosphere',
    outfit: 'blood red and flame gold ' + baseOutfit + ', war embroidery, battle crown, ruby jewelry, war metal ornaments',
    action: ''
  },
  {
    name: '翡翠森林女王',
    sub: '女王系列',
    scene: 'ancient forest throne, emerald light, nature magic atmosphere',
    outfit: 'emerald green and forest gold ' + baseOutfit + ', leaf-pattern embroidery, nature crown, emerald jewelry, wooden metal ornaments',
    action: ''
  },
  {
    name: '深海珍珠女王',
    sub: '女王系列',
    scene: 'underwater palace throne, pearl light, oceanic royal atmosphere',
    outfit: 'deep ocean blue and pearl white ' + baseOutfit + ', wave-pattern embroidery, pearl crown, aquamarine jewelry, coral metal ornaments',
    action: ''
  },
  {
    name: '暗金權力女王',
    sub: '女王系列',
    scene: 'dark gold throne hall, power symbols, absolute dominance atmosphere',
    outfit: 'dark gold and obsidian black ' + baseOutfit + ', power-pattern embroidery, golden crown, black diamond jewelry, gold metal ornaments',
    action: ''
  },
  {
    name: '紫羅蘭夢境女王',
    sub: '女王系列',
    scene: 'dream palace, violet mist, ethereal royal atmosphere',
    outfit: 'royal purple and silver dream ' + baseOutfit + ', dream-pattern embroidery, ethereal crown, amethyst jewelry, silver metal ornaments',
    action: ''
  },
  {
    name: '白銀月光女王',
    sub: '女王系列',
    scene: 'moonlit palace, silver light, lunar royal atmosphere',
    outfit: 'silver white and moonlight blue ' + baseOutfit + ', moon-pattern embroidery, lunar crown, moonstone jewelry, silver metal ornaments',
    action: ''
  },
  {
    name: '赤銅烈焰女王',
    sub: '女王系列',
    scene: 'forge throne room, molten metal, fire power atmosphere',
    outfit: 'copper red and flame orange ' + baseOutfit + ', flame-pattern embroidery, fire crown, fire opal jewelry, copper metal ornaments',
    action: ''
  },
  {
    name: '冰晶霜雪女王',
    sub: '女王系列',
    scene: 'ice palace throne, frost crystals, eternal winter atmosphere',
    outfit: 'ice blue and frost white ' + baseOutfit + ', snowflake-pattern embroidery, ice crown, diamond jewelry, ice metal ornaments',
    action: ''
  },
  {
    name: '暗影虛空女王',
    sub: '女王系列',
    scene: 'void throne realm, shadow energy, absolute darkness atmosphere',
    outfit: 'void black and shadow purple ' + baseOutfit + ', void-pattern embroidery, shadow crown, onyx jewelry, dark metal ornaments',
    action: ''
  }
];

// 找到對應的分類並添加新角色卡
let succubusAdded = 0;
let fallenAngelAdded = 0;
let queenAdded = 0;

cats.forEach(cat => {
  // 添加魅魔系列
  if (cat.cat === '魅魔系列' || cat.entries.some(e => e.sub === '魅魔系列')) {
    newSuccubus.forEach(card => {
      cat.entries.push(card);
      succubusAdded++;
    });
    console.log(`✓ 魅魔系列添加 ${newSuccubus.length} 個新角色卡`);
  }

  // 添加墮天使系列
  if (cat.cat === '墮天使系列' || cat.entries.some(e => e.sub === '墮天使系列')) {
    newFallenAngels.forEach(card => {
      cat.entries.push(card);
      fallenAngelAdded++;
    });
    console.log(`✓ 墮天使系列添加 ${newFallenAngels.length} 個新角色卡`);
  }

  // 添加女王系列
  if (cat.cat === '女王系列' || cat.entries.some(e => e.sub === '女王系列')) {
    newQueens.forEach(card => {
      cat.entries.push(card);
      queenAdded++;
    });
    console.log(`✓ 女王系列添加 ${newQueens.length} 個新角色卡`);
  }
});

// 將更新後的數據轉換回 JSON
const newCatsJson = JSON.stringify(cats, null, 2);

// 替換原有的 CATS 數組
html = html.replace(
  /const CATS = \[[\s\S]*?\n\];/,
  `const CATS = ${newCatsJson};`
);

// 寫回文件
fs.writeFileSync(htmlPath, html, 'utf8');

console.log('');
console.log('='.repeat(60));
console.log('✅ 完成！');
console.log(`   魅魔系列：新增 ${succubusAdded} 個角色卡`);
console.log(`   墮天使系列：新增 ${fallenAngelAdded} 個角色卡`);
console.log(`   女王系列：新增 ${queenAdded} 個角色卡`);
console.log(`   總計新增：${succubusAdded + fallenAngelAdded + queenAdded} 個角色卡`);
