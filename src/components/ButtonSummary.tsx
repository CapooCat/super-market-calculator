import { IconDeviceFloppy } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import OverlaySummary from "./OverlaySummary";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonSummary = () => {
  const { isThisOverlay, showOverlay } = useOverlayParam("summary");

  return (
    <>
      <Button
        icon={<IconDeviceFloppy />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showOverlay(true)}
      />

      <Dialog
        header="Tổng kết"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlaySummary />
      </Dialog>
    </>
  );
};

export default ButtonSummary;
