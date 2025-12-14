import Peer, { DataConnection } from "peerjs";
import { useCallback, useRef, useState } from "react";

import { IFieldArray } from "@/models/IFieldArray";

export interface ITransferData {
  items: IFieldArray[];
}

export type ConnectionStatus = "idle" | "initializing" | "waiting" | "connecting" | "connected" | "error";

interface UsePeerConnectionReturn {
  peerId: string | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  receivedData: ITransferData | null;
  initializePeer: () => Promise<string>;
  connectToPeer: (remotePeerId: string) => Promise<void>;
  sendData: (data: ITransferData) => void;
  disconnect: () => void;
  resetReceivedData: () => void;
}

const usePeerConnection = (): UsePeerConnectionReturn => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [receivedData, setReceivedData] = useState<ITransferData | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  const cleanup = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setPeerId(null);
    setConnectionStatus("idle");
  }, []);

  const setupConnectionListeners = useCallback((conn: DataConnection) => {
    conn.on("open", () => {
      setConnectionStatus("connected");
      connectionRef.current = conn;
    });

    conn.on("data", (data) => {
      setReceivedData(data as ITransferData);
    });

    conn.on("close", () => {
      setConnectionStatus("idle");
      connectionRef.current = null;
    });

    conn.on("error", (err) => {
      setError(err.message);
      setConnectionStatus("error");
    });
  }, []);

  const initializePeer = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      cleanup();
      setConnectionStatus("initializing");
      setError(null);

      const peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        setPeerId(id);
        setConnectionStatus("waiting");
        resolve(id);
      });

      peer.on("connection", (conn) => {
        setConnectionStatus("connecting");
        setupConnectionListeners(conn);
      });

      peer.on("error", (err) => {
        setError(err.message);
        setConnectionStatus("error");
        reject(err);
      });
    });
  }, [cleanup, setupConnectionListeners]);

  const connectToPeer = useCallback(
    (remotePeerId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!peerRef.current) {
          const peer = new Peer();
          peerRef.current = peer;

          peer.on("open", () => {
            setConnectionStatus("connecting");
            const conn = peer.connect(remotePeerId, { reliable: true });
            setupConnectionListeners(conn);

            conn.on("open", () => {
              resolve();
            });

            conn.on("error", (err) => {
              reject(err);
            });
          });

          peer.on("error", (err) => {
            setError(err.message);
            setConnectionStatus("error");
            reject(err);
          });
        } else {
          setConnectionStatus("connecting");
          const conn = peerRef.current.connect(remotePeerId, { reliable: true });
          setupConnectionListeners(conn);

          conn.on("open", () => {
            resolve();
          });

          conn.on("error", (err) => {
            reject(err);
          });
        }
      });
    },
    [setupConnectionListeners],
  );

  const sendData = useCallback((data: ITransferData) => {
    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send(data);
    }
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const resetReceivedData = useCallback(() => {
    setReceivedData(null);
  }, []);

  return {
    peerId,
    connectionStatus,
    error,
    receivedData,
    initializePeer,
    connectToPeer,
    sendData,
    disconnect,
    resetReceivedData,
  };
};

export default usePeerConnection;
