import { useCallback, useEffect, useRef, useState } from "react";

import { db } from "@/db/database";

/**
 * Drop-in replacement for useLocalStorage that uses IndexedDB via Dexie
 * Maintains synchronous API while handling async operations internally
 *
 * @param initialValue - Default value if no stored data exists
 * @param key - Storage key
 * @returns [value, setValue, isLoading] tuple
 */
const useIndexedDB = <T>(initialValue: T, key: string): [T, (input: T) => void, boolean] => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const writeTimeoutRef = useRef<NodeJS.Timeout>();

  // Load from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // Load from IndexedDB
        const stored = await db.keyValueStore.get(key);
        if (stored && isMounted) {
          setValue(stored.value as T);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`IndexedDB load error for key "${key}":`, error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [key]);

  // Debounced setter (500ms to batch rapid updates)
  const setStoredValue = useCallback(
    (input: T) => {
      // Update React state immediately (synchronous)
      setValue(input);

      // Clear pending write
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current);
      }

      // Debounce IndexedDB write (async)
      writeTimeoutRef.current = setTimeout(async () => {
        try {
          await db.keyValueStore.put({ key, value: input });
        } catch (error) {
          console.error(`IndexedDB save error for key "${key}":`, error);

          // Check for quota exceeded
          if (error instanceof DOMException && error.name === "QuotaExceededError") {
            console.error("IndexedDB quota exceeded - consider cleaning old data");
          }
        }
      }, 500);
    },
    [key],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current);
      }
    };
  }, []);

  return [value, setStoredValue, isLoading];
};

export default useIndexedDB;
