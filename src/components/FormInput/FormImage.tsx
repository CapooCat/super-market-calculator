import useAsync from "@/hooks/useAsync";
import imageCompression from "browser-image-compression";
import React, { memo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Loading from "@/components/Loading";

interface IFormImage {
  title: string;
  name: string;
}

const FormImage = memo(function ({ title, name }: IFormImage) {
  const { control, setValue } = useFormContext();
  const image = useWatch({ control, name });

  const handleImage = useAsync(async (e) => {
    const imageFile = e.target.files[0];

    const options = {
      initialQuality: 0.5,
      maxWidthOrHeight: 1920,
      fileType: "image/webp",
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      const fileURL = URL.createObjectURL(compressedFile);
      setValue(name, fileURL);
    } catch {}

    return;
  }, []);

  if (handleImage.isLoading) {
    return (
      <div className="box-border relative flex items-center justify-center w-full p-2 text-center border-2 border-gray-700 border-dashed rounded-xl aspect-square">
        <Loading />
      </div>
    );
  }

  if (!image)
    return (
      <div className="box-border relative flex items-center justify-center w-full p-2 text-center border-2 border-gray-700 border-dashed rounded-xl aspect-square">
        {title}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage.execute(e)}
          className="absolute inset-0 opacity-0"
          capture="environment"
        />
      </div>
    );
  else
    return (
      <div className="box-border relative flex items-center justify-center w-full p-1 rounded-xl">
        <img src={image} className="object-cover w-full rounded-xl aspect-square" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage.execute(e)}
          className="absolute inset-0 opacity-0"
          capture="environment"
        />
      </div>
    );
});

export default FormImage;
