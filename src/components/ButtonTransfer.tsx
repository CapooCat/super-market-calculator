import { IconQrcode } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { memo } from "react";

import OverlayTransfer from "./OverlayTransfer";
import { TransferProvider } from "@/context/TransferContext";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonTransfer = memo(() => {
  const { isThisOverlay, showOverlay } = useOverlayParam("transfer");

  return (
    <>
      <Button
        icon={<IconQrcode size={18} />}
        className="-translate-y-[50%] w-12 h-12 rounded-full"
        onClick={() => showOverlay(true)}
        raised
      />

      <Dialog
        header="Chuyển dữ liệu"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        pt={{
          content: () => "px-0",
        }}
        onHide={() => showOverlay(false)}
      >
        <TransferProvider>
          <OverlayTransfer />
        </TransferProvider>
      </Dialog>
    </>
  );
});

export default ButtonTransfer;
