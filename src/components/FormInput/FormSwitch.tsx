import { InputSwitch, InputSwitchChangeEvent, InputSwitchProps } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { usePreviousFocus } from "@/hooks/usePreviousFocus";

interface IFieldInput extends Omit<InputSwitchProps, "checked"> {
  name: string;
  checked?: boolean;
  label?: string;
}

const FormSwitch = ({ label, ...props }: IFieldInput) => {
  const { control } = useFormContext();
  const { focusPrevious } = usePreviousFocus();

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={false}
      render={({ field, fieldState }) => {
        const { value, onBlur, onChange } = field;
        const { invalid } = fieldState;

        const cn_label = classNames("transition-all", {
          "text-gray-500": !value,
          "text-white": value,
        });

        const handleOnChange = (e: InputSwitchChangeEvent) => {
          onChange(e.value);
          focusPrevious();
        };

        return (
          <div className="flex items-center gap-2">
            {label && <span className={cn_label}>{label}</span>}
            <InputSwitch
              {...props}
              invalid={invalid}
              checked={value}
              onChange={handleOnChange}
              disabled={false}
              onBlur={onBlur}
            />
          </div>
        );
      }}
    />
  );
};

export default FormSwitch;
