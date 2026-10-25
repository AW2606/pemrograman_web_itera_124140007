import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBookStats } from '../hooks/useBookStats';

describe('Custom Hook useBookStats', () => {
  it('5. Menghitung total dan jumlah per status beserta persentase dengan benar', () => {
    const mockBooks = [
      { id: '1', title: 'Buku A', author: 'Penulis A', status: 'milik' },
      { id: '2', title: 'Buku B', author: 'Penulis B', status: 'milik' },
      { id: '3', title: 'Buku C', author: 'Penulis C', status: 'baca' },
      { id: '4', title: 'Buku D', author: 'Penulis D', status: 'beli' },
    ];

    const { result } = renderHook(() => useBookStats(mockBooks));

    // Verifikasi total keseluruhan
    expect(result.current.total).toBe(4);

    // Verifikasi jumlah tiap status
    expect(result.current.milik).toBe(2);
    expect(result.current.baca).toBe(1);
    expect(result.current.beli).toBe(1);

    // Verifikasi persentase (2/4 = 50%, 1/4 = 25%, 1/4 = 25%)
    expect(result.current.percentages.milik).toBe(50);
    expect(result.current.percentages.baca).toBe(25);
    expect(result.current.percentages.beli).toBe(25);
  });

  it('5. Menangani daftar buku kosong tanpa error pembagian dengan nol', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current.total).toBe(0);
    expect(result.current.milik).toBe(0);
    expect(result.current.baca).toBe(0);
    expect(result.current.beli).toBe(0);
    expect(result.current.percentages.milik).toBe(0);
    expect(result.current.percentages.baca).toBe(0);
    expect(result.current.percentages.beli).toBe(0);
  });
});
