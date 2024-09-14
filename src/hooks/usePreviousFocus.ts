import { useEffect, useRef } from "react";

import debounce from "@/utils/debounce";

export const usePreviousFocus = () => {
  const prevFocusedElement = useRef<Element | null>(null);

  useEffect(() => {
    // Store the currently focused element whenever focus changes
    const handleFocusIn = debounce(() => {
      prevFocusedElement.current = document.activeElement as Element;
    }, 200);

    // If no element is focused, reset the ref
    const handleFocusOut = debounce(() => {
      if (document.activeElement !== prevFocusedElement.current) {
        prevFocusedElement.current = null;
      }
    }, 200);

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Method to refocus on the previously focused element
  const focusPrevious = () => {
    if (prevFocusedElement.current instanceof HTMLElement) {
      prevFocusedElement.current.focus();
    }
  };

  return { focusPrevious };
};
