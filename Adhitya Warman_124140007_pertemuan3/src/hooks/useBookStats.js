import { useMemo } from 'react';

/**
 * Custom hook useBookStats
 * Menghitung ringkasan statistik dari daftar buku:
 * - Total keseluruhan buku
 * - Jumlah buku berdasarkan tiap status (milik, baca, beli)
 * - Persentase masing-masing status terhadap total buku
 *
 * @param {Array<Object>} books - Daftar koleksi buku
 * @returns {Object} Objek ringkasan statistik dan persentase
 */
export function useBookStats(books = []) {
  return useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    const total = list.length;

    // Hitung jumlah kemunculan tiap status buku
    const milik = list.filter((b) => b.status === 'milik').length;
    const baca = list.filter((b) => b.status === 'baca').length;
    const beli = list.filter((b) => b.status === 'beli').length;

    // Perhitungan persentase yang aman dari pembagian dengan nol
    const calculatePercent = (count) => {
      if (total === 0) return 0;
      return Math.round((count / total) * 100);
    };

    const percentMilik = calculatePercent(milik);
    const percentBaca = calculatePercent(baca);
    const percentBeli = calculatePercent(beli);

    return {
      total,
      milik,
      baca,
      beli,
      counts: {
        semua: total,
        milik,
        baca,
        beli,
      },
      percentages: {
        milik: percentMilik,
        baca: percentBaca,
        beli: percentBeli,
      },
      // Akses langsung persentase dalam Bahasa Indonesia & Inggris untuk fleksibilitas
      persentaseMilik: percentMilik,
      persentaseBaca: percentBaca,
      persentaseBeli: percentBeli,
      percentMilik,
      percentBaca,
      percentBeli,
    };
  }, [books]);
}

export default useBookStats;
