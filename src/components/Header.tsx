import React from "react";
import formatCurrency from "@/ultis/formatCurrency";
import { useFormContext, useWatch } from "react-hook-form";
import { IFieldArray } from "@/models/IFieldArray";
import ButtonReset from "./ButtonReset";

const Header = () => {
  const { control } = useFormContext();
  const fields = useWatch({ control, name: "fieldArray" });

  const total = fields.reduce((result, current: IFieldArray) => {
    current.price = current.price || 0;
    current.quantity = current.quantity || 0;
    result += current.price * current.quantity;
    return result;
  }, 0);

  return (
    <section className="sticky top-0 left-0 flex justify-between items-center w-[100svw] px-4 py-4 bg-gray-800 z-20 gap-4">
      <ButtonReset />
      <div className="flex justify-between w-full text-lg font-medium">
        <p>Tổng tiền:</p>
        <p>{formatCurrency(total)}</p>
      </div>
    </section>
  );
};

export default Header;
