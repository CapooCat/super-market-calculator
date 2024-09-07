import React from "react";
import { useFormArray } from "@/context/FormArrayContext";
import { Button } from "primereact/button";
import FormNumber from "./FormInput/FormNumber";
import { useFormContext } from "react-hook-form";
import FormImage from "./FormInput/FormImage";

const OverlayAddItem = ({ onConfirmClick }) => {
  const { getValues, setValue } = useFormContext();
  const { append } = useFormArray();

  const handleOnConfirm = () => {
    const [inputImage, inputPrice] = getValues(["input.image", "input.price"]);
    append({ image: inputImage, price: inputPrice, quantity: 1 });
    setValue("input", { image: null, price: null });
    onConfirmClick();
  };

  return (
    <section className="flex flex-col items-center gap-6">
      <div className="w-[50%]">
        <FormImage title="Thêm ảnh sản phẩm" name="input.image" />
      </div>

      <div className="flex flex-col w-full gap-1">
        Giá tiền:
        <FormNumber
          name="input.price"
          min={0}
          minFractionDigits={0}
          maxFractionDigits={3}
          extend={{
            quickComplete: true,
            onPressEnter: () => handleOnConfirm(),
          }}
        />
      </div>

      <Button className="justify-center w-full my-4 text-xl font-medium" onClick={handleOnConfirm}>
        Thêm sản phẩm
      </Button>
    </section>
  );
};

export default OverlayAddItem;
