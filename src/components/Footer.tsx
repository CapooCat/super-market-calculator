import React from "react";

import ButtonAddItem from "./ButtonAddItem";
import ButtonReset from "./ButtonReset";
import ButtonSummary from "./ButtonSummary";

const Footer = () => {
  return (
    <section className="fixed bottom-0 left-0 z-20 flex justify-center w-full h-12 gap-16 text-lg font-medium bg-gray-800">
      <ButtonReset />
      <ButtonAddItem />
      <ButtonSummary />
    </section>
  );
};

export default Footer;
