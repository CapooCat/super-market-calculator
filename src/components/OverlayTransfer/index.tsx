import { classNames } from "primereact/utils";
import React from "react";

import CreateMode from "./CreateMode";
import ScanMode from "./ScanMode";
import { useTransferContext } from "@/context/TransferContext";

const tabs = [
  { label: "Tạo QR", value: 0 },
  { label: "Quét QR", value: 1 },
];

const OverlayTransfer = () => {
  const { activeTabIndex, setActiveTabIndex } = useTransferContext();

  return (
    <section className="px-4">
      {/* Custom mobile-friendly tabs */}
      <div className="flex p-1 mb-4 rounded-xl bg-black/25">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={classNames(
              "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200",
              {
                "bg-primary text-white shadow-md": activeTabIndex === tab.value,
                "text-gray-300 hover:text-white": activeTabIndex !== tab.value,
              },
            )}
            onClick={() => setActiveTabIndex(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-2">
        {activeTabIndex === 0 && <CreateMode />}
        {activeTabIndex === 1 && <ScanMode />}
      </div>
    </section>
  );
};

export default OverlayTransfer;
