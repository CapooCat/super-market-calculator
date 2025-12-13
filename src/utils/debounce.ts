type DebounceFunction = (...args: unknown[]) => void;

function debounce<F extends DebounceFunction>(func: F, delay: number): F {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: unknown[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as F;
}

export default debounce;
