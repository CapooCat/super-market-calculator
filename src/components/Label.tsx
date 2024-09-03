import React from "react";

const Label = ({ title, value }) => {
  return (
    <div className="flex justify-between">
      <p>{title}</p>
      <p>{value}</p>
    </div>
  );
};

export default Label;
