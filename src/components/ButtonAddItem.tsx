import React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import OverlayAddItem from "./OverlayAddItem";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonAddItem = () => {
  const { isThisOverlay, showOverlay } = useOverlayParam("addItem");

  return (
    <>
      <Button
        icon={<IconPlus />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showOverlay(true)}
      />

      <Dialog
        header="Thêm sản phẩm"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayAddItem onConfirmClick={() => showOverlay(false)} />
      </Dialog>
    </>
  );
};

export default ButtonAddItem;
