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
      const index = fields?.length || 0;
      append({ image: imageData, name: null, price: null, quantity: 1 });

      if (isConnected) {
        startBackgroundExtraction(imageData, `fieldArray[${index}]`, setValue);
      }
    });
  };

  return (
    <Button
      icon={<IconPlus />}
      className="relative -translate-y-[50%] w-20 h-20 rounded-full justify-center items-center overflow-visible"
      onClick={handleAddItem}
      raised
    >
      <span className="absolute w-14 h-14 z-[-1] rounded-full bg-primary animate-ping opacity-90" />
    </Button>
  );
};

export default ButtonAddItem;
