import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { IconMinus, IconPlus } from "@tabler/icons-react";

interface IFieldInput extends InputNumberProps {
  name: string;
  multiply?: number;
}

const FormNumber = function FormNumber(props: IFieldInput) {
  const { control, setValue } = useFormContext();
  const input = useRef(null);

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => {
        const { name, value, onBlur, onChange } = field;
        const { invalid, error } = fieldState;

        const handleOnChange = (e) => {
          if (props.multiply && !value) onChange(e.value * props.multiply);
          else onChange(e.value);
        };

        return useMemo(
          () => (
            <div className="flex gap-2">
              {props.showButtons && <Button icon={<IconMinus size={16} />} onClick={() => setValue(name, value - 1)} />}
              <InputNumber
                {...props}
                inputRef={input}
                id={name}
                value={value ?? null}
                onValueChange={(e) => handleOnChange(e)}
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
