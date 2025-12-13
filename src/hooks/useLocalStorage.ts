const useLocalStorage = <T>(initialValue: T, key: string): [T, (input: T) => void] => {
  try {
    let result = initialValue;
    const storedValue = localStorage.getItem(key) ?? null;
    result = storedValue ? JSON.parse(storedValue) : result;

    const setValue = (input: T) => {
      localStorage.setItem(key, JSON.stringify(input));
    };

    return [result, setValue];
  } catch {
    return [initialValue, () => {}];
  }
};

export default useLocalStorage;
