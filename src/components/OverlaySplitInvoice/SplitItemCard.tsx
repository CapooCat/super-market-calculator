import Label from "../Label";

import { IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React from "react";

import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

interface ISplitItemCardProps {
  item: IFieldArray;
  index: number;
  action: "add" | "remove";
  onAction: (index: number) => void;
  disabled?: boolean;
  isAssigned?: boolean;
}

const SplitItemCard = ({ item, index, action, onAction, disabled, isAssigned }: ISplitItemCardProps) => {
  const cardClass = classNames("flex flex-shrink-0 items-center gap-3 rounded-2xl bg-black/30 overflow-hidden", {
    "opacity-50": isAssigned && action === "add",
  });

  const imageClass = classNames("aspect-square max-h-[70px]", {
    "flex items-center justify-center bg-gray-800": !item.image,
  });

  return (
    <div className={cardClass}>
      {item.image ? (
        <img src={item.image} alt="" className={imageClass + " object-cover"} />
      ) : (
        <div className={imageClass}>
          <IconPhoto size={20} className="text-gray-500" />
        </div>
      )}

      <div className="flex flex-col flex-1 flex-shrink-0 min-w-0 gap-1 p-2 pl-0">
        {item.name && <p className="text-sm truncate">{item.name}</p>}
        <div className="flex gap-2 text-sm text-gray-400 item">
          <span>{formatCurrency(item.price)}</span>
          <span>x{item.quantity}</span>
        </div>
        <span className="text-sm font-normal">Tổng: {formatCurrency(item.price * item.quantity)}</span>
      </div>

      <Button
        icon={action === "add" ? <IconPlus size={20} /> : <IconX size={20} />}
        onClick={() => onAction(index)}
        disabled={disabled || (isAssigned && action === "add")}
        rounded
        text
        severity={action === "add" ? "success" : "danger"}
        className="shrink-0 size-10"
      />
    </div>
  );
};

export default SplitItemCard;
