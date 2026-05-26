import { chromium } from "playwright";

const url = "http://127.0.0.1:5173";
const viewports = [
  { name: "desktop", width: 1440, height: 950 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.goto(url, { waitUntil: "networkidle" });
    await page.getByLabel("主題（必填）").waitFor();

    const typedTheme = `${viewport.name} 測試旅拍連續輸入`;
    await page.getByLabel("主題（必填）").fill(typedTheme);
    const themeValue = await page.getByLabel("主題（必填）").inputValue();
    await page.getByRole("button", { name: "完成組合" }).click();

    const promptText = await page.locator("#prompt-output").inputValue();
    const metrics = await page.evaluate(() => {
      const doc = globalThis.document;
      return {
        controlCount: doc.querySelectorAll("input, textarea, button").length,
        horizontalOverflow: doc.documentElement.scrollWidth > doc.documentElement.clientWidth,
        promptHeight: doc.querySelector("#prompt-output")?.clientHeight || 0,
        status: doc.querySelector("#status-line")?.textContent || "",
      };
    });

    if (themeValue !== typedTheme) {
      throw new Error(`${viewport.name}: input focus/value was interrupted while typing`);
    }
    if (!promptText.includes(typedTheme)) {
      throw new Error(`${viewport.name}: prompt did not include theme after compose`);
    }
    if (!promptText.includes("【真人電影級 AI 咒語建檔系統｜完整版母板 V2.0】")) {
      throw new Error(`${viewport.name}: fixed core spec was not included`);
    }
    if (!promptText.includes("【本次使用者輸入｜依核心規範組合】")) {
      throw new Error(`${viewport.name}: composed field section missing`);
    }
    if (metrics.horizontalOverflow) {
      throw new Error(`${viewport.name}: horizontal overflow detected`);
    }
    if (consoleErrors.length) {
      throw new Error(`${viewport.name}: console errors: ${consoleErrors.join(" | ")}`);
    }

    results.push({ viewport: viewport.name, ...metrics, consoleErrors: consoleErrors.length });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ ok: true, url, results }, null, 2));
