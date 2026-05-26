import "./styles.css";
import { COSTUME_LAYER_GROUPS, COSTUME_LAYERS } from "./data.js";
import { buildChatGptInstruction, DEFAULT_FORM, normalizeForm } from "./promptEngine.js";

const STORAGE_KEY = "hongbing-travel-prompt-state";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadState() {
  try {
    return normalizeForm(JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_FORM);
  } catch {
    return normalizeForm(DEFAULT_FORM);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeForm(state)));
}

function formToState(form) {
  return normalizeForm(Object.fromEntries(new FormData(form).entries()));
}

function costumeLayerFields(state) {
  return COSTUME_LAYER_GROUPS.map((group) => {
    const fields = COSTUME_LAYERS.filter((layer) => layer.group === group.id)
      .map(
        (layer) => `
          <label>
            <span>${escapeHtml(layer.label)}</span>
            <input name="${escapeHtml(layer.id)}" value="${escapeHtml(state[layer.id])}" placeholder="${escapeHtml(layer.placeholder)}" />
          </label>`,
      )
      .join("");

    return `
      <div class="layer-group-block">
        <div>
          <div class="layer-group-title">${escapeHtml(group.label)}</div>
          <p class="layer-group-help">${escapeHtml(group.prompt)}</p>
        </div>
        <div class="layer-grid">${fields}</div>
      </div>`;
  }).join("");
}

function render() {
  const state = loadState();

  document.querySelector("#app").innerHTML = `
    <main class="shell">
      <section class="workspace" aria-label="紅兵旅拍大片生成器">
        <form class="controls" id="prompt-form">
          <label>
            <span>主題（必填）</span>
            <input required name="theme" value="${escapeHtml(state.theme)}" placeholder="例：魅魔女王、唐風飛天女官、新東京霓虹機械偶像" />
            <small class="field-help">依固定核心規範：主題只填角色、身份、世界觀、劇情狀態；避免美女、女神、完美五官、網紅感、少女感等換臉風險詞。</small>
          </label>

          <label>
            <span>服裝</span>
            <textarea name="costume" rows="2" placeholder="服裝總方向，例如：暗黑王族魅魔電影戲服、唐風飛天高級訂製戲服">${escapeHtml(state.costume)}</textarea>
            <small class="field-help">依固定核心規範：服裝需是真人可穿戴的電影級戲服。下方 Layer 用來具體化布料、輪廓、結構、珠寶與飾件。</small>
          </label>

          <section class="costume-layer-panel">
            <div class="sec-label">服飾 Layer 系統</div>
            ${costumeLayerFields(state)}
          </section>

          <label>
            <span>妝容</span>
            <input name="makeup" value="${escapeHtml(state.makeup)}" placeholder="可空白，預設依主題生成電影級藝人妝容" />
            <small class="field-help">依固定核心規範：妝容僅限表面妝容、真實電影妝感、中性神態，不可改變骨相或五官比例。</small>
          </label>

          <label>
            <span>場景</span>
            <textarea name="scene" rows="4" placeholder="描述環境、燈光、人物動作、構圖、空氣感與電影攝影描述；系統會自動補上近中遠景、臉部不可遮擋、動作不可背對鏡頭等限制">${escapeHtml(state.scene)}</textarea>
            <small class="field-help">依固定核心規範：場景包含環境、燈光、動作、構圖、空氣感、電影攝影描述，但不要重複服裝與妝容。</small>
          </label>

          <div class="actions">
            <button type="button" data-action="compose">完成組合</button>
            <button type="button" data-action="copy" class="secondary">複製咒語</button>
          </div>
          <div class="status-line compose-status" id="status-line">尚未組合</div>
        </form>

        <section class="output-stack">
          <div class="panel result">
            <div class="panel-head"><h2>目前組合的咒語</h2></div>
            <textarea id="prompt-output" readonly placeholder="按「完成組合」後會顯示完整咒語">${escapeHtml(state.finalPrompt)}</textarea>
          </div>
        </section>
      </section>
    </main>`;

  bindEvents();
}

function composePrompt(form) {
  const state = formToState(form);
  if (!state.theme) {
    setStatus("主題為必填欄位");
    form.querySelector('[name="theme"]').focus();
    return;
  }

  const finalPrompt = buildChatGptInstruction(state);
  const nextState = { ...state, finalPrompt };
  saveState(nextState);
  document.querySelector("#prompt-output").value = finalPrompt;
  setStatus("已完成組合");
}

function bindEvents() {
  const form = document.querySelector("#prompt-form");
  form.addEventListener("input", () => {
    const state = formToState(form);
    saveState({ ...state, finalPrompt: document.querySelector("#prompt-output").value });
  });

  document.querySelector('[data-action="compose"]').addEventListener("click", () => composePrompt(form));
  document.querySelector('[data-action="copy"]').addEventListener("click", async () => {
    const value = document.querySelector("#prompt-output").value;
    if (!value.trim()) {
      composePrompt(form);
    }
    const nextValue = document.querySelector("#prompt-output").value;
    if (!nextValue.trim()) return;
    await copyText(nextValue);
    setStatus("已複製咒語");
  });
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function setStatus(message) {
  document.querySelector("#status-line").textContent = message;
}

render();
