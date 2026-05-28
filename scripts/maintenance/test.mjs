import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function read(file) {
  return readFileSync(join(rootDir, file), 'utf-8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadCore() {
  const module = { exports: {} };
  const exports = module.exports;
  vm.runInNewContext(read('core.js'), { module, exports, console }, { filename: 'core.js' });
  return module.exports;
}

function extractInlineScripts(html) {
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .join('\n');
}

class ElementStub {
  constructor(id) {
    this.id = id;
    this.children = [];
    this.style = {};
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
  }

  appendChild(child) {
    this.children.push(child);
  }

  select() {}

  scrollIntoView() {}
}

function runUiSmokeTest() {
  const html = read('index.html');
  const external = `${read('prompt_governance.js')}\n${read('core.js')}`;
  const inline = extractInlineScripts(html);
  const ids = [
    'catStrip',
    'presetGrid',
    'ratioChips',
    'themeInput',
    'sceneInput',
    'costumeInput',
    'makeupInput',
    'out',
    'charCount',
    'outActions',
    'randStyleName',
    'outputShell',
    'totalEntryCount',
    'copyBtn'
  ];
  const elements = Object.fromEntries(ids.map(id => [id, new ElementStub(id)]));

  const document = {
    body: new ElementStub('body'),
    createElement: tag => new ElementStub(tag),
    execCommand: () => true,
    getElementById: id => elements[id] || null
  };
  document.body.appendChild = () => {};
  document.body.removeChild = () => {};

  const window = {
    PROMPT_GOVERNANCE: {},
    pageXOffset: 0,
    pageYOffset: 0,
    scrollX: 0,
    scrollY: 0,
    scrollTo: () => {}
  };
  const sandbox = {
    console: { error() {}, warn() {}, log() {}, info() {} },
    document,
    window,
    navigator: {},
    localStorage: { getItem: () => null, setItem: () => {} },
    alert: message => { throw new Error(`Unexpected alert: ${message}`); },
    setTimeout: fn => fn()
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(`${external}\n${inline}`, sandbox, { filename: 'ui-runtime' });

  assert(elements.catStrip.children.length > 0, '風格大類未渲染');
  assert(elements.presetGrid.children.length > 0, '角色卡未渲染');
  assert(elements.ratioChips.children.length > 0, '比例選項未渲染');
  sandbox.doRandomAndCopy();
  assert(elements.out.textContent.length > 1200, '快速隨機未產生有效 prompt');
  assert(elements.randStyleName.textContent, '快速隨機未更新風格名稱');
}

console.log('🧪 執行測試...\n');

try {
  const { buildPrompt } = loadCore();
  assert(typeof buildPrompt === 'function', 'core.js 未匯出 buildPrompt');

  const prompt = buildPrompt({
    theme: '測試主題',
    scene: 'moonlit palace courtyard with distant mountains and cinematic haze',
    costume: 'layered silk dress with readable textile weight and compact hair ornaments',
    makeup: 'surface-level makeup only, original facial structure preserved',
    action: 'woman standing naturally with hands near waist, face clear and readable',
    composition: 'full-body composition with realistic head-to-body proportion',
    ratio: 'r_23',
    lens: 'l_50',
    angle: 'quan',
    lightStyle: 'ls_cinematic',
    atmosphere: 'at_moody',
    cameraLang: 'cl_documentary'
  });

  assert(prompt.includes('【真人身份優先｜最高權重】'), '缺少真人身份優先段落');
  assert(prompt.includes('【負面詞｜非常重要】'), '缺少負面詞段落');
  assert(prompt.includes('moonlit palace courtyard'), '場景未進入 prompt');
  assert(prompt.length > 1200, `prompt 長度過短: ${prompt.length}`);
  assert(prompt.length < 5000, `prompt 長度過長: ${prompt.length}`);
  console.log(`✓ Prompt 生成正常，長度 ${prompt.length}`);

  runUiSmokeTest();
  console.log('✓ UI runtime smoke test 通過');

  console.log('\n✓ 所有測試通過');
} catch (err) {
  console.error(`✗ 測試失敗: ${err.message}`);
  process.exit(1);
}
