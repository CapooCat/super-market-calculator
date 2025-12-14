import { GoogleGenAI } from "@google/genai";

export interface IExtractionResult {
  name: string | null;
  price: number | null;
  rawText: string | null;
  currency: string;
}

export interface ICurrencyConfig {
  code: string;
  name: string;
  promptHint: string;
  parseValue: (text: string) => number | null;
}

const parseVND = (text: string): number | null => {
  if (!text) return null;
  const cleaned = text.replace(/[đĐ₫VND\s.,]/gi, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
};

export const CURRENCY_CONFIGS: Record<string, ICurrencyConfig> = {
  VND: {
    code: "VND",
    name: "Vietnamese Dong",
    promptHint: 'Vietnamese Dong (VND). Look for formats like "25.000đ", "25,000 VND", "25000"',
    parseValue: parseVND,
  },
};

const buildExtractionPrompt = (currency: string): string => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.VND;

  return `
Analyze this product image and extract the product name and price.
Currency: ${config.promptHint}

Respond ONLY with valid JSON in this exact format:
{"name": "<product name or null>", "price": <number or null>, "rawText": "<the price text you found or null>"}

Rules:
- For name, return the product/item name visible on the packaging or label
- For price, return the numeric value only without currency symbols
- Example: "25.000đ" should return {"name": "Bánh mì", "price": 25000, "rawText": "25.000đ"}
- If no price is visible, return null for price and rawText
- If no name is visible, return null for name
- Do not include any explanation, only the JSON
`.trim();
};

export async function extractFromImage(
  base64Image: string,
  apiKey: string,
  currency: string = "VND",
): Promise<IExtractionResult> {
  const defaultResult: IExtractionResult = { name: null, price: null, rawText: null, currency };

  if (!apiKey || !base64Image) {
    return defaultResult;
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = base64Image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/webp";

    const response = await genAI.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL,
      contents: [
        buildExtractionPrompt(currency),
        {
          inlineData: {
            mimeType,
            data: imageData,
          },
        },
      ],
    });

    const text = response.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        name: typeof parsed.name === "string" ? parsed.name : null,
        price: typeof parsed.price === "number" ? parsed.price : null,
        rawText: parsed.rawText || null,
        currency,
      };
    }
  } catch (error) {
    console.error("Gemini OCR error:", error);
  }

  return defaultResult;
}

export function isApiKeyFormatValid(apiKey: string): boolean {
  // Validate API key format without making any API calls
  // Gemini API keys typically start with "AIza" and are 39 characters
  if (!apiKey || typeof apiKey !== "string") return false;
  return apiKey.length >= 30 && apiKey.startsWith("AIza");
}

export async function checkGeminiConnection(apiKey: string): Promise<boolean> {
  if (!isApiKeyFormatValid(apiKey)) return false;

  try {
    // Use the models.list endpoint - this is a metadata request that doesn't consume tokens
    // https://ai.google.dev/api/models
    // API key passed via header instead of URL to avoid exposure in logs/history
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=1", {
      headers: {
        "x-goog-api-key": apiKey,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getApiKey(): string {
  return import.meta.env.VITE_GEMINI_API_KEY || "";
}
