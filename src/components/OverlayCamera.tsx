import useAsync from "../hooks/useAsync";

import { IconCheck, IconFocusCentered, IconPhoto, IconRefresh, IconX } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ConnectionStatus from "./ConnectionStatus";
import Loading from "./Loading";
import useCamera from "@/hooks/useCamera";
import compressImage from "@/utils/compressImage";

interface IOverlayCameraProps {
  onConfirm: (imageData: string) => void;
}

const OverlayCamera = ({ onConfirm }: IOverlayCameraProps) => {
  const { videoRef, canvasRef, photo, setPhoto, clearPhoto, startCamera, takePhoto, stopCamera, switchCamera } =
    useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compress = useAsync((blob: Blob) => compressImage(blob), []);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => {
      clearPhoto();
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (compress.data) {
      onConfirm(compress.data);
      stopCamera();
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compress.data]);

  const takenPhotoLayout = classNames("relative flex flex-col items-center h-50 w-full gap-16 max-w-[400px]", {
    "hidden opacity-0": !photo?.blob?.url,
  });

  const cameraLayout = classNames("relative flex flex-col items-center w-full gap-16", {
    "hidden opacity-0": !!photo?.blob?.url,
  });

  const button = classNames("w-16 rounded-full aspect-square transition-full duration-300", {
    "pointer-event-none opacity-25": compress.isLoading,
  });

  const TakePhotoActions = classNames(
    "absolute left-0 right-0 justify-self-center flex justify-between w-[70%]",
    "gap-4 bottom-10 translate-y-28 transition-all opacity-0 duration-300 pointer-event-none",
    {
      "opacity-100 !translate-y-0": !photo?.blob?.url,
    },
  );

  const confirmPhotoActions = classNames(
    "absolute left-0 right-0 flex justify-center w-full",
    "gap-4 bottom-10 translate-y-28 transition-all opacity-0 duration-300 pointer-event-none",
    {
      "opacity-100 !translate-y-0": !!photo?.blob?.url,
    },
  );

  const handleDenyPhoto = () => {
    clearPhoto();
  };

  const handleAcceptPhoto = () => {
    if (photo?.blob?.instance) {
      compress.execute(photo?.blob?.instance);
    }
  };

  const handleSelectFromDevice = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto({
        blob: {
          instance: file,
          url: url,
        },
      });
    }
  };

  return (
    <section className="w-full pb-24">
      <div className={cameraLayout}>
        <div className="w-full overflow-hidden rounded-2xl max-w-[400px]">
          <video ref={videoRef} className="object-cover w-full aspect-auto max-h-[65svh]" autoPlay />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className={takenPhotoLayout}>
          {compress.isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-2xl animation-fade-in">
              <Loading />
            </div>
          )}
          <div className="relative w-full overflow-hidden bg-black rounded-2xl">
            <div className="absolute inset-0 bg-black/50 animation-flash" />
            <img src={photo?.blob?.url} alt="taken photo" className="object-cover w-full aspect-auto max-h-[65svh]" />
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

      <div className="flex justify-center w-full mt-6">
        <ConnectionStatus />
      </div>

      <div className={TakePhotoActions}>
        <Button icon={<IconPhoto />} onClick={handleSelectFromDevice} className={button} outlined />
        <Button icon={<IconFocusCentered />} onClick={() => takePhoto()} className={button} />
        <Button icon={<IconRefresh />} onClick={switchCamera} className={button} outlined />
      </div>

      <div className={confirmPhotoActions}>
        <Button icon={<IconX />} onClick={handleDenyPhoto} className={button} outlined />
        <Button icon={<IconCheck />} onClick={handleAcceptPhoto} className={button} />
      </div>
    </section>
  );
};

export default OverlayCamera;
