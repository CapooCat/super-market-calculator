import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

import OverlayAddItem from "./OverlayAddItem";
import useOverlayParam from "@/hooks/useOverlayParam";
import useScroll from "@/hooks/useScroll";

const ButtonAddItem = () => {
  const { isThisOverlay, showOverlay } = useOverlayParam("addItem");
  const { scrollToBottom } = useScroll();

  const handleOnConfirm = () => {
    showOverlay(false);
    scrollToBottom();
  };

  return (
    <>
      <Button
        icon={<IconPlus />}
        className="relative -translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8 justify-center items-center overflow-visible"
        onClick={() => showOverlay(true)}
      >
        <span className="absolute w-10 h-10 z-[-1] rounded-full bg-primary animate-ping opacity-75" />
      </Button>

      <Dialog
        header="Thêm sản phẩm"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayAddItem onConfirmClick={handleOnConfirm} />
      </Dialog>
    </>
  );
};

export default ButtonAddItem;
