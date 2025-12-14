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
        className="relative -translate-y-[50%] w-40 h-20 rounded-full justify-center items-center overflow-visible"
        onClick={() => handleCamera("fieldArray", "append")}
        raised
      >
        <span className="absolute w-[100px] h-14 z-[-1] rounded-full bg-primary animate-ping opacity-90" />
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
