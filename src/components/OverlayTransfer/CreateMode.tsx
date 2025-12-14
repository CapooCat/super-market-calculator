import { IconPhoto } from "@tabler/icons-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import Loading from "../Loading";
import { useTransferContext } from "@/context/TransferContext";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

const CreateMode = () => {
  const { control } = useFormContext();
  const fields: IFieldArray[] = useWatch({ control, name: "fieldArray" });
  const {
    peerId,
    connectionStatus,
    selectedIndices,
    setSelectedIndices,
    initializePeer,
    sendData,
    disconnect,
  } = useTransferContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [dataSent, setDataSent] = useState(false);

  // Initialize selection with all items
  useEffect(() => {
    if (fields.length > 0 && selectedIndices.length === 0) {
      setSelectedIndices(fields.map((_, index) => index));
    }
  }, [fields, selectedIndices.length, setSelectedIndices]);

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
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    setDataSent(false);
    try {
      await initializePeer();
    } catch {
      // Error is handled in hook
    }
    setIsGenerating(false);
  };

  const handleReset = () => {
    disconnect();
    setDataSent(false);
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

  if (!fields.length) {
    return <div className="py-4 text-center">Chưa có sản phẩm nào để chuyển</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Item selection list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <span className="font-medium">Chọn sản phẩm ({selectedIndices.length}/{fields.length})</span>
          <Button
            label={selectedIndices.length === fields.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            link
            className="p-0 text-sm"
            onClick={handleToggleAll}
          />
        </div>

        <ul className="flex flex-col gap-2 overflow-y-auto max-h-48">
          {fields.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer bg-black/25 hover:bg-black/40"
              onClick={() => handleToggleItem(index)}
            >
              <Checkbox checked={selectedIndices.includes(index)} onChange={() => handleToggleItem(index)} />
              <Image src={item.image} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm truncate">{item.name || `Sản phẩm ${index + 1}`}</span>
                <span className="text-xs text-gray-400">{formatCurrency(item.price)} x {item.quantity}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* QR Code display */}
      {peerId && (
        <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white">
          <QRCodeSVG value={peerId} size={200} level="M" />
          <span className="text-xs text-gray-600 text-center">
            {connectionStatus === "waiting" && "Đang chờ thiết bị quét..."}
            {connectionStatus === "connecting" && "Đang kết nối..."}
            {connectionStatus === "connected" && dataSent && "✓ Đã gửi dữ liệu thành công!"}
          </span>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <Loading />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {!peerId ? (
          <Button
            className="justify-center flex-1 text-lg border-2 border-black/50"
            onClick={handleGenerateQR}
            disabled={selectedIndices.length === 0 || isGenerating}
          >
            Tạo mã QR
          </Button>
        ) : (
          <Button
            className="justify-center flex-1 text-lg border-2 border-black/50"
            onClick={handleReset}
            outlined
          >
            Tạo mã mới
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateMode;
