import { createContext, useContext, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
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
  const { control } = useFormContext();

  const methods: IFieldArray = useFieldArray({
    control: control,
    name: name,
  });

  return <FormArrayContext.Provider value={{ ...methods, name }}>{children}</FormArrayContext.Provider>;
}
