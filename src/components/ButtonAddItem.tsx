import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import React from "react";
import { useFormContext } from "react-hook-form";

import { useCameraContext } from "@/context/CameraContext";
import { useFormArray } from "@/context/FormArrayContext";
import { useGeminiContext } from "@/context/GeminiContext";

const ButtonAddItem = () => {
  const { openCamera } = useCameraContext();
  const { setValue } = useFormContext();
  const { append, fields } = useFormArray();
  const { isConnected, startBackgroundExtraction } = useGeminiContext();

  const handleAddItem = () => {
    openCamera((imageData) => {
      append({ image: imageData, price: null, quantity: 1 });
      const priceFieldName = `fieldArray[${fields?.length || 0}].price`;

      if (isConnected) {
        startBackgroundExtraction(imageData, priceFieldName, setValue);
      }
    });
  };

  return (
    <Button
      icon={<IconPlus />}
      className="relative -translate-y-[50%] w-40 h-20 rounded-full justify-center items-center overflow-visible"
      onClick={handleAddItem}
      raised
    >
      <span className="absolute w-[100px] h-14 z-[-1] rounded-full bg-primary animate-ping opacity-90" />
    </Button>
  );
};

export default ButtonAddItem;
