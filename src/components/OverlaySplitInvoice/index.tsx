import LoadingAI from "../LoadingAI";

import React, { useCallback, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import AIControlsSection from "./AIControlsSection";
import InvoicesSection from "./InvoicesSection";
import ItemPoolSection from "./ItemPoolSection";
import { IInvoice, generateId } from "./types";
import useAsync from "@/hooks/useAsync";
import { IFieldArray } from "@/models/IFieldArray";
import { splitItemsWithAI } from "@/utils/geminiInvoiceSplitter";
import { getApiKey } from "@/utils/geminiOCR";

const OverlaySplitInvoice = () => {
  const { control } = useFormContext();
  const fields: IFieldArray[] = useWatch({ control, name: "fieldArray" }) || [];

  const [invoices, setInvoices] = useState<IInvoice[]>([{ id: generateId(), name: "Hoá đơn 1", itemIndices: [] }]);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [targetPrice, setTargetPrice] = useState<number | null>(null);

  const aiSplit = useAsync(async () => {
    if (!targetPrice || fields.length === 0) return;

    const items = fields.map((field, index) => ({
      index,
      name: field.name,
      price: field.price,
      quantity: field.quantity,
    }));

    const result = await splitItemsWithAI({ items, targetPricePerInvoice: targetPrice }, getApiKey());

    if (result.invoices.length > 0) {
      const newInvoices: IInvoice[] = result.invoices.map((inv, idx) => ({
        id: generateId(),
        name: `Hoá đơn ${idx + 1}`,
        itemIndices: inv.itemIndices,
      }));
      setInvoices(newInvoices);
      setActiveIndex(0);
    }
  }, [targetPrice, fields]);

  const handleAddInvoice = useCallback(() => {
    const newInvoice: IInvoice = {
      id: generateId(),
      name: `Hoá đơn ${invoices.length + 1}`,
      itemIndices: [],
    };
    setInvoices((prev) => [...prev, newInvoice]);
  }, [invoices.length]);

  const handleRemoveInvoice = useCallback((invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
  }, []);

  const handleAddItemToInvoice = useCallback(
    (itemIndex: number) => {
      if (activeIndex === null) return;

      setInvoices((prev) =>
        prev.map((inv, idx) => {
          if (idx === activeIndex && !inv.itemIndices.includes(itemIndex)) {
            return { ...inv, itemIndices: [...inv.itemIndices, itemIndex] };
          }
          return inv;
        }),
      );
    },
    [activeIndex],
  );

  const handleRemoveItemFromInvoice = useCallback((invoiceId: string, itemIndex: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return { ...inv, itemIndices: inv.itemIndices.filter((i) => i !== itemIndex) };
        }
        return inv;
      }),
    );
  }, []);

  const getInvoiceSubtotal = useCallback(
    (itemIndices: number[]) => {
      return itemIndices.reduce((sum, idx) => {
        const item = fields[idx];
        if (item) {
          return sum + item.price * item.quantity;
        }
        return sum;
      }, 0);
    },
    [fields],
  );

  const assignedItems = useMemo(() => {
    const assigned = new Set<number>();
    invoices.forEach((inv) => inv.itemIndices.forEach((idx) => assigned.add(idx)));
    return assigned;
  }, [invoices]);

  if (!fields.length) {
    return <div className="px-6 py-4">Chưa có sản phẩm nào, vui lòng thêm ít nhất 1 sản phẩm</div>;
  }

  return (
    <>
      {aiSplit.isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-tl-3xl rounded-tr-3xl bg-black/70">
          <LoadingAI />
        </div>
      )}
      
      <div className="relative flex flex-col h-full">
        <AIControlsSection
          targetPrice={targetPrice}
          setTargetPrice={setTargetPrice}
          onAISplit={() => aiSplit.execute()}
          isLoading={aiSplit.isLoading}
        />

        <ItemPoolSection
          fields={fields}
          activeIndex={activeIndex}
          assignedItems={assignedItems}
          onAddItem={handleAddItemToInvoice}
        />

        <InvoicesSection
          fields={fields}
          invoices={invoices}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onAddInvoice={handleAddInvoice}
          onRemoveInvoice={handleRemoveInvoice}
          onRemoveItem={handleRemoveItemFromInvoice}
          getInvoiceSubtotal={getInvoiceSubtotal}
        />
      </div>
    </>
  );
};

export default OverlaySplitInvoice;
