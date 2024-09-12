type DebounceFunction = (...args: any[]) => void;

function debounce<F extends DebounceFunction>(func: F, delay: number): F {
  let timeoutId: any = null;

  return function (this: any, ...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as F;
}

export default debounce;
