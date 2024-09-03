import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";

interface IFieldInput extends InputNumberProps {
  name: string;
}

const FormNumber = function FormNumber(props: IFieldInput) {
  const { control } = useFormContext();
  const input = useRef(null);

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => {
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        return useMemo(
          () => (
            <FloatLabel>
              <InputNumber
                {...props}
                inputRef={input}
                id={name}
                value={value ?? null}
                onValueChange={(e) => onChange(e.value)}
                onBlur={onBlur}
                invalid={invalid}
              />
              <label>{props.title}</label>
            </FloatLabel>
          ),
          [value, invalid, error]
        );
      }}
    />
  );
};

export default FormNumber;
