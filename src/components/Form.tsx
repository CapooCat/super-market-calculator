import React from "react";

import Item from "./Item";
import { useFormArray } from "@/context/FormArrayContext";

const Form = () => {
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
