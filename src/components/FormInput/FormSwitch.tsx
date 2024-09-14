import { InputSwitch, InputSwitchProps } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import React, { useMemo } from "react";
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
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        const cn_label = classNames("transition-all", {
          "text-gray-500": !value,
          "text-white": value,
        });

        const handleOnChange = (e) => {
          onChange(e.value);
          focusPrevious();
        };

        return useMemo(
          () => (
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
          ),
          [name, value, invalid, error],
        );
      }}
    />
  );
};

export default FormSwitch;
