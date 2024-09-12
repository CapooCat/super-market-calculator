import { InputText, InputTextProps } from "primereact/inputtext";
import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IFieldInput extends InputTextProps {
  name: string;
}

const FormText = (props: IFieldInput) => {
  const { control } = useFormContext();
  const input = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const { value, name } = field;
        const { invalid, error } = fieldState;

        return useMemo(
          () => (
            <InputText
              {...field}
              {...props}
              ref={input}
              invalid={invalid}
              value={value ?? ""}
              onKeyDown={handleKeyDown}
            />
          ),
          [name, value, invalid, error],
        );
      }}
    />
  );
};

export default FormText;
