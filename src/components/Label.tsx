import { classNames } from "primereact/utils";
import React from "react";

interface ILabel {
  title: string;
  value: string | number;
  pt?: {
    root?: string;
    title?: string;
    value?: string;
  };
}

const Label = ({ title, value, pt }: ILabel) => {
  const pt_root = classNames("flex justify-between w-full", pt?.root);
  const pt_title = classNames("font-bold", pt?.title);
  const pt_value = classNames("font-bold", pt?.title);

  return (
    <div className={pt_root}>
      <p className={pt_title}>{title}</p>
      <p className={pt_value}>{value}</p>
    </div>
  );
};

export default Label;
