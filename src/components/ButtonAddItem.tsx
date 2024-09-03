import React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import OverlayAddItem from "./OverlayAddItem";

const ButtonAddItem = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        icon={<IconPlus />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Thêm sản phẩm"
        visible={visible}
        position="bottom"
        dismissableMask
        onHide={() => {
          setVisible(false);
        }}
      >
        <OverlayAddItem onConfirmClick={() => setVisible(false)} />
      </Dialog>
    </>
  );
};

export default ButtonAddItem;
