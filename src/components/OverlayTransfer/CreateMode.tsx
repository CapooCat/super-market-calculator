import Loading from "../Loading";

import { IconCheck, IconPhoto } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { useTransferContext } from "@/context/TransferContext";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

const CreateMode = () => {
  const { control } = useFormContext();
  const fields: IFieldArray[] = useWatch({ control, name: "fieldArray" });
  const {
    peerId,
    connectionStatus,
    error,
    selectedIndices,
    setSelectedIndices,
    initializePeer,
    sendData,
    disconnect,
  } = useTransferContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [dataSent, setDataSent] = useState(false);

  // Initialize selection with all items on first render
  useEffect(() => {
    if (fields.length > 0 && selectedIndices.length === 0) {
      setSelectedIndices(fields.map((_, index) => index));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  // Auto-send data when connected
  useEffect(() => {
    if (connectionStatus === "connected" && !dataSent) {
      const selectedItems = selectedIndices.map((index) => fields[index]);
      sendData({ items: selectedItems });
      setDataSent(true);
    }
  }, [connectionStatus, dataSent, fields, selectedIndices, sendData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const handleToggleAll = () => {
    if (selectedIndices.length === fields.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(fields.map((_, index) => index));
    }
  };

  const handleToggleItem = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleGenerateQR = async () => {
    disconnect();
    setIsGenerating(true);
    setDataSent(false);
    try {
      await initializePeer();
    } catch {
      // Error is handled in hook
    }
    setIsGenerating(false);
  };

  const Image = ({ src }: { src: string }) => {
    const imageClass = classNames("size-12 aspect-square rounded-lg", {
      "flex items-center justify-center bg-gray-900 border-gray-700": !src,
    });

    if (src) return <img src={src} className={imageClass + " object-cover"} alt="" />;
    return (
      <div className={imageClass}>
        <IconPhoto size={16} />
      </div>
    );
  };

  const isSelected = (index: number) => selectedIndices.includes(index);

  if (!fields.length) {
    return <div className="py-4 text-center">Chưa có sản phẩm nào để chuyển</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Item selection list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <span className="font-medium">
            Chọn sản phẩm ({selectedIndices.length}/{fields.length})
          </span>
          <Button
            label={selectedIndices.length === fields.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            link
            className="p-0 text-sm"
            onClick={handleToggleAll}
          />
        </div>

        <ul className="flex flex-col gap-2 overflow-auto max-h-[300px]">
          {fields.map((item, index) => (
            <li
              key={index}
              className={classNames(
                "relative flex-shrink-0 flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden",
                {
                  "bg-primary/20 border-2 border-primary": isSelected(index),
                  "bg-black/25 border-2 border-transparent hover:bg-black/40": !isSelected(index),
                },
              )}
              onClick={() => handleToggleItem(index)}
            >
              {/* Check icon on top right */}
              {isSelected(index) && (
                <div className="absolute flex items-center justify-center overflow-hidden rounded-full size-12 -top-5 -right-5 bg-primary">
                  <IconCheck size={14} className="absolute text-white top-6 right-6" />
                </div>
              )}
              <Image src={item.image} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm truncate">{item.name || `Sản phẩm ${index + 1}`}</span>
                <span className="text-xs text-gray-400">
                  {formatCurrency(item.price)} x {item.quantity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* QR Code display */}
      {peerId && connectionStatus !== "timeout" && connectionStatus !== "error" && (
        <div className="flex flex-col items-center self-center gap-3 p-4 bg-white rounded-xl w-fit">
          <QRCodeSVG value={peerId} size={200} level="M" />
          <span className="text-xs text-center text-gray-600">
            {connectionStatus === "waiting" && "Đang chờ thiết bị quét..."}
            {connectionStatus === "connecting" && "Đang kết nối..."}
            {connectionStatus === "connected" && dataSent && "✓ Đã gửi dữ liệu thành công!"}
          </span>
        </div>
      )}

      {/* Error/Timeout state */}
      {(connectionStatus === "timeout" || connectionStatus === "error") && error && (
        <div className="flex flex-col items-center gap-3 p-4 text-center rounded-xl bg-red-500/20">
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loading />
          <span>Đang tạo QR...</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerateQR}
          disabled={selectedIndices.length === 0 || isGenerating}
          className="justify-center w-full"
          title="Tạo mã QR"
        >
          {connectionStatus === "timeout" || connectionStatus === "error" ? "Thử lại" : "Tạo mã QR"}
        </Button>
      </div>
    </div>
  );
};

export default CreateMode;
