import React from "react";

import SplitItemCard from "./SplitItemCard";
import { IFieldArray } from "@/models/IFieldArray";

interface IItemPoolSectionProps {
  fields: IFieldArray[];
  activeIndex: number | null;
  assignedItems: Set<number>;
  onAddItem: (itemIndex: number) => void;
}

const ItemPoolSection = ({ fields, activeIndex, assignedItems, onAddItem }: IItemPoolSectionProps) => {
  return (
    <div className="px-4 pt-4 pb-2">
      <p className="mb-4 font-bold">Danh sách sản phẩm</p>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px]">
        {fields.map((item, index) => (
          <SplitItemCard
            key={index}
            item={item}
            index={index}
            action="add"
            onAction={onAddItem}
            disabled={activeIndex === null}
            isAssigned={assignedItems.has(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemPoolSection;
