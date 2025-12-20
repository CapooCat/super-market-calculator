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
You are helping split shopping items into separate invoices with optimal packing.

Total items value: ${totalValue}
Target price per invoice: ${targetPrice}
Estimated number of invoices needed: ${estimatedInvoices}

Items:
${itemsList}

CRITICAL Requirements (in order of priority):
1. MINIMIZE the number of invoices - use as few invoices as possible
2. Each invoice should get as close to ${targetPrice} as possible WITHOUT significantly exceeding it
3. It's acceptable to slightly exceed ${targetPrice}, but avoid large overages
4. Pack items efficiently - keep adding items to the current invoice until adding another item would cause a significant overage
5. Only create a new invoice when the current one is at or near ${targetPrice}

Strategy:
- Start with invoice 0 and keep adding items until the total reaches or gets very close to ${targetPrice}
- If adding an item would make the total significantly exceed ${targetPrice}, consider if it's better to:
  a) Include it anyway if the overage is small (prefer fewer invoices)
  b) Start a new invoice if the overage would be too large
- Each item can only be in ONE invoice
- All items must be assigned to an invoice

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
