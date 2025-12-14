import { classNames } from "primereact/utils";
import React, { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useCameraContext } from "@/context/CameraContext";
import { useGeminiContext } from "@/context/GeminiContext";

interface IFormImage {
  title: string;
  name: string;
}

interface IImageInput {
  children?: React.ReactNode;
  className?: string;
}

const FormImage = memo(function ({ title, name }: IFormImage) {
  const { control, setValue } = useFormContext();
  const { openCamera } = useCameraContext();
  const { isConnected, startBackgroundExtraction } = useGeminiContext();
  const image = useWatch({ control, name });

  const handleOpenCamera = () => {
    openCamera((imageData) => {
      setValue(name, imageData);

      const priceFieldName = name.replace(".image", ".price");
      if (isConnected) {
        startBackgroundExtraction(imageData, priceFieldName, setValue);
      }
    });
  };

  const ImageInput = ({ children, className = "" }: IImageInput) => {
    const styleClass = classNames(
      "box-border relative flex items-center justify-center w-full p-2 text-center border-2 border-gray-700 border-dashed rounded-xl aspect-square",
      { [className]: className != null },
    );

    return (
      <div className={styleClass} onClick={handleOpenCamera}>
        {children}
      </div>
    );
  };

  if (image)
    return (
      <ImageInput className="!p-0 border-none">
        <img src={image} className="object-cover w-full rounded-xl aspect-square" />
      </ImageInput>
    );
  else return <ImageInput>{title}</ImageInput>;
});

export default FormImage;
