import { createContext, useContext, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface IUseFormStorage {
  children: React.ReactNode;
  name: string;
  storage: string;
}

const FormStorageContext = createContext({});

export function FormStorageProvider({ children, name, storage }: IUseFormStorage) {
  const { control } = useFormContext();
  const data = useWatch({ control, name: name });
  const [storedData, setStoredData] = useLocalStorage([], storage);

  useEffect(() => {
    setStoredData(data);
  }, [data]);

  return <FormStorageContext.Provider value={{}}>{children}</FormStorageContext.Provider>;
}
