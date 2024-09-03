import React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import OverlayAddItem from "./OverlayAddItem";
import { useNavigate, useParams } from "react-router-dom";

const ButtonAddItem = () => {
  let { overlayLink } = useParams();
  const navigate = useNavigate();
  const thisOverlay = "addItem";

  const showDialog = (status: boolean) => {
    if (status) navigate(`/${thisOverlay}`);
    else navigate("/");
  };

  return (
    <>
      <Button
        icon={<IconPlus />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showDialog(true)}
      />

      <Dialog
        header="Thêm sản phẩm"
        visible={overlayLink == thisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showDialog(false)}
      >
        <OverlayAddItem onConfirmClick={() => showDialog(false)} />
      </Dialog>
    </>
  );
};

export default ButtonAddItem;
