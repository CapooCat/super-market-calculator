import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import useLocalStorage from "@/hooks/useLocalStorage";

interface IUseFormStorage {
  name: string;
  storage: string;
}

const useFormStorage = ({ name, storage }: IUseFormStorage) => {
  const { control } = useFormContext();
  const data = useWatch({ control, name: name });
  const [storedData, setStoredData] = useLocalStorage([], storage);

  useEffect(() => {
    setStoredData(data);
  }, [data]);
};

export default useFormStorage;
