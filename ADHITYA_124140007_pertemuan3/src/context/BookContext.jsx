/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Shape PropTypes untuk objek buku tunggal.
 * Digunakan untuk validasi props di seluruh komponen aplikasi.
 */
export const bookShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
  createdAt: PropTypes.string,
});

/**
 * Data awal koleksi buku untuk pengunjung baru jika localStorage masih kosong.
 */
const INITIAL_BOOKS = [
  {
    id: 'buku-1',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    status: 'milik',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'buku-2',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    status: 'baca',
    createdAt: '2026-02-14T11:30:00.000Z',
  },
  {
    id: 'buku-3',
    title: 'Cantik Itu Luka',
    author: 'Eka Kurniawan',
    status: 'beli',
    createdAt: '2026-03-01T09:15:00.000Z',
  },
  {
    id: 'buku-4',
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    status: 'milik',
    createdAt: '2026-03-20T14:45:00.000Z',
  },
];

const BookContext = createContext(null);

/**
 * Komponen Provider untuk Context API Buku.
 * Mengelola state global buku, filter status, kata kunci pencarian,
 * dan status buku yang sedang diedit.
 */
export function BookProvider({ children }) {
  // State tersimpan permanen di localStorage melalui custom hook useLocalStorage
  const [books, setBooks] = useLocalStorage('biblioteka_koleksi_buku', INITIAL_BOOKS);

  // State untuk filter status ('semua', 'milik', 'baca', 'beli')
  const [filter, setFilter] = useState('semua');

  // State kata kunci pencarian (judul / penulis)
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk buku yang sedang dalam mode pengeditan (null jika mode tambah)
  const [editingBook, setEditingBook] = useState(null);

  /**
   * Menambahkan buku baru ke daftar koleksi.
   * @param {Object} bookData - Data buku { title, author, status }
   */
  const addBook = (bookData) => {
    const newBook = {
      id: `buku-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: (bookData.title || bookData.judul || '').trim(),
      author: (bookData.author || bookData.penulis || '').trim(),
      status: bookData.status || 'milik',
      createdAt: new Date().toISOString(),
    };

    setBooks((prevBooks) => [newBook, ...prevBooks]);
    return newBook;
  };

  /**
   * Memperbarui informasi buku yang sudah ada.
   * @param {string|number} id - ID buku yang akan diubah
   * @param {Object} updatedData - Data baru buku
   */
  const editBook = (id, updatedData) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            title: (updatedData.title || updatedData.judul || book.title).trim(),
            author: (updatedData.author || updatedData.penulis || book.author).trim(),
            status: updatedData.status || book.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return book;
      })
    );

    // Reset status edit jika buku yang diedit sedang aktif di form
    if (editingBook && editingBook.id === id) {
      setEditingBook(null);
    }
  };

  /**
   * Menghapus buku dari koleksi dengan konfirmasi pengguna.
   * @param {string|number} id - ID buku yang akan dihapus
   * @param {boolean} [skipConfirm=false] - Opsi lewati konfirmasi (berguna untuk testing otomatis)
   */
  const deleteBook = (id, skipConfirm = false) => {
    const bookTarget = books.find((b) => b.id === id);
    const bookTitle = bookTarget ? `"${bookTarget.title}"` : 'buku ini';

    let shouldDelete = skipConfirm;
    if (!shouldDelete && typeof window !== 'undefined' && typeof window.confirm === 'function') {
      shouldDelete = window.confirm(`Apakah Anda yakin ingin menghapus ${bookTitle} dari koleksi perpustakaan?`);
    } else if (!shouldDelete) {
      shouldDelete = true;
    }

    if (shouldDelete) {
      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
      if (editingBook && editingBook.id === id) {
        setEditingBook(null);
      }
    }
  };

  /**
   * Memulai proses edit dengan mengisi form dengan data buku terpilih.
   */
  const startEditBook = (book) => {
    setEditingBook(book);
  };

  /**
   * Membatalkan proses edit dan kembali ke form penambahan buku baru.
   */
  const cancelEditBook = () => {
    setEditingBook(null);
  };

  /**
   * Menyaring daftar buku berdasarkan filter status dan pencarian (tidak peka huruf besar/kecil).
   */
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Filter status
      const matchesStatus = filter === 'semua' || book.status === filter;

      // Filter pencarian judul dan penulis (case-insensitive)
      const term = searchQuery.trim().toLowerCase();
      const matchesSearch =
        term === '' ||
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term));

      return matchesStatus && matchesSearch;
    });
  }, [books, filter, searchQuery]);

  const value = {
    books,
    filteredBooks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    editingBook,
    setEditingBook,
    startEditBook,
    cancelEditBook,
    addBook,
    editBook,
    deleteBook,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook useBooks
 * Memudahkan akses ke BookContext di komponen manapun.
 */
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam komponen BookProvider');
  }
  return context;
}

export default BookContext;
