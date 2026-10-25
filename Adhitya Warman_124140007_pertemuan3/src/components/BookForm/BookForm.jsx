import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useBooks, bookShape } from '../../context/BookContext';
import './BookForm.css';

/**
 * Komponen Form untuk menambah atau mengedit buku.
 * Menyediakan validasi input: judul dan penulis wajib diisi (tidak boleh spasi saja).
 * Pesan kesalahan ditampilkan langsung di bawah input dengan border merah dan
 * otomatis hilang saat pengguna memperbaiki isian.
 */
export function BookForm({ initialData = null, onSubmit = null, onCancel = null }) {
  // Ambil fungsi addBook, editBook, editingBook, cancelEditBook dari context jika prop tidak disuplai
  let contextValues = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextValues = useBooks();
  } catch {
    // Context tidak ada (misal dalam unit test terisolasi), gunakan fallback
    contextValues = null;
  }

  const activeInitial = initialData || (contextValues ? contextValues.editingBook : null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'milik',
  });

  const [errors, setErrors] = useState({
    title: '',
    author: '',
  });

  // Sinkronisasi data form saat mode edit berubah atau data buku diedit berganti
  useEffect(() => {
    if (activeInitial) {
      setFormData({
        title: activeInitial.title || activeInitial.judul || '',
        author: activeInitial.author || activeInitial.penulis || '',
        status: activeInitial.status || 'milik',
      });
      setErrors({ title: '', author: '' });
    } else {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
      });
      setErrors({ title: '', author: '' });
    }
  }, [activeInitial]);

  /**
   * Menangani perubahan input teks atau seleksi status.
   * Langsung menghapus pesan error jika pengguna telah mengisi kolom.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hapus pesan error secara reaktif setelah pengguna memperbaiki input
    if (errors[name] && value.trim() !== '') {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Memvalidasi form sebelum pengiriman.
   * Mengabaikan input yang hanya berupa spasi (whitespace).
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Judul buku wajib diisi dan tidak boleh hanya spasi.';
    }

    if (!formData.author || formData.author.trim() === '') {
      newErrors.author = 'Nama penulis wajib diisi dan tidak boleh hanya spasi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Menangani submit form (tambah baru atau simpan perubahan).
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      status: formData.status,
    };

    if (onSubmit) {
      // Handler custom dari props (misal pada unit test)
      onSubmit(payload);
    } else if (contextValues) {
      // Handler bawaan dari Context API
      if (activeInitial) {
        contextValues.editBook(activeInitial.id, payload);
      } else {
        contextValues.addBook(payload);
      }
    }

    // Reset form jika bukan mode edit
    if (!activeInitial) {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
      });
      setErrors({ title: '', author: '' });
    }
  };

  /**
   * Menangani pembatalan mode edit.
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (contextValues && contextValues.cancelEditBook) {
      contextValues.cancelEditBook();
    }
    setFormData({
      title: '',
      author: '',
      status: 'milik',
    });
    setErrors({ title: '', author: '' });
  };

  const isEditing = Boolean(activeInitial);

  return (
    <div className="book-form-card" data-testid="book-form-card">
      <div className="form-card-header">
        <div className="form-header-badge">
          {isEditing ? 'Mode Edit' : 'Pencatatan Baru'}
        </div>
        <h2 className="form-title">
          {isEditing ? 'Perbarui Data Buku' : 'Tambah Buku ke Koleksi'}
        </h2>
        <p className="form-subtitle">
          {isEditing
            ? 'Perbaiki judul, nama penulis, atau status buku yang dipilih.'
            : 'Lengkapi formulir di bawah ini untuk mencatat buku ke dalam perpustakaan pribadi.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="book-form">
        {/* Kolom Judul Buku */}
        <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
          <label htmlFor="book-title" className="form-label">
            Judul Buku <span className="label-required">*</span>
          </label>
          <input
            id="book-title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="Contoh: Bumi Manusia"
            value={formData.title}
            onChange={handleChange}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <span id="title-error" className="error-message" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        {/* Kolom Penulis */}
        <div className={`form-group ${errors.author ? 'has-error' : ''}`}>
          <label htmlFor="book-author" className="form-label">
            Penulis Buku <span className="label-required">*</span>
          </label>
          <input
            id="book-author"
            name="author"
            type="text"
            className={`form-input ${errors.author ? 'input-error' : ''}`}
            placeholder="Contoh: Pramoedya Ananta Toer"
            value={formData.author}
            onChange={handleChange}
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? 'author-error' : undefined}
          />
          {errors.author && (
            <span id="author-error" className="error-message" role="alert">
              {errors.author}
            </span>
          )}
        </div>

        {/* Kolom Status Buku */}
        <div className="form-group">
          <label htmlFor="book-status" className="form-label">
            Status Buku
          </label>
          <div className="select-wrapper">
            <select
              id="book-status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="milik">Milik Pribadi (Koleksi)</option>
              <option value="baca">Sedang Dibaca (Proses)</option>
              <option value="beli">Rencana Beli (Wishlist)</option>
            </select>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary submit-btn">
            {isEditing ? 'Simpan Perubahan' : 'Tambahkan Buku'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary cancel-btn"
              onClick={handleCancel}
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

BookForm.propTypes = {
  initialData: bookShape,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default BookForm;
