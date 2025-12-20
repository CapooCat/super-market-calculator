import { createContext, useEffect } from "react";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import useIndexedDB from "@/hooks/useIndexedDB";

interface IUseFormStorage {
  children: React.ReactNode;
  name: string;
  storage: string;
}

const FormStorageContext = createContext({});

export function FormStorageProvider({ children, name, storage }: IUseFormStorage) {
  const { control } = useFormContext();
  const data = useWatch({ control, name: name });
  const [, setStoredData, isLoading] = useIndexedDB([], storage);

  useEffect(() => {
    if (!isLoading) {
      setStoredData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return <FormStorageContext.Provider value={{}}>{children}</FormStorageContext.Provider>;
}
