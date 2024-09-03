import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";

interface IFieldInput extends InputNumberProps {
  name: string;
}

const FormNumber = function FormNumber(props: IFieldInput) {
  const { control, setValue, getValues } = useFormContext();
  const input = useRef(null);

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => {
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        if (props.showButtons)
          return useMemo(
            () => (
              <div className="flex gap-2">
                <Button icon={<IconMinus size={14} />} onClick={() => setValue(name, value - 1)} />
                <InputNumber
                  {...props}
                  inputRef={input}
                  id={name}
                  value={value ?? 0}
                  onValueChange={(e) => onChange(e.value)}
                  showButtons={false}
                  onBlur={onBlur}
                  invalid={invalid}
                />
                <Button icon={<IconPlus size={14} />} onClick={() => setValue(name, value + 1)} />
              </div>
            ),
            [name, value, invalid, error]
          );
        else
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
            [name, value, invalid, error]
          );
      }}
    />
  );
};

export default FormNumber;
