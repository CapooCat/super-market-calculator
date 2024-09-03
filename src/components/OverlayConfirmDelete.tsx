import { Button } from "primereact/button";
import React from "react";

const OverlayConfirmDelete = ({ onRejectClick, onAcceptClick, message }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="pb-4">{message}</p>
      <Button onClick={onAcceptClick} className="justify-center text-xl font-medium">
        Đồng ý
      </Button>
      <Button onClick={onRejectClick} className="justify-center text-xl font-medium" outlined>
        Từ chối
      </Button>
    </div>
  );
};

export default OverlayConfirmDelete;
