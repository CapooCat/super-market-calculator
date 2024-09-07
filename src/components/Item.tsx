import React from "react";
import FormImage from "./FormInput/FormImage";
import FormNumber from "./FormInput/FormNumber";
import { Button } from "primereact/button";
import { IconX } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import formatCurrency from "@/ultis/formatCurrency";
import FormTotal from "./FormInput/FormTotal";

const Item = ({ name, onRemoveClick }: any) => {
  const { getValues } = useFormContext();

  return (
    <li className="flex items-center w-full gap-4 py-6">
      <div className="w-36">
        <FormImage title="Thêm ảnh" name={`${name}.image`} />
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <FormNumber name={`${name}.price`} min={0} minFractionDigits={0} maxFractionDigits={3} />
        <FormNumber name={`${name}.quantity`} showButtons buttonLayout="horizontal" min={1} />
        <div className="flex gap-1 px-4 py-1 font-bold rounded-lg bg-black/50 w-fit">
          <span className="font-normal">Tổng:</span>
          <FormTotal priceField={`${name}.price`} quantityField={`${name}.quantity`} />
        </div>
      </div>

      <Button
        icon={<IconX size={18} />}
        text
        severity="danger"
        className="!p-0 col-span-full justify-self-end w-fit h-fit"
        onClick={() => onRemoveClick()}
      />
    </li>
  );
};

export default Item;
