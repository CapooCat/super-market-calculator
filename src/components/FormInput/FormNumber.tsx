import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";

interface IFieldInput extends InputNumberProps {
  name: string;
  extend?: {
    quickComplete?: boolean;
    onPressEnter?: () => void;
  };
}

const FormNumber = (props: IFieldInput) => {
  const { control, setValue } = useFormContext();
  const input = useRef(null);

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={0}
      render={({ field, fieldState }) => {
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        const handleOnChange = (e) => {
          const regex = /000$/;
          if (props.extend?.quickComplete && !regex.test(e.value)) onChange(e.value * 1000);
          else onChange(e.value);
        };

        const handleKeyDown = (e) => {
          if (e.key === "Enter") {
            e.target.blur();
            setTimeout(() => props.extend?.onPressEnter && props.extend?.onPressEnter(), 100);
          }
        };

        return useMemo(
          () => (
            <div className="flex gap-2">
              {props.showButtons && <Button icon={<IconMinus size={16} />} onClick={() => setValue(name, value - 1)} />}
              <InputNumber
                {...props}
                inputRef={input}
                id={name}
                value={value ?? 0}
                onValueChange={(e) => handleOnChange(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                showButtons={false}
                onBlur={onBlur}
                invalid={invalid}
              />
              {props.showButtons && <Button icon={<IconPlus size={16} />} onClick={() => setValue(name, value + 1)} />}
            </div>
          ),
          [name, value, invalid, error]
        );
      }}
    />
  );
};

export default FormNumber;
