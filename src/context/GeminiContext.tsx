import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

import { checkGeminiConnection, extractFromImage, getApiKey, IExtractionResult, isApiKeyFormatValid } from "@/utils/geminiOCR";

export type ExtractionStatus = "idle" | "extracting" | "success" | "error" | "not_found";

interface IGeminiContext {
  isConnected: boolean;
  isChecking: boolean;
  extractionStatus: ExtractionStatus;
  resetExtractionStatus: () => void;
  startBackgroundExtraction: (
    base64Image: string,
    fieldPrefix: string,
    setValue: UseFormSetValue<Record<string, unknown>>,
    currency?: string,
  ) => void;
}

const GeminiContext = createContext<IGeminiContext | undefined>(undefined);

const CONNECTION_CHECK_INTERVAL = 60000;

export const GeminiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>("idle");

  const resetExtractionStatus = useCallback(() => {
    setExtractionStatus("idle");
  }, []);

  const apiKey = getApiKey();
  const hasValidKeyFormat = isApiKeyFormatValid(apiKey);

  const verifyConnection = useCallback(async () => {
    if (!hasValidKeyFormat) {
      setIsConnected(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const connected = await checkGeminiConnection(apiKey);
    setIsConnected(connected);
    setIsChecking(false);
  }, [apiKey, hasValidKeyFormat]);

  const applyExtractionResult = useCallback(
    (result: IExtractionResult, fieldPrefix: string, setValue: UseFormSetValue<Record<string, unknown>>) => {
      if (result.price !== null) {
        setValue(`${fieldPrefix}.price`, result.price as never);
      }
      if (result.name !== null) {
        setValue(`${fieldPrefix}.name`, result.name as never);
      }
    },
    [],
  );

  const startBackgroundExtraction = useCallback(
    (
      base64Image: string,
      fieldPrefix: string,
      setValue: UseFormSetValue<Record<string, unknown>>,
      currency: string = "VND",
    ) => {
      if (!isConnected) {
        return;
      }

      setExtractionStatus("extracting");

      extractFromImage(base64Image, apiKey, currency)
        .then((result) => {
          if (result.price !== null || result.name !== null) {
            applyExtractionResult(result, fieldPrefix, setValue);
            setExtractionStatus("success");
          } else {
            setExtractionStatus("not_found");
          }
        })
        .catch(() => {
          setExtractionStatus("error");
        });
    },
    [apiKey, isConnected, applyExtractionResult],
  );

  useEffect(() => {
    verifyConnection();

    const interval = setInterval(verifyConnection, CONNECTION_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [verifyConnection]);

  return (
    <GeminiContext.Provider
      value={{
        isConnected,
        isChecking,
        extractionStatus,
        resetExtractionStatus,
        startBackgroundExtraction,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
};

export const useGeminiContext = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error("useGeminiContext must be used within a GeminiProvider");
  }
  return context;
};
