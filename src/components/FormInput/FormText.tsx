import { IconX } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { InputText, InputTextProps } from "primereact/inputtext";
import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { usePreviousFocus } from "@/hooks/usePreviousFocus";

interface IFieldInput extends InputTextProps {
  name: string;
  clearable: boolean;
}

const FormText = ({ clearable = true, ...props }: IFieldInput) => {
  const { focusPrevious } = usePreviousFocus();
  const { control, setValue } = useFormContext();
  const input = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const handleClearInput = () => {
    focusPrevious();
    setValue(props.name, "");
  };

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => {
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        return useMemo(
          () => (
            <div className="flex w-full gap-2">
              <InputText
                {...props}
                ref={input}
                invalid={invalid}
                value={value ?? ""}
                onKeyDown={handleKeyDown}
                onChange={onChange}
                onBlur={onBlur}
              />
              {clearable && (
                <Button className="flex justify-center w-11" severity="danger" onClick={handleClearInput}>
                  <IconX size={18} />
                </Button>
              )}
            </div>
          ),
          [name, value, invalid, error],
        );
      }}
    />
  );
};

export default FormText;
