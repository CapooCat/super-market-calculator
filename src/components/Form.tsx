import React from "react";
import { useFormArray } from "@/context/FormArrayContext";
import useFormStorage from "@/hooks/useFormStorage";
import Item from "./Item";

const Form = () => {
  useFormStorage({ name: "fieldArray", storage: "fieldArrayStore" });
  const { fields, remove } = useFormArray();

  return (
    <ul className="gap-4 px-4 mb-24 divide-y-2 divide-gray-700 divide-dashed">
      {fields.map((item: any, index: number) => (
        <Item {...item} name={`fieldArray[${index}]`} key={item.id} index={index} onRemoveClick={() => remove(index)} />
      ))}
    </ul>
  );
};

export default Form;
