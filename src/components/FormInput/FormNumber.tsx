import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IFieldInput extends InputNumberProps {
  name: string;
  extend?: {
    quickComplete?: boolean;
    onPressEnter?: () => void;
  };
}

const FormNumber = ({ ...props }: IFieldInput) => {
  const { control, setValue } = useFormContext();
  const input = useRef(null);

  const isAtMax = (value: number) => {
    if (props.max && value > props.max) return true;
    return false;
  };

  const isAtMin = (value: number) => {
    if (props.min && value < props.min) return true;
    return false;
  };

  const handlePlusValue = (value: number, name: string) => {
    const plusValue = value + 1;
    isAtMax(plusValue) || setValue(name, plusValue);
  };

  const handleMinusValue = (value: number, name: string) => {
    const minusValue = value - 1;
    isAtMin(minusValue) || setValue(name, minusValue);
  };

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
              {props.showButtons && (
                <Button icon={<IconMinus size={16} />} onClick={() => handleMinusValue(value, name)} />
              )}
              <InputNumber
                {...props}
                inputRef={input}
                id={name}
                value={value ?? 0}
                onFocus={(e) => e.target.select()}
                onValueChange={(e) => handleOnChange(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                showButtons={false}
                onBlur={onBlur}
                invalid={invalid}
              />
              {props.showButtons && (
                <Button icon={<IconPlus size={16} />} onClick={() => handlePlusValue(value, name)} />
              )}
            </div>
          ),
          [name, value, invalid, error],
        );
      }}
    />
  );
};

export default FormNumber;
