import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookFilter } from '../components/BookFilter/BookFilter';

describe('Komponen BookFilter', () => {
  it('4. Mengubah filter saat tombol status diklik', () => {
    const handleFilterChange = vi.fn();
    const handleSearchChange = vi.fn();

    render(
      <BookFilter
        currentFilter="semua"
        onFilterChange={handleFilterChange}
        searchQuery=""
        onSearchChange={handleSearchChange}
        counts={{ semua: 10, milik: 5, baca: 3, beli: 2 }}
      />
    );

    // Klik tombol filter "Milik Pribadi"
    const milikTab = screen.getByTestId('filter-milik');
    fireEvent.click(milikTab);
    expect(handleFilterChange).toHaveBeenCalledTimes(1);
    expect(handleFilterChange).toHaveBeenCalledWith('milik');

    // Klik tombol filter "Sedang Dibaca"
    const bacaTab = screen.getByTestId('filter-baca');
    fireEvent.click(bacaTab);
    expect(handleFilterChange).toHaveBeenCalledTimes(2);
    expect(handleFilterChange).toHaveBeenCalledWith('baca');

    // Uji input pencarian
    const searchInput = screen.getByPlaceholderText(/cari berdasarkan judul atau penulis/i);
    fireEvent.change(searchInput, { target: { value: 'Pramoedya' } });
    expect(handleSearchChange).toHaveBeenCalledWith('Pramoedya');
  });
});
