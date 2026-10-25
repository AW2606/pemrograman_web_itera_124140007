import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import './BookFilter.css';

/**
 * Komponen BookFilter
 * Menyediakan antarmuka penyaringan koleksi buku:
 * 1. Filter status: Semua, Milik Pribadi, Sedang Dibaca, Rencana Beli
 * 2. Pencarian teks: Berdasarkan judul buku atau nama penulis (case-insensitive)
 */
export function BookFilter({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) {
  // Ambil state dan action dari Context API jika props opsional tidak disediakan
  let contextValues = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    contextValues = useBooks();
  } catch {
    contextValues = null;
  }

  const activeFilter = currentFilter !== undefined ? currentFilter : (contextValues?.filter || 'semua');
  const handleFilterClick = onFilterChange || contextValues?.setFilter || (() => {});

  const activeSearch = searchQuery !== undefined ? searchQuery : (contextValues?.searchQuery || '');
  const handleSearchInput = onSearchChange || contextValues?.setSearchQuery || (() => {});

  const filterOptions = [
    { key: 'semua', label: 'Semua Koleksi' },
    { key: 'milik', label: 'Milik Pribadi' },
    { key: 'baca', label: 'Sedang Dibaca' },
    { key: 'beli', label: 'Rencana Beli' },
  ];

  return (
    <div className="book-filter-container" data-testid="book-filter">
      {/* Kolom Pencarian */}
      <div className="search-box">
        <label htmlFor="search-input" className="search-label">
          Pencarian Katalog
        </label>
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="search-input"
            type="search"
            className="search-input"
            placeholder="Cari berdasarkan judul atau penulis..."
            value={activeSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
            aria-label="Cari buku berdasarkan judul atau nama penulis"
          />
          {activeSearch && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => handleSearchInput('')}
              aria-label="Hapus kata kunci pencarian"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tombol Tab Filter Status */}
      <div className="filter-group">
        <span className="filter-group-label">Filter Status:</span>
        <div className="filter-tabs" role="tablist" aria-label="Filter status buku">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            const count = counts ? counts[option.key] : undefined;

            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`filter-${option.key}`}
                className={`filter-tab-btn ${isActive ? 'active' : ''} filter-${option.key}`}
                onClick={() => handleFilterClick(option.key)}
              >
                <span className="tab-label">{option.label}</span>
                {count !== undefined && (
                  <span className="tab-count-badge" aria-label={`${count} buku`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  currentFilter: PropTypes.oneOf(['semua', 'milik', 'baca', 'beli']),
  onFilterChange: PropTypes.func,
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func,
  counts: PropTypes.shape({
    semua: PropTypes.number,
    milik: PropTypes.number,
    baca: PropTypes.number,
    beli: PropTypes.number,
  }),
};

BookFilter.defaultProps = {
  currentFilter: undefined,
  onFilterChange: undefined,
  searchQuery: undefined,
  onSearchChange: undefined,
  counts: undefined,
};

export default BookFilter;
