import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { IconCheck, IconFocusCentered, IconX } from "@tabler/icons-react";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import useCamera from "@/hooks/useCamera";
import { useFormContext } from "react-hook-form";
import compressImage from "@/ultis/compressImage";
import useAsync from "../hooks/useAsync";
import Loading from "./Loading";

const OverlayCamera = ({ fieldName }) => {
  const { setValue } = useFormContext();
  const { videoRef, canvasRef, photo, clearPhoto, startCamera, takePhoto, stopCamera } = useCamera();
  const compress = useAsync((blob: Blob) => compressImage(blob), []);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => {
      clearPhoto();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (compress.data) {
      setValue(fieldName, compress.data);
      stopCamera();
      navigate(-1);
    }
  }, [compress.data]);

  const takenPhotoLayout = classNames("relative flex flex-col items-center w-full gap-16", {
    "hidden opacity-0": !photo?.blob?.url,
  });

  const cameraLayout = classNames("relative flex flex-col items-center w-full gap-16", {
    "hidden opacity-0": !!photo?.blob?.url,
  });

  const button = classNames("w-16 rounded-full aspect-square transition-full duration-300", {
    "pointer-event-none opacity-25": compress.isLoading,
  });

  const TakePhotoActions = classNames(
    "absolute left-0 right-0 flex justify-center w-full",
    "gap-4 bottom-10 translate-y-28 transition-all opacity-0 duration-300 pointer-event-none",
    {
      "opacity-100 !translate-y-0": !photo?.blob?.url,
    }
  );

  const confirmPhotoActions = classNames(
    "absolute left-0 right-0 flex justify-center w-full",
    "gap-4 bottom-10 translate-y-28 transition-all opacity-0 duration-300 pointer-event-none",
    {
      "opacity-100 !translate-y-0": !!photo?.blob?.url,
    }
  );

  const handleDenyPhoto = () => {
    clearPhoto();
  };

  const handleAcceptPhoto = () => {
    if (photo?.blob?.instance) {
      compress.execute(photo?.blob?.instance);
    }
  };

  return (
    <section className="w-full pb-28">
      <div className={cameraLayout}>
        <div className="w-full overflow-hidden bg-black rounded-2xl">
          <video ref={videoRef} className="object-cover w-full aspect-square" autoPlay />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>

      <div className={takenPhotoLayout}>
        {compress.isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl animation-fade-in">
            <Loading />
          </div>
        )}
        <div className="relative w-full overflow-hidden bg-black rounded-2xl">
          <div className="absolute inset-0 bg-black/50 animation-flash" />
          <img src={photo?.blob?.url} alt="taken photo" className="object-cover w-full aspect-square" />
        </div>
      </div>

      <div className={TakePhotoActions}>
        <Button icon={<IconFocusCentered />} onClick={() => takePhoto()} className={button} />
      </div>

      <div className={confirmPhotoActions}>
        <Button icon={<IconX />} onClick={handleDenyPhoto} className={button} outlined />
        <Button icon={<IconCheck />} onClick={handleAcceptPhoto} className={button} />
      </div>
    </section>
  );
};

export default OverlayCamera;
