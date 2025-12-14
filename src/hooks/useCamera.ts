import { useRef, useState } from "react";

import debounce from "@/utils/debounce";

export interface IUseCamera {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCameraActive: boolean;
  facingMode: "user" | "environment";
  photo?: IPhoto;
  setPhoto: React.Dispatch<React.SetStateAction<IPhoto | undefined>>;
  clearPhoto: () => void;
  startCamera: () => void;
  takePhoto: () => void;
  stopCamera: () => void;
  switchCamera: () => void;
}

export interface IPhoto {
  base64?: string;
  blob?: IBlob;
}

export interface IBlob {
  instance?: Blob;
  url?: string;
}

let stream: MediaStream | null = null;

const useCamera = (): IUseCamera => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photo, setPhoto] = useState<IPhoto | undefined>(undefined);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clearPhoto = () => {
    setPhoto(undefined);
  };

  const startCameraWithFacingMode = async (mode: "user" | "environment") => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraActive(true);
    } catch {
      // Camera access denied or not available
    }
  };

  const startCamera = debounce(() => {
    startCameraWithFacingMode(facingMode);
  }, 100);

  const stopCamera = debounce(async () => {
    try {
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
      setIsCameraActive(false);
    } catch {
      // Stream already stopped or not available
    }
  }, 100);

  const processToBase64 = (canvas: HTMLCanvasElement): string | undefined => {
    const imageBase64: string | undefined = canvas.toDataURL("image/webp");
    return imageBase64 ?? undefined;
  };

  const processToBlob = async (canvas: HTMLCanvasElement): Promise<IBlob> => {
    return new Promise((resolve, reject) => {
      if (canvas instanceof HTMLCanvasElement) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const instance = blob;
            resolve({ instance, url });
          } else {
            reject(undefined);
          }
        });
      } else {
        reject(undefined);
      }
    });
  };

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const context = canvasRef.current.getContext("2d");

      if (context) {
        context.drawImage(videoRef.current, 0, 0, width, height);
        const base64 = processToBase64(canvasRef.current);
        const blob = await processToBlob(canvasRef.current);
        setPhoto({ base64, blob });
      }
    }
  };

  const switchCamera = async () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);

    // Stop current stream and start with new facing mode
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    await startCameraWithFacingMode(newMode);
  };

  return { videoRef, canvasRef, isCameraActive, facingMode, photo, setPhoto, clearPhoto, startCamera, takePhoto, stopCamera, switchCamera };
};

export default useCamera;
