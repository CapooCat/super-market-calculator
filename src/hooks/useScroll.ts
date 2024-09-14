import { useRef } from "react";

const useScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
        return;
      }

      if (window) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
        return;
      }
    }, 200);
  };

  const scrollToTop = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      if (window) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }
    }, 200);
  };

  return {
    scrollToBottom,
    scrollToTop,
    scrollRef,
  };
};

export default useScroll;
