import { IconFileAnalytics } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import OverlaySummary from "./OverlaySummary";

const ButtonSummary = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        icon={<IconFileAnalytics />}
        className="-translate-y-[50%] w-16 h-16 rounded-full border-gray-900 border-8"
        onClick={() => setVisible(true)}
      />

      <Dialog
        header="Số liệu mua hàng"
        visible={visible}
        position="bottom"
        dismissableMask
        onHide={() => {
          setVisible(false);
        }}
      >
        <OverlaySummary />
      </Dialog>
    </>
  );
};

export default ButtonSummary;
