import { IconFileScissors } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";

import OverlaySplitInvoice from "./OverlaySplitInvoice";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonSplitInvoice = () => {
  const { isThisOverlay, showOverlay } = useOverlayParam("split");

  return (
    <>
      <Button
        icon={<IconFileScissors />}
        className="-translate-y-[50%] w-12 h-12 rounded-full "
        onClick={() => showOverlay(true)}
        raised
      />

      <Dialog
        header="Tách hoá đơn"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        pt={{
          content: () => "px-0",
        }}
        onHide={() => showOverlay(false)}
      >
        <OverlaySplitInvoice />
      </Dialog>
    </>
  );
};

export default ButtonSplitInvoice;
