import { useState, useEffect } from 'react';

/**
 * Custom hook useLocalStorage
 * Berfungsi untuk menyinkronkan state React dengan browser localStorage.
 * Dilengkapi penanganan error (try/catch) agar aman dari JSON yang rusak atau kuota penuh.
 *
 * @param {string} key - Kunci penyimpanan di localStorage
 * @param {any} initialValue - Nilai default jika data belum ada atau rusak
 * @returns {[any, Function]} - Pasangan state nilai tersimpan dan fungsi updater
 */
export function useLocalStorage(key, initialValue) {
  // Inisialisasi state dengan pembacaan aman dari localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      // Jika data ditemukan, parse JSON; jika tidak, gunakan nilai awal
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // Jika JSON rusak atau akses ditolak, fallback ke initialValue
      return initialValue;
    }
  });

  // Efek samping untuk memperbarui localStorage saat key atau storedValue berubah
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch {
      // Penanganan jika kuota localStorage penuh atau akses ditolak
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
