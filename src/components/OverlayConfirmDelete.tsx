import { Button } from "primereact/button";
import React from "react";

const OverlayConfirmDelete = ({ onRejectClick, onAcceptClick }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="pb-4">Bạn có chắc là muốn xoá toàn bộ ? dữ liệu sẽ không thể khôi phục lại</p>
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
