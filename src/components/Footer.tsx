import React from "react";

import ButtonAddItem from "./ButtonAddItem";
import ButtonReset from "./ButtonReset";
import ButtonSplitInvoice from "./ButtonSplitInvoice";
import ButtonSummary from "./ButtonSummary";
import ButtonTransfer from "./ButtonTransfer";

const Footer = () => {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 h-32 pointer-events-none -z-1 bg-gradient-to-t from-[#070f23]/80 to-transparent" />
      <section className="fixed bottom-0 left-0 z-20 flex justify-center w-full h-20 gap-3 text-lg font-medium">
        <ButtonTransfer />
        <ButtonReset />
        <ButtonAddItem />
        <ButtonSummary />
        <ButtonSplitInvoice />
      </section>
    </>
  );
};

export default Footer;
