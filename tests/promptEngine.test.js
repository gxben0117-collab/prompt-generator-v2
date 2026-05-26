import { describe, expect, it } from "vitest";
import { buildChatGptInstruction, buildPrompt, estimatePromptHealth, normalizeForm, sanitizeInput } from "../src/promptEngine.js";

describe("prompt engine", () => {
  it("builds an identity-first cinematic prompt", () => {
    const prompt = buildPrompt({
      theme: "巴黎黃昏旅拍女主",
      ratio: "9:16",
    });

    expect(prompt).toContain("真人演員被拍進奇幻世界");
    expect(prompt).toContain("real uploaded face identity");
    expect(prompt).toContain("【本次使用者輸入｜依核心規範組合】");
    expect(prompt).toContain("【主題】巴黎黃昏旅拍女主");
    expect(prompt).toContain("8-10 layer cinematic costume structure with weighted visual priority");
    expect(prompt).toContain("60% 主輪廓 / 體積");
    expect(prompt).toContain("25% 結構 / 支撐");
    expect(prompt).toContain("15% 細節 / 身份裝飾");
    expect(prompt).toContain("Layer 1:");
    expect(estimatePromptHealth(prompt).score).toBe(100);
  });

  it("requires theme before building", () => {
    expect(() => buildPrompt({ scene: "雨夜街道" })).toThrow("主題為必填欄位");
  });

  it("uses explicit costume layers when provided", () => {
    const prompt = buildPrompt({
      theme: "魅魔女王",
      costume: "dark fantasy succubus couture",
      costumeLayer1: "skin-tight black silk inner lining",
      costumeLayer2: "dark embroidered corset foundation",
      costumeLayer8: "luxury gemstone chains and gothic jewelry",
    });

    expect(prompt).toContain("Costume direction: dark fantasy succubus couture");
    expect(prompt).toContain("Layer 1: skin-tight black silk inner lining");
    expect(prompt).toContain("Layer 2: dark embroidered corset foundation");
    expect(prompt).toContain("Layer 8: luxury gemstone chains and gothic jewelry");
  });

  it("normalizes invalid controls to safe defaults", () => {
    const form = normalizeForm({ theme: "絕美女神", scene: "雨夜街道" });
    expect(form.theme).toBe("真人電影角色真人電影角色");
    expect(form.scene).toBe("雨夜街道");
  });

  it("replaces risky beauty language before prompt assembly", () => {
    expect(sanitizeInput("絕美女神 網紅 少女感")).toBe("真人電影角色真人電影角色 真人電影角色 真人電影角色");
  });

  it("wraps the prompt for ChatGPT image generation", () => {
    const instruction = buildChatGptInstruction({ theme: "雲海仙門旅拍" });
    expect(instruction).toContain("請根據我上傳的真人照片生成圖片");
    expect(instruction).toContain("雲海仙門旅拍");
  });
});
