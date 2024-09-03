import React from "react";
import { IconReload } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useFormArray } from "@/context/FormArrayContext";

const ButtonReset = () => {
  const { remove } = useFormArray();

  const confirmReset = () => {
    confirmDialog({
      message: "Bạn có chắc là muốn xoá toàn bộ ? dữ liệu sẽ không thể khôi phục được",
      header: "Xoá toàn bộ?",
      position: "bottom",
      defaultFocus: "accept",
      acceptLabel: "Đồng ý",
      rejectLabel: "Từ chối",
      accept: () => remove(),
    });
  };

  return (
    <>
      <Button icon={<IconReload size={18} />} className="rounded-full" onClick={() => confirmReset()} />
      <ConfirmDialog dismissableMask />
    </>
  );
};

export default ButtonReset;
