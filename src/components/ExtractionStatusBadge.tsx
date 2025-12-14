import { IconCheck, IconLoader2, IconSearch, IconX } from "@tabler/icons-react";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";

import { ExtractionStatus, useGeminiContext } from "@/context/GeminiContext";

interface IStatusConfig {
  value: string;
  severity: "success" | "info" | "warning" | "danger" | null;
  icon: React.ReactNode;
}

const getStatusConfig = (status: ExtractionStatus): IStatusConfig | null => {
  switch (status) {
    case "extracting":
      return {
        value: "Đang nhận diện...",
        severity: "info",
        icon: <IconLoader2 size={14} className="animate-spin" />,
      };
    case "success":
      return {
        value: "Đã nhận diện",
        severity: "success",
        icon: <IconCheck size={14} />,
      };
    case "not_found":
      return {
        value: "Không tìm thấy",
        severity: "warning",
        icon: <IconSearch size={14} />,
      };
    case "error":
      return {
        value: "Lỗi",
        severity: "danger",
        icon: <IconX size={14} />,
      };
    default:
      return null;
  }
};

const AUTO_HIDE_MS = 1000;

const ExtractionStatusToast: React.FC = () => {
  const { extractionStatus } = useGeminiContext();
  const config = getStatusConfig(extractionStatus);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!config) return;

    setVisible(true);

    if (extractionStatus === "extracting") return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, AUTO_HIDE_MS);

    return () => clearTimeout(timer);
  }, [extractionStatus]);

  if (!config) return null;

  return (
    <div
      className={classNames("fixed z-50 flex justify-center w-full top-12", {
        "animate-toast-in": visible,
        "animate-toast-out": !visible,
      })}
    >
      <Tag
        value={config.value}
        severity={config.severity}
        icon={config.icon}
        className={classNames("flex gap-2 px-3 py-2 shadow-lg")}
      />
    </div>
  );
};

export default ExtractionStatusToast;
