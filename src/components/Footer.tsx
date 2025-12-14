import React from "react";

import ButtonAddItem from "./ButtonAddItem";
import ButtonReset from "./ButtonReset";
import ButtonSummary from "./ButtonSummary";

const Footer = () => {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 h-32 pointer-events-none -z-1 bg-gradient-to-t from-black/80 to-transparent" />
      <section className="fixed bottom-0 left-0 z-20 flex justify-center w-full h-20 gap-8 text-lg font-medium">
        <ButtonReset />
        <ButtonAddItem />
        <ButtonSummary />
      </section>
    </>
  );
};

export default Footer;
