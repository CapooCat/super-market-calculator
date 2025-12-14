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
const DATA_RECEIVE_TIMEOUT = 15000; // 15 seconds to receive data after connecting
const WAITING_TIMEOUT = 120000; // 2 minutes waiting for scanner

// PeerJS config with STUN and TURN servers for better connectivity
// TURN servers are needed for symmetric NAT traversal (some mobile networks, corporate firewalls)
const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      // Free TURN servers from Open Relay Project
      {
        urls: "turn:openrelay.metered.ca:80",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
      {
        urls: "turn:openrelay.metered.ca:443?transport=tcp",
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
    iceCandidatePoolSize: 10,
  },
  debug: 0, // Set to 3 for verbose logging
};

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
  const dataTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearDataTimeoutRef = useCallback(() => {
    if (dataTimeoutRef.current) {
      clearTimeout(dataTimeoutRef.current);
      dataTimeoutRef.current = null;
    }
  }, []);

  const closeConnection = useCallback(() => {
    clearDataTimeoutRef();
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
  }, [clearDataTimeoutRef]);

  const cleanupConnection = useCallback(() => {
    clearTimeoutRef();
    closeConnection();
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setPeerId(null);
  }, [clearTimeoutRef, closeConnection]);

  const cleanup = useCallback(() => {
    cleanupConnection();
    setConnectionStatus("idle");
    setError(null);
  }, [cleanupConnection]);

  const setupConnectionListeners = useCallback(
    (conn: DataConnection, isReceiver: boolean = false) => {
      conn.on("open", () => {
        clearTimeoutRef();
        setConnectionStatus("connected");
        connectionRef.current = conn;

        // If receiver (scanner), set timeout for receiving data
        if (isReceiver) {
          dataTimeoutRef.current = setTimeout(() => {
            setError("Không nhận được dữ liệu. Vui lòng thử lại.");
            setConnectionStatus("timeout");
          }, DATA_RECEIVE_TIMEOUT);
        }
      });

      conn.on("data", (data) => {
        clearDataTimeoutRef(); // Clear data timeout when data received
        setReceivedData(data as ITransferData);
      });

      conn.on("close", () => {
        clearDataTimeoutRef();
        connectionRef.current = null;
        // For sender side: go back to waiting for new connections
        // For receiver side: go back to idle
        if (!isReceiver && peerRef.current && !peerRef.current.destroyed) {
          setConnectionStatus("waiting");
          // Reset waiting timeout for new connections
          timeoutRef.current = setTimeout(() => {
            setError("Quá thời gian chờ quét. Vui lòng tạo mã mới.");
            setConnectionStatus("timeout");
          }, WAITING_TIMEOUT);
        } else {
          setConnectionStatus("idle");
        }
      });

      conn.on("error", (err) => {
        clearTimeoutRef();
        clearDataTimeoutRef();
        setError(err.message);
        setConnectionStatus("error");
      });
    },
    [clearTimeoutRef, clearDataTimeoutRef],
  );

  const initializePeer = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      cleanup();
      setConnectionStatus("initializing");

      // Set timeout for peer initialization
      timeoutRef.current = setTimeout(() => {
        cleanupConnection();
        setError("Kết nối quá thời gian. Vui lòng thử lại.");
        setConnectionStatus("timeout");
        reject(new Error("Peer initialization timeout"));
      }, PEER_INIT_TIMEOUT);

      const peer = new Peer(PEER_CONFIG);
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
        setupConnectionListeners(conn, false); // Sender side
      });

      peer.on("error", (err) => {
        clearTimeoutRef();
        setError(err.message);
        setConnectionStatus("error");
        reject(err);
      });
    });
  }, [cleanup, cleanupConnection, clearTimeoutRef, setupConnectionListeners]);

  const connectToPeer = useCallback(
    (remotePeerId: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Set timeout for connection
        timeoutRef.current = setTimeout(() => {
          cleanupConnection();
          setError("Kết nối quá thời gian. Vui lòng quét lại.");
          setConnectionStatus("timeout");
          reject(new Error("Connection timeout"));
        }, PEER_CONNECT_TIMEOUT);

        if (!peerRef.current) {
          const peer = new Peer(PEER_CONFIG);
          peerRef.current = peer;

          peer.on("open", () => {
            setConnectionStatus("connecting");
            const conn = peer.connect(remotePeerId, { reliable: true });
            setupConnectionListeners(conn, true); // Receiver side

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
          setupConnectionListeners(conn, true); // Receiver side

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
    [cleanupConnection, clearTimeoutRef, setupConnectionListeners],
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
