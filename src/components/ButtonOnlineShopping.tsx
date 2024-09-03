import { IconBroadcast } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import OverlayOnlineShopping from "./OverlayOnlineShopping";

const ButtonOnlineShopping = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        icon={<IconBroadcast />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Mua sắm cùng nhau"
        visible={visible}
        position="bottom"
        dismissableMask
        onHide={() => {
          setVisible(false);
        }}
      >
        <OverlayOnlineShopping />
      </Dialog>
    </>
  );
};

export default ButtonOnlineShopping;
