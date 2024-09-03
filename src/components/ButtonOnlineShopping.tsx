import { IconBroadcast } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React from "react";
import OverlayOnlineShopping from "./OverlayOnlineShopping";
import { useNavigate, useParams } from "react-router-dom";

const ButtonOnlineShopping = () => {
  let { overlayLink } = useParams();
  const navigate = useNavigate();
  const thisOverlay = "onlineShopping";

  const showDialog = (status: boolean) => {
    if (status) navigate(`/${thisOverlay}`);
    else navigate("/");
  };

  return (
    <>
      <Button
        icon={<IconBroadcast />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showDialog(true)}
      />

      <Dialog
        header="Mua sắm cùng nhau"
        visible={overlayLink == thisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showDialog(false)}
      >
        <OverlayOnlineShopping />
      </Dialog>
    </>
  );
};

export default ButtonOnlineShopping;
