import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

import usePeerConnection, { ConnectionStatus, ITransferData } from "@/hooks/usePeerConnection";

interface ITransferContext {
  // Peer connection
  peerId: string | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  receivedData: ITransferData | null;
  initializePeer: () => Promise<string>;
  connectToPeer: (remotePeerId: string) => Promise<void>;
  sendData: (data: ITransferData) => void;
  disconnect: () => void;
  resetReceivedData: () => void;
  // Selection state
  selectedIndices: number[];
  setSelectedIndices: React.Dispatch<React.SetStateAction<number[]>>;
  // Mode state
  activeTabIndex: number;
  setActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const TransferContext = createContext<ITransferContext | null>(null);

export const useTransferContext = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransferContext must be used within TransferProvider");
  }
  return context;
};

interface TransferProviderProps {
  children: ReactNode;
}

export const TransferProvider = ({ children }: TransferProviderProps) => {
  const peerConnection = usePeerConnection();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const value = useMemo(
    () => ({
      ...peerConnection,
      selectedIndices,
      setSelectedIndices,
      activeTabIndex,
      setActiveTabIndex,
    }),
    [peerConnection, selectedIndices, activeTabIndex],
  );

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
};
