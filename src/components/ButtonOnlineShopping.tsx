import { IconBroadcast } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import OverlayOnlineShopping from "./OverlayOnlineShopping";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonOnlineShopping = () => {
  const { isThisOverlay, showOverlay } = useOverlayParam("onlineShopping");

  return (
    <>
      <Button
        icon={<IconBroadcast />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showOverlay(true)}
      />

      <Dialog
        header="Mua sắm cùng nhau"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayOnlineShopping />
      </Dialog>
    </>
  );
};

export default ButtonOnlineShopping;
