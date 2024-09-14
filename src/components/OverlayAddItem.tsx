import dayjs from "dayjs";
import { Button } from "primereact/button";
import React from "react";
import { useFormContext } from "react-hook-form";

import FormImage from "./FormInput/FormImage";
import FormNumber from "./FormInput/FormNumber";
import FormSwitch from "./FormInput/FormSwitch";
import { useFormArray } from "@/context/FormArrayContext";
import useOverlayParam from "@/hooks/useOverlayParam";
import useScroll from "@/hooks/useScroll";

const OverlayAddItem = () => {
  const { showOverlay } = useOverlayParam("addItem");
  const { getValues, setValue } = useFormContext();
  const { scrollToBottom } = useScroll();
  const { append } = useFormArray();

  const handleOnConfirm = () => {
    const [inputImage, inputPrice, isOneGetOne] = getValues(["item.image", "item.price", "item.isOneGetOne"]);
    if (!isOneGetOne) append({ image: inputImage, price: inputPrice, quantity: 1, date: dayjs().toISOString() });
    if (isOneGetOne) append({ image: inputImage, price: inputPrice / 2, quantity: 2, date: dayjs().toISOString() });
    setValue("item", { image: null, price: null, isOneGetOne: false });
    showOverlay(false);
    scrollToBottom();
  };

  return (
    <section className="flex flex-col items-center gap-6 mb-10">
      <div className="w-[50%]">
        <FormImage title="Thêm ảnh sản phẩm" name="item.image" />
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className="flex items-center justify-between w-full gap-2">
          <span>Giá tiền: </span>
          <FormSwitch name="item.isOneGetOne" label="Là 1 tặng 1" />
        </div>

        <FormNumber
          name="item.price"
          min={0}
          minFractionDigits={0}
          maxFractionDigits={3}
          quickComplete={true}
          onPressEnter={() => handleOnConfirm()}
        />
      </div>

      <Button
        className="justify-center w-full mt-4 text-xl font-medium border-2 border-black/50"
        onClick={handleOnConfirm}
      >
        Thêm sản phẩm
      </Button>
    </section>
  );
};

export default OverlayAddItem;
