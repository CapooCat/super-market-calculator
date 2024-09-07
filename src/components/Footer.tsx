import React from "react";
import ButtonAddItem from "./ButtonAddItem";
import ButtonSummary from "./ButtonSummary";
import ButtonOnlineShopping from "./ButtonOnlineShopping";

const Footer = () => {
  return (
    <section className="sticky bottom-0 left-0 z-20 flex justify-center w-full h-12 gap-16 text-lg font-medium bg-gray-800">
      <ButtonOnlineShopping />
      <ButtonAddItem />
      <ButtonSummary />
    </section>
  );
};

export default Footer;
