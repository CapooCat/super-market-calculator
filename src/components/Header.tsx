import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import ButtonReset from "./ButtonReset";
import Label from "./Label";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

const Header = () => {
  const { control } = useFormContext();
  const [total, setTotal] = useState(0);
  const fields = useWatch({ control, name: "fieldArray" });

  useEffect(() => {
    const result = fields.reduce((result: number, current: IFieldArray) => {
      current.price = current.price || 0;
      current.quantity = current.quantity || 0;
      result += current.price * current.quantity;
      return result;
    }, 0);

    setTotal(result);
  }, [fields]);

  return (
    <section className="sticky top-0 left-0 flex justify-between items-center w-[100svw] px-4 py-4 bg-gray-800 z-20 gap-4">
      <ButtonReset />
      <div className="flex justify-between w-full text-lg font-medium">
        <Label title="Tổng tiền:" value={formatCurrency(total)} />
      </div>
    </section>
  );
};

export default Header;
