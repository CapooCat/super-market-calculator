import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { IconCheck, IconFocusCentered, IconX } from "@tabler/icons-react";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import useCamera from "@/hooks/useCamera";
import { useFormContext } from "react-hook-form";

const OverlayCamera = ({ fieldName }) => {
  const { setValue } = useFormContext();
  const { videoRef, canvasRef, photo, clearPhoto, startCamera, takePhoto, stopCamera } = useCamera();
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
  }, []);

  const takenPhotoLayout = classNames("flex flex-col items-center w-full gap-16", {
    "hidden opacity-0": !photo?.blob?.url,
  });

  const cameraLayout = classNames("flex flex-col items-center w-full gap-16", {
    "hidden opacity-0": !!photo?.blob?.url,
  });

  const button = classNames("w-20 rounded-full aspect-square");

  const handleDenyPhoto = () => {
    clearPhoto();
  };

  const handleAcceptPhoto = () => {
    setValue(fieldName, photo?.base64);
    stopCamera();
    navigate(-1);
  };

  return (
    <section className="w-full">
      <div className={cameraLayout}>
        <div className="w-full overflow-hidden bg-black rounded-2xl">
          <video ref={videoRef} className="object-cover w-full aspect-square" autoPlay />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
        <div className="flex gap-4">
          <Button icon={<IconFocusCentered />} onClick={() => takePhoto()} className={button} />
        </div>
      </div>

      <div className={takenPhotoLayout}>
        <div className="relative w-full overflow-hidden bg-black rounded-2xl">
          <div className="absolute inset-0 bg-black/50 animation-flash" />
          <img src={photo?.blob?.url} alt="taken photo" className="object-cover w-full aspect-square" />
        </div>
        <div className="flex gap-4">
          <Button icon={<IconX />} onClick={handleDenyPhoto} className={button} outlined />
          <Button icon={<IconCheck />} onClick={handleAcceptPhoto} className={button} />
        </div>
      </div>
    </section>
  );
};

export default OverlayCamera;
