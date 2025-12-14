import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import React from "react";

import SplitItemCard from "./SplitItemCard";
import { IInvoice } from "./types";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

interface IInvoicesSectionProps {
  fields: IFieldArray[];
  invoices: IInvoice[];
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  onAddInvoice: () => void;
  onRemoveInvoice: (invoiceId: string) => void;
  onRemoveItem: (invoiceId: string, itemIndex: number) => void;
  getInvoiceSubtotal: (itemIndices: number[]) => number;
}

const InvoicesSection = ({
  fields,
  invoices,
  activeIndex,
  setActiveIndex,
  onAddInvoice,
  onRemoveInvoice,
  onRemoveItem,
  getInvoiceSubtotal,
}: IInvoicesSectionProps) => {
  return (
    <div className="flex-1 px-4 pt-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold">Hoá đơn</p>
        <Button
          icon={<IconPlus size={12} />}
          label="Thêm"
          onClick={onAddInvoice}
          text
          size="small"
          className="flex items-center justify-center gap-2"
        />
      </div>

      <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index as number | null)}>
        {invoices.map((invoice) => (
          <AccordionTab
            key={invoice.id}
            header={
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-md">{invoice.name}</span>
                <span className="pr-1 rounded text-md bg-primary/2">
                  {formatCurrency(getInvoiceSubtotal(invoice.itemIndices))}
                </span>
              </div>
            }
            pt={{
              headerAction: () => "w-full",
            }}
          >
            <div className="flex flex-col gap-2 pt-3 max-h-[200px] overflow-auto">
              {invoice.itemIndices.length === 0 ? (
                <p className="pt-4 pb-2 text-sm text-center text-gray-500">Chọn sản phẩm từ danh sách ở trên</p>
              ) : (
                invoice.itemIndices.map((itemIdx) => {
                  const item = fields[itemIdx];
                  if (!item) return null;
                  return (
                    <SplitItemCard
                      key={itemIdx}
                      item={item}
                      index={itemIdx}
                      action="remove"
                      onAction={() => onRemoveItem(invoice.id, itemIdx)}
                    />
                  );
                })
              )}
            </div>

            {invoices.length > 1 && (
              <div className="pt-3 mt-3 border-t border-gray-700">
                <Button
                  icon={<IconTrash size={16} />}
                  label="Xoá hoá đơn này"
                  onClick={() => onRemoveInvoice(invoice.id)}
                  text
                  severity="danger"
                  size="small"
                  className="w-full"
                />
              </div>
            )}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default InvoicesSection;
