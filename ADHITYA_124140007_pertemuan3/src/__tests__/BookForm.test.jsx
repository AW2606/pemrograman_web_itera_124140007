import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookForm } from '../components/BookForm/BookForm';

describe('Komponen BookForm', () => {
  it('1. Menampilkan pesan error saat judul dan penulis kosong atau hanya spasi', () => {
    const handleSubmit = vi.fn();
    render(<BookForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /tambahkan buku/i });

    // Submit form dalam kondisi kolom kosong
    fireEvent.click(submitBtn);

    // Verifikasi pesan error muncul
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();

    // Verifikasi input hanya spasi tetap menampilkan error
    const titleInput = screen.getByLabelText(/judul buku/i);
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();

    // Verifikasi pesan error hilang setelah pengguna memperbaiki input
    fireEvent.change(titleInput, { target: { value: 'Bumi Manusia' } });
    expect(screen.queryByText(/judul buku wajib diisi/i)).not.toBeInTheDocument();
  });

  it('2. Memanggil handler submit dengan data yang benar saat input valid', () => {
    const handleSubmit = vi.fn();
    render(<BookForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/penulis buku/i);
    const statusSelect = screen.getByLabelText(/status buku/i);
    const submitBtn = screen.getByRole('button', { name: /tambahkan buku/i });

    // Isi formulir dengan data yang valid
    fireEvent.change(titleInput, { target: { value: 'Laskar Pelangi' } });
    fireEvent.change(authorInput, { target: { value: 'Andrea Hirata' } });
    fireEvent.change(statusSelect, { target: { value: 'baca' } });

    // Kirim formulir
    fireEvent.click(submitBtn);

    // Verifikasi handler dipanggil dengan payload yang sesuai
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'baca',
    });
  });
});
