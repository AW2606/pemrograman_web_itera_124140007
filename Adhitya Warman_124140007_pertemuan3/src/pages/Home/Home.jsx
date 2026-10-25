import { useBooks } from '../../context/BookContext';
import { useBookStats } from '../../hooks/useBookStats';
import { BookForm } from '../../components/BookForm/BookForm';
import { BookFilter } from '../../components/BookFilter/BookFilter';
import { BookList } from '../../components/BookList/BookList';
import './Home.css';

/**
 * Halaman Utama (Home)
 * Memuat formulir penambahan/pengeditan buku, bilah filter dan pencarian,
 * serta daftar koleksi buku yang aktif.
 */
export function Home() {
  const { books, filteredBooks, filter, setFilter, searchQuery, setSearchQuery, editingBook } =
    useBooks();

  // Hitung jumlah untuk label badge pada filter
  const { counts } = useBookStats(books);

  return (
    <div className="home-page" data-testid="home-page">
      {/* Banner Ringkasan Selamat Datang */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Katalog & Manajemen Buku Pribadi</h1>
          <p className="hero-description">
            Kelola arsip bacaan, buku yang dimiliki, dan daftar buku impian dalam satu antarmuka
            yang tertata rapi.
          </p>
        </div>
        <div className="hero-stats-badge">
          <span className="badge-number">{books.length}</span>
          <span className="badge-text">Total Koleksi</span>
        </div>
      </section>

      {/* Tata Letak Dua Kolom: Form Input di Sisi Kiri, Daftar Buku di Kanan */}
      <div className="home-layout">
        {/* Kolom Formulir Input / Edit */}
        <aside className="home-sidebar" aria-label="Formulir Buku">
          <div className="sticky-wrapper">
            <BookForm />
          </div>
        </aside>

        {/* Kolom Utama: Filter, Pencarian, & Daftar Buku */}
        <section className="home-main" aria-label="Daftar Koleksi Buku">
          <BookFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            counts={counts}
          />

          <div className="collection-header">
            <h2 className="section-title">
              {editingBook ? 'Daftar Buku (Sedang Mengedit)' : 'Daftar Koleksi'}
            </h2>
            {searchQuery && (
              <span className="search-status-text">
                Hasil pencarian untuk <em>&quot;{searchQuery}&quot;</em>
              </span>
            )}
          </div>

          <BookList
            books={filteredBooks}
            emptyMessage={
              searchQuery
                ? `Tidak ada buku yang cocok dengan kata kunci "${searchQuery}".`
                : filter !== 'semua'
                ? `Belum ada buku dengan status "${filter}".`
                : 'Belum ada koleksi buku yang tersimpan. Silakan tambahkan buku baru melalui formulir.'
            }
          />
        </section>
      </div>
    </div>
  );
}

Home.propTypes = {};

export default Home;
