const useLocalStorage = (initialValue: any, key: string): any => {
  try {
    let result = initialValue;
    const storedValue = localStorage.getItem(key) ?? null;
    result = storedValue ? JSON.parse(storedValue) : result;

    const setValue = (input) => {
      localStorage.setItem(key, JSON.stringify(input));
    };

    return [result, setValue];
  } catch {
    return localStorage.getItem(key);
  }
};

export default useLocalStorage;
