import { IconFileAnalytics } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import OverlaySummary from "./OverlaySummary";
import { useNavigate, useParams } from "react-router-dom";

const ButtonSummary = () => {
  let { overlayLink } = useParams();
  const navigate = useNavigate();
  const thisOverlay = "summary";

  const showDialog = (status: boolean) => {
    if (status) navigate(`/${thisOverlay}`);
    else navigate("/");
  };

  return (
    <>
      <Button
        icon={<IconFileAnalytics />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => showDialog(true)}
      />

      <Dialog
        header="Số liệu mua hàng"
        visible={overlayLink == thisOverlay}
        position="bottom"
        dismissableMask
        onHide={() => showDialog(false)}
      >
        <OverlaySummary />
      </Dialog>
    </>
  );
};

export default ButtonSummary;
