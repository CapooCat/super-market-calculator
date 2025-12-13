import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import React from "react";

import { useCameraContext } from "@/context/CameraContext";

const ButtonAddItem = () => {
  const { handleCamera } = useCameraContext();
  // const { isThisOverlay, showOverlay } = useOverlayParam("addItem");

  return (
    <>
      <Button
        icon={<IconPlus />}
        className="relative -translate-y-[50%] w-20 h-20 rounded-full border-gray-900 border-8 justify-center items-center overflow-visible"
        onClick={() => handleCamera("fieldArray", "append")}
      >
        <span className="absolute w-12 h-12 z-[-1] rounded-full bg-primary animate-ping opacity-75" />
      </Button>

      {/* <Dialog
        header="Thêm sản phẩm"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayAddItem />
      </Dialog> */}
    </>
  );
};

export default ButtonAddItem;
