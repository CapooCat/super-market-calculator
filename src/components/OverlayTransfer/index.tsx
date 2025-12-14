import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

import CreateMode from "./CreateMode";
import ScanMode from "./ScanMode";
import { useTransferContext } from "@/context/TransferContext";

const OverlayTransfer = () => {
  const { activeTabIndex, setActiveTabIndex } = useTransferContext();

  return (
    <section className="px-4">
      <TabView activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)}>
        <TabPanel header="Tạo QR">
          <CreateMode />
        </TabPanel>
        <TabPanel header="Quét QR">
          <ScanMode />
        </TabPanel>
      </TabView>
    </section>
  );
};

export default OverlayTransfer;
