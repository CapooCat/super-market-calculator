import React, { memo } from "react";
import { IconReload } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { useFormArray } from "@/context/FormArrayContext";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import OverlayConfirmDelete from "./OverlayConfirmDelete";

const ButtonReset = memo(() => {
  const { remove } = useFormArray();
  let { overlayLink } = useParams();
  const navigate = useNavigate();
  const thisOverlay = "reset";

  const showDialog = (status: boolean) => {
    if (status) navigate(`/${thisOverlay}`);
    else navigate(-1);
  };

  return (
    <>
      <Button icon={<IconReload size={18} />} className="rounded-full" onClick={() => showDialog(true)} />

      <Dialog
        header="Xoá toàn bộ?"
        visible={overlayLink == thisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showDialog(false)}
      >
        <OverlayConfirmDelete
          onAcceptClick={() => {
            remove();
            showDialog(false);
          }}
          onRejectClick={() => showDialog(false)}
        />
      </Dialog>
    </>
  );
});

export default ButtonReset;
