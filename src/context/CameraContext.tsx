import { Dialog } from "primereact/dialog";
import React, { createContext, useCallback, useContext, useRef } from "react";

import OverlayCamera from "@/components/OverlayCamera";
import useOverlayParam from "@/hooks/useOverlayParam";

type CameraCallback = (imageData: string) => void;

interface ICameraContext {
  openCamera: (onConfirm: CameraCallback) => void;
}

const CameraContext = createContext<ICameraContext | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isThisOverlay, showOverlay } = useOverlayParam("camera");
  const callbackRef = useRef<CameraCallback | null>(null);

  const openCamera = useCallback(
    (onConfirm: CameraCallback) => {
      callbackRef.current = onConfirm;
      showOverlay(true);
    },
    [showOverlay],
  );

  const handleConfirm = useCallback((imageData: string) => {
    if (callbackRef.current) {
      callbackRef.current(imageData);
      callbackRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    callbackRef.current = null;
    showOverlay(false);
  }, [showOverlay]);

  return (
    <CameraContext.Provider value={{ openCamera }}>
      {children}
      <Dialog
        className="max-h-[100svh]"
        pt={{ header: { className: "p-2" } }}
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={handleClose}
      >
        <OverlayCamera onConfirm={handleConfirm} />
      </Dialog>
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error("useCameraContext must be used within a CameraProvider");
  return context;
};
