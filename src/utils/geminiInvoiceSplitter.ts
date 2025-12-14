import { GoogleGenAI } from "@google/genai";

export interface ISplitItem {
  index: number;
  name: string | null;
  price: number;
  quantity: number;
}

export interface ISplitRequest {
  items: ISplitItem[];
  targetPricePerInvoice: number;
}

export interface ISplitInvoice {
  invoiceIndex: number;
  itemIndices: number[];
  subtotal: number;
}

export interface ISplitResult {
  invoices: ISplitInvoice[];
}

const buildSplitPrompt = (items: ISplitItem[], targetPrice: number): string => {
  const itemsList = items
    .map((item) => {
      const total = item.price * item.quantity;
      const name = item.name || `Sản phẩm ${item.index + 1}`;
      return `- Index ${item.index}: "${name}" - ${item.price} x ${item.quantity} = ${total}`;
    })
    .join("\n");

  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedInvoices = Math.max(1, Math.ceil(totalValue / targetPrice));

  return `
You are helping split shopping items into separate invoices.

Total items value: ${totalValue}
Target price per invoice: ${targetPrice}
Estimated number of invoices needed: ${estimatedInvoices}

Items:
${itemsList}

Requirements:
- Split items into invoices where each invoice total is as close to ${targetPrice} as possible
- Each item can only be in ONE invoice
- All items must be assigned to an invoice
- Try to minimize the difference between each invoice's total and the target price

Respond ONLY with valid JSON in this exact format:
{"invoices": [{"invoiceIndex": 0, "itemIndices": [0, 2]}, {"invoiceIndex": 1, "itemIndices": [1, 3]}]}

Rules:
- invoiceIndex starts from 0
- itemIndices contains the index numbers of items assigned to that invoice
- Every item index must appear exactly once across all invoices
- Do not include any explanation, only the JSON
`.trim();
};

export async function splitItemsWithAI(
  request: ISplitRequest,
  apiKey: string,
): Promise<ISplitResult> {
  const defaultResult: ISplitResult = { invoices: [] };

  if (!apiKey || !request.items.length || !request.targetPricePerInvoice) {
    return defaultResult;
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });

    const response = await genAI.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL,
      contents: [buildSplitPrompt(request.items, request.targetPricePerInvoice)],
    });

    const text = response.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      if (Array.isArray(parsed.invoices)) {
        const invoices: ISplitInvoice[] = parsed.invoices.map(
          (inv: { invoiceIndex: number; itemIndices: number[] }, idx: number) => {
            const itemIndices = Array.isArray(inv.itemIndices) ? inv.itemIndices : [];
            const subtotal = itemIndices.reduce((sum, itemIdx) => {
              const item = request.items.find((i) => i.index === itemIdx);
              if (item) {
                return sum + item.price * item.quantity;
              }
              return sum;
            }, 0);

            return {
              invoiceIndex: inv.invoiceIndex ?? idx,
              itemIndices,
              subtotal,
            };
          },
        );

        return { invoices };
      }
    }
  } catch (error) {
    console.error("Gemini invoice split error:", error);
  }

  return defaultResult;
}
