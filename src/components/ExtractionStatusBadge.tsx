import { IconCheck, IconLoader2, IconSearch, IconX } from "@tabler/icons-react";
import { Tag } from "primereact/tag";
import React from "react";

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

const ExtractionStatusBadge: React.FC = () => {
  const { extractionStatus } = useGeminiContext();
  const config = getStatusConfig(extractionStatus);

  if (!config) return null;

  return <Tag value={config.value} severity={config.severity} icon={config.icon} className="flex gap-1" />;
};

export default ExtractionStatusBadge;
