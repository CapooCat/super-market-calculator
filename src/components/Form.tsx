import React from "react";
import { useFormArray } from "@/context/FormArrayContext";
import Item from "./Item";

const Form = () => {
  const { fields, remove } = useFormArray();

  return (
    <ul className="gap-4 px-4 divide-y-2 divide-gray-700 mb-14 divide-dashed">
      {fields.map((item: any, index: number) => (
        <Item {...item} name={`fieldArray[${index}]`} key={item.id} onRemoveClick={() => remove(index)} />
      ))}
    </ul>
  );
};

export default Form;
