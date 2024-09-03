import React, { useMemo, useRef } from "react";
import { InputText, InputTextProps } from "primereact/inputtext";
import { Controller, useFormContext } from "react-hook-form";
import { FloatLabel } from "primereact/floatlabel";

interface IFieldInput extends InputTextProps {
  name: string;
}

const FormText = (props: IFieldInput) => {
  const { control } = useFormContext();
  const input = useRef(null);

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const { value } = field;
        const { invalid, error } = fieldState;

        return useMemo(
          () => (
            <FloatLabel>
              <InputText {...field} {...props} ref={input} invalid={invalid} value={value ?? ""} />
              <label>{props.title}</label>
            </FloatLabel>
          ),
          [value, invalid, error]
        );
      }}
    />
  );
};

export default FormText;
