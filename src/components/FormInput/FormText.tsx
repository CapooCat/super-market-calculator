import { IconX } from "@tabler/icons-react";
import { Button } from "primereact/button";
import { useClickOutside } from "primereact/hooks";
import { InputText, InputTextProps } from "primereact/inputtext";
import React, { useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface IFieldInput extends InputTextProps {
  name: string;
  clearable: boolean;
}

const FormText = ({ clearable = true, ...props }: IFieldInput) => {
  const [isLastFocus, setIsLastFocus] = useState(false);
  const { control, setValue } = useFormContext();
  const input = useRef(null);
  const container = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  useClickOutside(container, () => {
    setIsLastFocus(false);
  });

  const handleClearInput = () => {
    const element: any = input.current;
    isLastFocus && element.focus();
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
            <div className="flex w-full gap-2" ref={container}>
              <InputText
                {...props}
                ref={input}
                invalid={invalid}
                value={value ?? ""}
                onKeyDown={handleKeyDown}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={() => setIsLastFocus(true)}
              />
              {clearable && (
                <Button className="flex justify-center w-11" severity="danger" onClick={handleClearInput}>
                  <IconX size={18} />
                </Button>
              )}
            </div>
          ),
          [name, value, invalid, error, isLastFocus],
        );
      }}
    />
  );
};

export default FormText;
