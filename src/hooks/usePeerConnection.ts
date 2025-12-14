import Peer, { DataConnection } from "peerjs";
import { useCallback, useRef, useState } from "react";

import { IFieldArray } from "@/models/IFieldArray";

export interface ITransferData {
  items: IFieldArray[];
}

export type ConnectionStatus = "idle" | "initializing" | "waiting" | "connecting" | "connected" | "error" | "timeout";

// Timeout durations in milliseconds
const PEER_INIT_TIMEOUT = 15000; // 15 seconds to initialize peer
const PEER_CONNECT_TIMEOUT = 30000; // 30 seconds to connect to remote peer
const WAITING_TIMEOUT = 120000; // 2 minutes waiting for scanner

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    clearTimeoutRef();
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
    setError(null);
  }, [clearTimeoutRef]);

  const setupConnectionListeners = useCallback(
    (conn: DataConnection) => {
      conn.on("open", () => {
        clearTimeoutRef();
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
        clearTimeoutRef();
        setError(err.message);
        setConnectionStatus("error");
      });
    },
    [clearTimeoutRef],
  );

  const initializePeer = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      cleanup();
      setConnectionStatus("initializing");
      setError(null);

      // Set timeout for peer initialization
      timeoutRef.current = setTimeout(() => {
        setError("Kết nối quá thời gian. Vui lòng thử lại.");
        setConnectionStatus("timeout");
        cleanup();
        reject(new Error("Peer initialization timeout"));
      }, PEER_INIT_TIMEOUT);

      const peer = new Peer();
      peerRef.current = peer;

      peer.on("open", (id) => {
        clearTimeoutRef();
        setPeerId(id);
        setConnectionStatus("waiting");

        // Set timeout for waiting state (waiting for someone to scan)
        timeoutRef.current = setTimeout(() => {
          setError("Quá thời gian chờ quét. Vui lòng tạo mã mới.");
          setConnectionStatus("timeout");
        }, WAITING_TIMEOUT);

        resolve(id);
      });

      peer.on("connection", (conn) => {
        clearTimeoutRef();
        setConnectionStatus("connecting");
        setupConnectionListeners(conn);
      });

      peer.on("error", (err) => {
        clearTimeoutRef();
        setError(err.message);
        setConnectionStatus("error");
        reject(err);
      });
    });
  }, [cleanup, clearTimeoutRef, setupConnectionListeners]);

  const connectToPeer = useCallback(
    (remotePeerId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Set timeout for connection
        timeoutRef.current = setTimeout(() => {
          setError("Kết nối quá thời gian. Vui lòng quét lại.");
          setConnectionStatus("timeout");
          reject(new Error("Connection timeout"));
        }, PEER_CONNECT_TIMEOUT);

        if (!peerRef.current) {
          const peer = new Peer();
          peerRef.current = peer;

          peer.on("open", () => {
            setConnectionStatus("connecting");
            const conn = peer.connect(remotePeerId, { reliable: true });
            setupConnectionListeners(conn);

            conn.on("open", () => {
              clearTimeoutRef();
              resolve();
            });

            conn.on("error", (err) => {
              clearTimeoutRef();
              reject(err);
            });
          });

          peer.on("error", (err) => {
            clearTimeoutRef();
            setError(err.message);
            setConnectionStatus("error");
            reject(err);
          });
        } else {
          setConnectionStatus("connecting");
          const conn = peerRef.current.connect(remotePeerId, { reliable: true });
          setupConnectionListeners(conn);

          conn.on("open", () => {
            clearTimeoutRef();
            resolve();
          });

          conn.on("error", (err) => {
            clearTimeoutRef();
            reject(err);
          });
        }
      });
    },
    [clearTimeoutRef, setupConnectionListeners],
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
