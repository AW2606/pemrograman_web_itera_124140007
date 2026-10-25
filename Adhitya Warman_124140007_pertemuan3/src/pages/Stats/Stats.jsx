import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import { useBookStats } from '../../hooks/useBookStats';
import './Stats.css';

/**
 * Halaman Statistik (Stats)
 * Menggunakan custom hook useBookStats untuk menyajikan rekapitulasi data:
 * - Total seluruh buku di perpustakaan
 * - Jumlah per status (milik pribadi, sedang dibaca, rencana beli)
 * - Persentase distribusi koleksi beserta indikator visual
 */
export function Stats() {
  const { books } = useBooks();
  const { total, milik, baca, beli, percentages } = useBookStats(books);

  const statItems = [
    {
      key: 'milik',
      label: 'Milik Pribadi',
      count: milik,
      percent: percentages.milik,
      colorClass: 'color-milik',
      description: 'Buku fisik atau digital yang telah resmi menjadi aset koleksi pribadi.',
    },
    {
      key: 'baca',
      label: 'Sedang Dibaca',
      count: baca,
      percent: percentages.baca,
      colorClass: 'color-baca',
      description: 'Buku yang saat ini aktif dalam proses pembacaan atau telaah.',
    },
    {
      key: 'beli',
      label: 'Rencana Beli',
      count: beli,
      percent: percentages.beli,
      colorClass: 'color-beli',
      description: 'Daftar keinginan (wishlist) buku yang direncanakan untuk dibeli.',
    },
  ];

  return (
    <div className="stats-page" data-testid="stats-page">
      {/* Header Halaman Statistik */}
      <header className="stats-header">
        <div className="stats-header-text">
          <span className="stats-eyebrow">Analisis Koleksi</span>
          <h1 className="stats-title">Statistik Perpustakaan Pribadi</h1>
          <p className="stats-subtitle">
            Ringkasan menyeluruh mengenai proporsi buku yang telah dimiliki, sedang dibaca, maupun
            yang direncanakan untuk dibeli.
          </p>
        </div>
        <Link to="/" className="btn btn-secondary back-to-catalog-btn">
          ← Kembali ke Katalog
        </Link>
      </header>

      {/* Kartu Ringkasan Total */}
      <div className="stats-overview-grid">
        <div className="overview-card total-card">
          <span className="overview-label">Total Keseluruhan Koleksi</span>
          <div className="overview-value" data-testid="stat-total">
            {total}
          </div>
          <span className="overview-caption">Judul Buku Terdaftar</span>
        </div>

        {statItems.map((item) => (
          <div
            key={item.key}
            className={`overview-card ${item.colorClass}-card`}
            data-testid={`stat-${item.key}`}
          >
            <div className="card-top">
              <span className="overview-label">{item.label}</span>
              <span className={`status-pill ${item.colorClass}`}>
                {item.percent}%
              </span>
            </div>
            <div className="overview-value">{item.count}</div>
            <span className="overview-caption">{item.description}</span>
          </div>
        ))}
      </div>

      {/* Bagian Visualisasi Distribusi Persentase */}
      <section className="stats-section visual-distribution" aria-label="Distribusi Koleksi">
        <h2 className="section-heading">Distribusi Proporsi Koleksi</h2>
        <p className="section-subheading">
          Representasi visual persentase buku berdasarkan kategori status.
        </p>

        {total === 0 ? (
          <div className="stats-empty-note">
            Belum ada data buku untuk dianalisis. Silakan tambahkan buku terlebih dahulu di halaman Katalog.
          </div>
        ) : (
          <>
            {/* Multi-segmented Progress Bar */}
            <div className="stacked-progress-bar" role="meter" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="segment segment-milik"
                style={{ width: `${percentages.milik}%` }}
                title={`Milik Pribadi: ${percentages.milik}%`}
              />
              <div
                className="segment segment-baca"
                style={{ width: `${percentages.baca}%` }}
                title={`Sedang Dibaca: ${percentages.baca}%`}
              />
              <div
                className="segment segment-beli"
                style={{ width: `${percentages.beli}%` }}
                title={`Rencana Beli: ${percentages.beli}%`}
              />
            </div>

            {/* Rincian Bar Persentase Individu */}
            <div className="detailed-breakdown-list">
              {statItems.map((item) => (
                <div key={item.key} className="breakdown-row">
                  <div className="row-info">
                    <span className="row-label">{item.label}</span>
                    <span className="row-values">
                      <strong>{item.count}</strong> buku ({item.percent}%)
                    </span>
                  </div>
                  <div className="row-bar-bg">
                    <div
                      className={`row-bar-fill bar-${item.key}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Tabel Rangkuman Data */}
      <section className="stats-section table-section" aria-label="Tabel Rekapitulasi">
        <h2 className="section-heading">Tabel Rekapitulasi Koleksi</h2>
        <div className="table-responsive">
          <table className="stats-table">
            <thead>
              <tr>
                <th scope="col">Kategori Status</th>
                <th scope="col" className="text-right">Jumlah Buku</th>
                <th scope="col" className="text-right">Persentase</th>
                <th scope="col">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {statItems.map((item) => (
                <tr key={item.key}>
                  <td>
                    <span className={`status-pill ${item.colorClass}`}>
                      {item.label}
                    </span>
                  </td>
                  <td className="text-right font-mono">{item.count}</td>
                  <td className="text-right font-mono">{item.percent}%</td>
                  <td className="text-muted">{item.description}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total Keseluruhan</th>
                <th className="text-right font-mono">{total}</th>
                <th className="text-right font-mono">{total > 0 ? 100 : 0}%</th>
                <th className="text-muted">Koleksi terdata di penyimpanan lokal</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

Stats.propTypes = {};

export default Stats;
