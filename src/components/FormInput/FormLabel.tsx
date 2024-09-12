import { classNames } from "primereact/utils";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface ILabel {
  title: string;
  name: string;
  pt?: {
    root?: string;
    title?: string;
    value?: string;
  };
}

const FormLabel = ({ title, name, pt }: ILabel) => {
  const { control } = useFormContext();
  const value = useWatch({ control, name });
  const pt_root = classNames("flex justify-between w-full gap-4", pt?.root);
  const pt_title = classNames("font-bold grow shrink-0", pt?.title);
  const pt_value = classNames("font-bold text-right", pt?.title);

  return (
    <div className={pt_root}>
      <p className={pt_title}>{title}</p>
      <p className={pt_value}>{value.length ? value : "Không tên"}</p>
    </div>
  );
};

export default FormLabel;
