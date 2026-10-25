import PropTypes from 'prop-types';
import { useBooks, bookShape } from '../../context/BookContext';
import './BookList.css';

/**
 * Komponen BookItem
 * Menampilkan kartu informasi satu buku dengan judul, penulis, label status,
 * serta tombol aksi Edit dan Hapus (dengan konfirmasi).
 */
export function BookItem({ book, onEdit, onDelete }) {
  const statusLabels = {
    milik: 'Milik Pribadi',
    baca: 'Sedang Dibaca',
    beli: 'Rencana Beli',
  };

  const statusClass = `badge-status badge-${book.status || 'milik'}`;

  // Format tanggal jika tersedia
  const formattedDate = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <article className="book-item-card" data-testid={`book-item-${book.id}`}>
      <div className="book-item-content">
        <div className="book-item-header">
          <span className={statusClass}>
            {statusLabels[book.status] || book.status}
          </span>
          {formattedDate && (
            <time className="book-item-date" dateTime={book.createdAt}>
              Ditambahkan: {formattedDate}
            </time>
          )}
        </div>

        <h3 className="book-item-title" title={book.title || book.judul}>
          {book.title || book.judul}
        </h3>

        <p className="book-item-author">
          <span className="author-prefix">Karya:</span> {book.author || book.penulis}
        </p>
      </div>

      <div className="book-item-actions">
        <button
          type="button"
          className="btn-action btn-action-edit"
          onClick={() => onEdit(book)}
          aria-label={`Edit informasi buku ${book.title || book.judul}`}
          data-testid={`edit-book-${book.id}`}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn-action btn-action-delete"
          onClick={() => onDelete(book.id)}
          aria-label={`Hapus buku ${book.title || book.judul} dari koleksi`}
          data-testid={`delete-book-${book.id}`}
        >
          Hapus
        </button>
      </div>
    </article>
  );
}

BookItem.propTypes = {
  book: bookShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

/**
 * Komponen BookList
 * Menampilkan daftar kartu koleksi buku.
 * Jika daftar buku kosong, menampilkan pesan ramah bahwa tidak ada buku yang ditemukan.
 */
export function BookList({
  books,
  onEdit,
  onDelete,
  emptyMessage = 'Belum ada koleksi buku yang tersedia.',
}) {
  let contextValues = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextValues = useBooks();
  } catch {
    contextValues = null;
  }

  const list = books !== undefined ? books : (contextValues?.filteredBooks || []);
  const handleEdit = onEdit || contextValues?.startEditBook || (() => {});
  const handleDelete = onDelete || contextValues?.deleteBook || (() => {});

  if (!list || list.length === 0) {
    return (
      <div className="book-list-empty" data-testid="book-list-empty" role="status">
        <div className="empty-icon-wrap" aria-hidden="true">
          <svg
            className="empty-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <h4 className="empty-title">Tidak Ada Buku Ditemukan</h4>
        <p className="empty-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="book-list-container" data-testid="book-list">
      <div className="book-list-meta">
        <span className="book-list-count">
          Menampilkan <strong>{list.length}</strong> buku
        </span>
      </div>

      <div className="book-grid">
        {list.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape),
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  emptyMessage: PropTypes.string,
};

BookList.defaultProps = {
  books: undefined,
  onEdit: undefined,
  onDelete: undefined,
  emptyMessage: 'Belum ada koleksi buku yang tersedia.',
};

export default BookList;
