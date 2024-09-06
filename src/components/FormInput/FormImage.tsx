import React, { memo, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useCameraContext } from "@/context/CameraContext";

interface IFormImage {
  title: string;
  name: string;
}

interface IImageInput {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const FormImage = memo(function ({ title, name }: IFormImage) {
  const { control } = useFormContext();
  const { handleCamera } = useCameraContext();
  const image = useWatch({ control, name });

  const ImageInput = ({ children, className = "", disabled = false }: IImageInput) => {
    const styleClass = classNames(
      "box-border relative flex items-center justify-center w-full p-2 text-center border-2 border-gray-700 border-dashed rounded-xl aspect-square",
      { [className]: className != null }
    );

    return (
      <div className={styleClass} onClick={() => handleCamera(name)}>
        {children}
      </div>
    );
  };

  // useEffect(() => {
  //   if (image) {
  //     const binaryString = atob(image.split(",")[1] || image);
  //     alert(binaryString.length / 1024 + " KB");
  //   }
  // }, [image]);

  if (image)
    return (
      <ImageInput className="p-0 border-none">
        <img src={image} className="object-cover w-full rounded-xl aspect-square" />
      </ImageInput>
    );
  else return <ImageInput>{title}</ImageInput>;
});

export default FormImage;
