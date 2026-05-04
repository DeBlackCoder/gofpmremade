import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage and listen for changes across tabs/windows
 * 
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
        // Dispatch custom event for same-window updates
        window.dispatchEvent(new CustomEvent('local-storage', { detail: { key, value } }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes from other tabs/windows and same window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        // Cross-tab change
        if (e.key === key && e.newValue !== null) {
          try {
            setStoredValue(JSON.parse(e.newValue));
          } catch (error) {
            console.error(`Error parsing localStorage key "${key}":`, error);
          }
        }
      } else {
        // Same-window change via custom event
        const detail = (e as CustomEvent).detail;
        if (detail.key === key) {
          setStoredValue(detail.value);
        }
      }
    };

    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange as EventListener);
    // Listen for custom events (same-window)
    window.addEventListener('local-storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('local-storage', handleStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}
