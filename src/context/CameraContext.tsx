import { Dialog } from "primereact/dialog";
import React, { createContext, useContext, useState } from "react";

import OverlayCamera from "@/components/OverlayCamera";
import useOverlayParam from "@/hooks/useOverlayParam";

interface ICameraContext {
  handleCamera: (formInputName: string, type?: "update" | "append") => void;
}

const CameraContext = createContext<ICameraContext | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isThisOverlay, showOverlay } = useOverlayParam("camera");
  const [fieldName, setFieldName] = useState<string>("");
  const [type, setType] = useState<"update" | "append">("update");

  const handleCamera = (formInputName: string, type: "update" | "append" = "update") => {
    showOverlay(true);
    setFieldName(formInputName);
    setType(type);
  };

  return (
    <CameraContext.Provider value={{ handleCamera }}>
      {children}
      <Dialog
        header="Camera"
        visible={isThisOverlay && !!fieldName}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayCamera fieldName={fieldName} type={type} />
      </Dialog>
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error("useCameraContext must be used within a CameraProvider");
  return context;
};
