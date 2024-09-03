import React from "react";
import FormImage from "./FormInput/FormImage";
import FormNumber from "./FormInput/FormNumber";
import { Button } from "primereact/button";
import { IconX } from "@tabler/icons-react";

const Item = ({ name, onRemoveClick }: any) => {
  return (
    <li className="flex items-center w-full gap-4 py-8">
      <div className="w-24">
        <FormImage title="Thêm ảnh" name={`${name}.image`} />
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <FormNumber name={`${name}.price`} title="Giá tiền" min={0} mode="currency" currency="VND" locale="vi-VI" />
        <FormNumber name={`${name}.quantity`} showButtons buttonLayout="horizontal" min={0} max={100} />
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
