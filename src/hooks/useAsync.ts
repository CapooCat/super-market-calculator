import { useCallback, useEffect, useState } from "react";

interface IHookOutput<T> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
  execute: (...args: any[]) => Promise<void>;
}

const useAsync = <T>(asyncFunction: (...args: any[]) => Promise<T>, dependencies: any[] = []): IHookOutput<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true);
      setData(null);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction, ...dependencies],
  );

  return { isLoading, data, error, execute };
};

export default useAsync;
