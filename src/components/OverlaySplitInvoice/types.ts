import { IFieldArray } from "@/models/IFieldArray";

export interface IInvoice {
  id: string;
  name: string;
  itemIndices: number[];
}

export interface ISplitInvoiceContext {
  fields: IFieldArray[];
  invoices: IInvoice[];
  activeIndex: number | null;
  assignedItems: Set<number>;
  setInvoices: React.Dispatch<React.SetStateAction<IInvoice[]>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddItemToInvoice: (itemIndex: number) => void;
  handleRemoveItemFromInvoice: (invoiceId: string, itemIndex: number) => void;
  handleAddInvoice: () => void;
  handleRemoveInvoice: (invoiceId: string) => void;
  getInvoiceSubtotal: (itemIndices: number[]) => number;
}

export const generateId = () => Math.random().toString(36).substring(2, 9);
