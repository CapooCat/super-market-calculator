import { IconX } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { confirmPopup } from "primereact/confirmpopup";
import React from "react";

import FormImage from "./FormInput/FormImage";
import FormNumber from "./FormInput/FormNumber";
import FormText from "./FormInput/FormText";
import FormTotal from "./FormInput/FormTotal";

interface IItemProps {
  name: string;
  index: number;
  onRemoveClick: () => void;
}

const Item = ({ name, index, onRemoveClick }: IItemProps) => {
  const accept = () => {
    onRemoveClick();
  };

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: e.currentTarget,
      message: "Bạn có chắc là muốn xoá ?",
      defaultFocus: "",
      acceptLabel: "Có",
      rejectLabel: "Không",
      accept,
    });
  };

  return (
    <li className="flex items-center w-full gap-4 py-6">
      <div className="self-start w-36">
        <FormImage title="Thêm ảnh" name={`${name}.image`} />
      </div>

      <div className="flex flex-col flex-1 gap-2.5">
        <FormText name={`${name}.name`} placeholder="Tên sản phẩm..." />
        <FormNumber name={`${name}.price`} min={0} minFractionDigits={0} maxFractionDigits={3} quickComplete={true} />
        <FormNumber name={`${name}.quantity`} showButtons buttonLayout="horizontal" min={1} />
        <div className="flex flex-wrap gap-1 px-4 py-1 rounded-lg bg-black/50 w-fit">
          Tổng:
          <FormTotal priceField={`${name}.price`} quantityField={`${name}.quantity`} />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-auto">
        <div className="flex items-center justify-center w-8 rounded-lg aspect-square bg-black/25">{index + 1}</div>
        <Button
          icon={<IconX size={18} />}
          text
          severity="danger"
          className="w-8 mb-auto aspect-square bg-red-500/25"
          onClick={(e) => handleRemoveClick(e)}
        />
      </div>
    </li>
  );
};

export default Item;
