import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from '../App';

describe('Alur Integrasi Aplikasi (App Integration)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('Menampilkan halaman utama, menambahkan buku baru, dan menghitung total', () => {
    render(<App />);

    // Memeriksa header aplikasi dan nama pembuat
    expect(screen.getByText('Biblioteka')).toBeInTheDocument();
    expect(screen.getAllByText('Adhitya Warman').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/124140007/).length).toBeGreaterThanOrEqual(1);

    // Memeriksa keberadaan form tambah buku
    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis buku/i);
    const submitBtn = screen.getByRole('button', { name: /tambahkan buku/i });

    // Tambah buku baru
    fireEvent.change(titleInput, { target: { value: 'Sitti Nurbaya' } });
    fireEvent.change(authorInput, { target: { value: 'Marah Rusli' } });
    fireEvent.click(submitBtn);

    // Verifikasi buku baru muncul di daftar
    expect(screen.getByText('Sitti Nurbaya')).toBeInTheDocument();
    expect(screen.getByText(/Marah Rusli/)).toBeInTheDocument();
  });

  it('Dapat memfilter daftar buku berdasarkan kata kunci pencarian', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/cari berdasarkan judul atau penulis/i);
    fireEvent.change(searchInput, { target: { value: 'Bumi Manusia' } });

    // Hanya buku yang cocok yang tampil
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.queryByText('Laskar Pelangi')).not.toBeInTheDocument();
  });

  it('Dapat menghapus buku setelah konfirmasi window.confirm disetujui', () => {
    // Mock konfirmasi browser
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<App />);

    // Pastikan buku Bumi Manusia ada di awal
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('delete-book-buku-1');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText('Bumi Manusia')).not.toBeInTheDocument();

    window.confirm.mockRestore();
  });
});
