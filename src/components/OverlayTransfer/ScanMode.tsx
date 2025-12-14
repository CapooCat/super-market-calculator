import { IconPhoto } from "@tabler/icons-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";

import Loading from "../Loading";
import { useFormArray } from "@/context/FormArrayContext";
import { useTransferContext } from "@/context/TransferContext";
import { IFieldArray } from "@/models/IFieldArray";
import formatCurrency from "@/utils/formatCurrency";

type ImportMode = "replace" | "append";

const ScanMode = () => {
  const { append, replace } = useFormArray();
  const {
    connectionStatus,
    receivedData,
    connectToPeer,
    disconnect,
    resetReceivedData,
  } = useTransferContext();

  const [isScanning, setIsScanning] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      resetReceivedData();
    };
  }, [disconnect, resetReceivedData]);

  const handleScan = async (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes.length > 0 && !isConnecting && connectionStatus !== "connected") {
      const peerId = detectedCodes[0].rawValue;
      setIsScanning(false);
      setIsConnecting(true);

      try {
        await connectToPeer(peerId);
      } catch {
        setIsScanning(true);
      }
      setIsConnecting(false);
    }
  };

  const handleImport = (mode: ImportMode) => {
    if (!receivedData?.items) return;

    if (mode === "replace") {
      replace(receivedData.items);
    } else {
      append(receivedData.items);
    }

    setImportSuccess(true);
  };

  const handleReset = () => {
    disconnect();
    resetReceivedData();
    setIsScanning(true);
    setImportSuccess(false);
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

  // Success state
  if (importSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-6xl">✓</div>
        <span className="text-lg font-medium">Nhập dữ liệu thành công!</span>
        <Button label="Quét mã khác" onClick={handleReset} outlined className="mt-4" />
      </div>
    );
  }

  // Received data preview
  if (receivedData?.items && receivedData.items.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-medium">Dữ liệu nhận được ({receivedData.items.length} sản phẩm)</span>

          <ul className="flex flex-col gap-2 overflow-y-auto max-h-48">
            {receivedData.items.map((item: IFieldArray, index: number) => (
              <li key={index} className="flex items-center gap-3 p-2 rounded-lg bg-black/25">
                <Image src={item.image} />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm truncate">{item.name || `Sản phẩm ${index + 1}`}</span>
                  <span className="text-xs text-gray-400">{formatCurrency(item.price)} x {item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="justify-center w-full text-lg border-2 border-black/50"
            onClick={() => handleImport("replace")}
          >
            Thay thế danh sách hiện tại
          </Button>
          <Button
            className="justify-center w-full text-lg border-2 border-black/50"
            onClick={() => handleImport("append")}
            outlined
          >
            Thêm vào danh sách hiện tại
          </Button>
        </div>
      </div>
    );
  }

  // Scanner / Connecting state
  return (
    <div className="flex flex-col items-center gap-4">
      {isScanning && (
        <div className="w-full overflow-hidden rounded-2xl max-w-[300px] aspect-square">
          <Scanner onScan={handleScan} />
        </div>
      )}

      {isConnecting && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loading />
          <span>Đang kết nối...</span>
        </div>
      )}

      {connectionStatus === "connected" && !receivedData && (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loading />
          <span>Đang nhận dữ liệu...</span>
        </div>
      )}

      {!isScanning && !isConnecting && connectionStatus !== "connected" && (
        <Button label="Quét lại" onClick={handleReset} outlined className="mt-4" />
      )}
    </div>
  );
};

export default ScanMode;
