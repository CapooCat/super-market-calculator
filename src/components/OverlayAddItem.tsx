import dayjs from "dayjs";
import { Button } from "primereact/button";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import ConnectionStatus from "./ConnectionStatus";
import ExtractionStatusBadge from "./ExtractionStatusBadge";
import FormImage from "./FormInput/FormImage";
import FormNumber from "./FormInput/FormNumber";
import { useFormArray } from "@/context/FormArrayContext";
import { useGeminiContext } from "@/context/GeminiContext";
import useOverlayParam from "@/hooks/useOverlayParam";
import useScroll from "@/hooks/useScroll";

const OverlayAddItem = () => {
  const { getValues, setValue } = useFormContext();
  const { append } = useFormArray();
  const { isThisOverlay, showOverlay } = useOverlayParam("addItem");
  const { scrollToBottom } = useScroll();
  const { resetExtractionStatus } = useGeminiContext();

  // Reset extraction status when overlay closes
  useEffect(() => {
    if (!isThisOverlay) {
      resetExtractionStatus();
    }
  }, [isThisOverlay, resetExtractionStatus]);

  const handleOnConfirm = () => {
    const [inputImage, inputPrice] = getValues(["item.image", "item.price"]);

    if (inputImage && inputPrice)
      append({ image: inputImage, price: inputPrice, quantity: 1, date: dayjs().toISOString() });

    setValue("item", { image: null, price: null });
    showOverlay(false);
    scrollToBottom();
  };

  return (
    <section className="flex flex-col items-center gap-6 mb-10">
      <ConnectionStatus />
      <div className="w-[50%] max-w-[200px]">
        <FormImage title="Thêm ảnh sản phẩm" name="item.image" />
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className="flex items-center justify-between w-full gap-2">
          <span>Giá tiền: </span>
          <ExtractionStatusBadge />
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
