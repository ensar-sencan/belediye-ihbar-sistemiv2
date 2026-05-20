import { useEffect, useState } from 'react';

/**
 * Debounce hook - Kullanıcı yazmayı bıraktıktan sonra belirli bir süre bekler
 * @param value - Debounce edilecek değer
 * @param delay - Bekleme süresi (ms)
 * @returns Debounced değer
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Değer değiştiğinde timer başlat
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Yeni değer gelirse önceki timer'ı iptal et
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
