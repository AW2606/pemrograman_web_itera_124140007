import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import { Home } from './pages/Home/Home';
import { Stats } from './pages/Stats/Stats';
import './App.css';

/**
 * Komponen Halaman 404 Not Found sederhana
 * Menangani URL yang tidak terdaftar dengan antarmuka yang serasi.
 */
export function NotFound() {
  return (
    <div className="not-found-card" role="alert">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Halaman Tidak Ditemukan</h2>
      <p className="not-found-text">
        Halaman atau katalog buku yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link to="/" className="btn btn-primary">
        Kembali ke Katalog Utama
      </Link>
    </div>
  );
}

NotFound.propTypes = {};

/**
 * Komponen Utama Aplikasi (App)
 * Menyediakan kerangka navigasi multi-halaman React Router,
 * penyedia state global BookProvider, serta rute navigasi.
 */
export function App() {
  return (
    <BrowserRouter>
      <BookProvider>
        <div className="app-wrapper">
          {/* Header Situs & Bilah Navigasi Atas */}
          <header className="site-header">
            <div className="header-container">
              {/* Identitas Logo & Judul Aplikasi */}
              <Link to="/" className="brand-section" aria-label="Beranda Biblioteka">
                <div className="brand-icon-wrap" aria-hidden="true">
                  <svg
                    className="brand-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <line x1="12" y1="6" x2="16" y2="6" />
                    <line x1="12" y1="10" x2="16" y2="10" />
                  </svg>
                </div>
                <div className="brand-text">
                  <span className="brand-name">Biblioteka</span>
                  <span className="brand-tagline">Manajemen Buku Pribadi</span>
                </div>
              </Link>

              {/* Tautan Navigasi Antar Halaman */}
              <nav className="main-nav" aria-label="Navigasi Utama">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Katalog & Input
                </NavLink>
                <NavLink
                  to="/stats"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Statistik Koleksi
                </NavLink>
              </nav>

              {/* Lencana Identitas Mahasiswa Pembuat */}
              <div className="student-badge" title="Pemilik Proyek Tugas Praktikum">
                <div className="student-avatar" aria-hidden="true">AW</div>
                <div className="student-meta">
                  <span className="student-name">Adhitya Warman</span>
                  <span className="student-nim">124140007</span>
                </div>
              </div>
            </div>
          </header>

          {/* Konten Halaman Berdasarkan Rute */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Footer Aplikasi */}
          <footer className="site-footer">
            <div className="footer-container">
              <div className="footer-credits">
                <strong>Biblioteka Pribadi</strong> • Praktikum Pengembangan Aplikasi Web (Pertemuan 3)
              </div>
              <div className="footer-identity">
                Teknik Informatika ITERA • <strong>Adhitya Warman</strong> (124140007)
              </div>
            </div>
          </footer>
        </div>
      </BookProvider>
    </BrowserRouter>
  );
}

App.propTypes = {};

export default App;
