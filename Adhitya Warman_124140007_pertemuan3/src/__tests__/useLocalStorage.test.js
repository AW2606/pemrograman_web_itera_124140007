import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('Custom Hook useLocalStorage', () => {
  const TEST_KEY = 'test_library_storage';

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('6. Membaca initialValue saat localStorage kosong dan menyimpannya saat nilai diubah', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, ['Buku 1']));

    // Nilai awal harus sesuai default
    expect(result.current[0]).toEqual(['Buku 1']);

    // Perbarui nilai state
    act(() => {
      const setStored = result.current[1];
      setStored(['Buku 1', 'Buku 2']);
    });

    // Nilai state harus terupdate
    expect(result.current[0]).toEqual(['Buku 1', 'Buku 2']);

    // Nilai di localStorage harus tersimpan secara tepat sebagai string JSON
    const storedInStorage = JSON.parse(window.localStorage.getItem(TEST_KEY));
    expect(storedInStorage).toEqual(['Buku 1', 'Buku 2']);
  });

  it('6. Membaca data yang sudah tersimpan sebelumnya di localStorage', () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify(['Buku Tersimpan']));

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, []));

    expect(result.current[0]).toEqual(['Buku Tersimpan']);
  });

  it('6. Aman terhadap JSON rusak di localStorage dan kembali ke initialValue', () => {
    // Simpan string yang bukan format JSON valid
    window.localStorage.setItem(TEST_KEY, '{data_rusak_bukan_json');

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, ['Fallback Buku']));

    // State harus fallback ke initialValue tanpa melempar exception crash
    expect(result.current[0]).toEqual(['Fallback Buku']);
  });
});
