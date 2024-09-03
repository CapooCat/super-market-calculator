import { createContext, useContext, useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import React from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface IFieldArray {
  fields: any;
  name?: string;
  append: (obj: object | object[]) => void;
  prepend: (obj: object | object[]) => void;
  insert: (index: number, value: object | object[]) => void;
  swap: (from: number, to: number) => void;
  move: (from: number, to: number) => void;
  update: (index: number, obj: object) => void;
  replace: (obj: object[]) => void;
  remove: (index?: number | number[]) => void;
}

const FormArrayContext = createContext({} as IFieldArray);

export const useFormArray = () => {
  return useContext(FormArrayContext);
};

export function FormArrayProvider({ children, name }) {
  const { control, getValues } = useFormContext();
  const [fieldArray, setFieldArray] = useLocalStorage([], "fieldArrayStore");

  const methods: IFieldArray = useFieldArray({
    control: control,
    name: name,
  });

  // useEffect(() => {
  //   const handleStore = () => {
  //     const fields = getValues(name);
  //     setFieldArray(fields);
  //   };
  //   window.addEventListener("beforeunload", handleStore);
  //   return () => window.removeEventListener("beforeunload", handleStore);
  // }, []);

  return <FormArrayContext.Provider value={{ ...methods, name }}>{children}</FormArrayContext.Provider>;
}
