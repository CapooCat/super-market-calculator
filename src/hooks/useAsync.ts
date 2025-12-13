import { useCallback, useState } from "react";

interface IHookOutput<T, Args extends unknown[]> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
  execute: (...args: Args) => Promise<void>;
}

const useAsync = <T, Args extends unknown[] = unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  dependencies: React.DependencyList = [],
): IHookOutput<T, Args> => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asyncFunction, ...dependencies],
  );

  return { isLoading, data, error, execute };
};

export default useAsync;
