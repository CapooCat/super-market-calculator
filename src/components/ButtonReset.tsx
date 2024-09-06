import React, { memo } from "react";
import { IconReload } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { useFormArray } from "@/context/FormArrayContext";
import { Dialog } from "primereact/dialog";
import OverlayConfirmDelete from "./OverlayConfirmDelete";
import useOverlayParam from "@/hooks/useOverlayParam";

const ButtonReset = memo(() => {
  const { remove } = useFormArray();
  const { isThisOverlay, showOverlay } = useOverlayParam("reset");

  const handleAccept = () => {
    remove();
    showOverlay(false);
  };

  return (
    <>
      <Button icon={<IconReload size={18} />} className="rounded-full" onClick={() => showOverlay(true)} />

      <Dialog
        header="Xoá toàn bộ?"
        visible={isThisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showOverlay(false)}
      >
        <OverlayConfirmDelete
          message="Bạn có chắc là muốn xoá toàn bộ ? dữ liệu sẽ không thể khôi phục lại"
          onAcceptClick={() => handleAccept()}
          onRejectClick={() => showOverlay(false)}
        />
      </Dialog>
    </>
  );
});

export default ButtonReset;
