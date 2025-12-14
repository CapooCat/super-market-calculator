import { IconCut, IconFileScissors } from "@tabler/icons-react";
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
        className="flex-shrink-0 w-10 h-10 rounded-full"
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
