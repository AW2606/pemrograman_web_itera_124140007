import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookList } from '../components/BookList/BookList';

describe('Komponen BookList', () => {
  const sampleBooks = [
    {
      id: 'b1',
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      status: 'milik',
      createdAt: '2026-01-10T10:00:00.000Z',
    },
    {
      id: 'b2',
      title: 'Cantik Itu Luka',
      author: 'Eka Kurniawan',
      status: 'beli',
      createdAt: '2026-02-10T10:00:00.000Z',
    },
  ];

  it('3. Menampilkan pesan kosong bila daftar buku kosong', () => {
    render(<BookList books={[]} emptyMessage="Koleksi buku kosong." onEdit={vi.fn()} onDelete={vi.fn()} />);

    // Memeriksa pesan kosong dan status role
    expect(screen.getByTestId('book-list-empty')).toBeInTheDocument();
    expect(screen.getByText('Koleksi buku kosong.')).toBeInTheDocument();
  });

  it('3. Menampilkan daftar buku dengan benar jika data tersedia', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <BookList
        books={sampleBooks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    // Memeriksa bahwa judul buku dan penulis ditampilkan
    expect(screen.getByText('Bumi Manusia')).toBeInTheDocument();
    expect(screen.getByText(/Pramoedya Ananta Toer/)).toBeInTheDocument();
    expect(screen.getByText('Cantik Itu Luka')).toBeInTheDocument();
    expect(screen.getByText(/Eka Kurniawan/)).toBeInTheDocument();

    // Memeriksa klik tombol edit
    const editBtn = screen.getByTestId('edit-book-b1');
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(sampleBooks[0]);

    // Memeriksa klik tombol hapus
    const deleteBtn = screen.getByTestId('delete-book-b2');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith('b2');
  });
});
