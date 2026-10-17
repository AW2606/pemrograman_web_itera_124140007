// Latihan Async Programming - PAW Pertemuan 2
const API = 'https://jsonplaceholder.typicode.com';
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Kamus terjemahan & lokalisasi data dummy JSONPlaceholder ke Bahasa Indonesia
const TRANSLATION_MAP = {
  // Post titles umum
  'sunt aut facere repellat provident occaecati excepturi optio reprehenderit': 'Panduan Memulai Pemrograman Web Modern dengan ES6+ dan Async/Await',
  'qui est esse': 'Mengenal Konsep Promise, Event Loop, dan Asynchronous JavaScript',
  'ea molestias quasi exercitationem repellat qui ipsa sit aut': 'Implementasi Fetch API dan Integrasi RESTful Endpoint',
  'eum et est occaecati': 'Optimasi Pengambilan Data Paralel Menggunakan Promise.all',
  'nesciunt quas odio': 'Strategi Exponential Backoff dan Mekanisme Retry Otomatis',
  'dolorem eum magni eos aperiam quia': 'Manajemen Status Loading dan Pencegahan Race Condition',
  'magnam facilis autem': 'Penanganan Error Asynchronous dengan Async Error Boundary',
  'dolorem dolore est ipsam': 'Teknik Pagination Dinamis Menggunakan Parameter Query API',
  'nesciunt iure omnis dolorem tempora et accusantium': 'Optimasi Input Pengguna dengan Debouncing dan AbortController',
  'optio molestias id quia eum': 'Arsitektur Aplikasi Web Berbasis Komponen Reusable',

  // Todos umum
  'delectus aut autem': 'Menyelesaikan modul praktikum Pemrograman Aplikasi Web (PAW)',
  'quis ut nam facilis et officia qui': 'Mempersiapkan bahan presentasi proyek akhir semester',
  'fugiat veniam minus': 'Mempelajari arsitektur REST API dan manipulasi DOM modern',
  'et porro tempora': 'Mengerjakan tugas laporan pendahuluan pertemuan 2',
  'laboriosam mollitia et enim quasi adipisci quia provident illum': 'Melakukan code review dan pengujian error boundary',
};

const TECH_TOPICS = [
  'Dasar-dasar Sintaks ES6+ JavaScript',
  'Pengenalan Fetch API dan Objek Response',
  'Memahami Perbedaan Synchronous dan Asynchronous',
  'Teknik Menggabungkan Banyak Request dengan Promise.all',
  'Simulasi Jaringan Lambat dan Penanganan Timeout',
  'Penerapan Exponential Backoff pada Jaringan Tidak Stabil',
  'Manajemen State Antarmuka Saat Memuat Data',
  'Menangkap Unhandled Rejection di Lingkungan Browser',
  'Penerapan Pagination Berbasis Halaman dan Limit',
  'Implementasi Debounce untuk Menghemat Kuota Request',
  'Pembatalan Request dengan AbortController',
  'Struktur Kode Berorientasi Objek dengan Class ES6',
];

// Helper: Ubah teks Latin API ke Bahasa Indonesia yang relevan
const toIndo = (latinText, id = null) => {
  if (!latinText) return '';
  const clean = latinText.trim().toLowerCase();
  if (TRANSLATION_MAP[clean]) {
    return TRANSLATION_MAP[clean];
  }
  if (id) {
    const topic = TECH_TOPICS[(id - 1) % TECH_TOPICS.length];
    return `${topic} (Modul #${id})`;
  }
  const index = Math.abs(latinText.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % TECH_TOPICS.length;
  return `${TECH_TOPICS[index]}`;
};

const toIndoBody = () => {
  return 'Artikel ini membahas implementasi praktis konsep asynchronous programming pada JavaScript modern, mencakup pengelolaan promise, penanganan error jaringan, dan optimasi performa antarmuka pengguna secara efisien.';
};

const fetchJSON = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status} dari ${new URL(url).host}`);
  return res.json();
};

// Latihan 3 dan 4: panel yang mengelola loading state dan error boundary
class AsyncPanel {
  constructor(el) { this.el = el; this.token = 0; }
  cancel() { this.token++; }
  async run(task, render) {
    const token = ++this.token;
    this.el.setAttribute('aria-busy', 'true');
    this.el.innerHTML = '<p><span class="spin"></span>Memuat data dari server...</p>';
    try {
      const data = await task();
      if (token !== this.token) return; // respons usang diabaikan
      this.el.innerHTML = render(data);
    } catch (error) {
      if (token !== this.token) return;
      this.showError(error, () => this.run(task, render));
    } finally {
      if (token === this.token) this.el.removeAttribute('aria-busy');
    }
  }
  showError({ message }, retry) {
    this.el.innerHTML = `<div class="error" role="alert"><p>Gagal memuat data: ${escapeHTML(message)}</p><button type="button">Coba lagi</button></div>`;
    this.el.querySelector('button').addEventListener('click', retry);
  }
}
const panels = Object.fromEntries(
  ['combine', 'loading', 'error', 'page', 'search'].map((name) => [name, new AsyncPanel($(`out-${name}`))])
);

// Latihan 1: fetch beberapa endpoint lalu gabungkan hasilnya
const fetchCombined = async (userId = 1) => {
  const started = performance.now();
  const [user, posts, todos] = await Promise.all([
    fetchJSON(`${API}/users/${userId}`),
    fetchJSON(`${API}/posts?userId=${userId}&_limit=3`),
    fetchJSON(`${API}/todos?userId=${userId}&_limit=3`),
  ]);
  return { user, posts, todos, ms: Math.round(performance.now() - started) };
};

const renderCombined = ({ user, posts, todos, ms }) => `
  <div class="user-profile-badge">
    <p><strong>${escapeHTML(user.name)}</strong> (${escapeHTML(user.email)}) &bull; Perusahaan: <span class="badge-company">${escapeHTML(user.company.name)}</span></p>
  </div>

  <p class="section-subheading">Postingan Terkini (Bahasa Indonesia):</p>
  <ul class="translated-list">
    ${posts.map((p) => `
      <li>
        <div class="translated-title">&#128214; ${escapeHTML(toIndo(p.title, p.id))}</div>
        <div class="api-raw-hint">Asli API (Latin): "${escapeHTML(p.title)}"</div>
      </li>
    `).join('')}
  </ul>

  <p class="section-subheading">Daftar Todo Pengguna:</p>
  <ul class="translated-list">
    ${todos.map((t) => `
      <li>
        <span class="status-tag ${t.completed ? 'done' : 'pending'}">${t.completed ? '&#10003; Selesai' : '&#9675; Belum Selesai'}</span>
        <div class="translated-title">${escapeHTML(toIndo(t.title, t.id))}</div>
        <div class="api-raw-hint">Asli API (Latin): "${escapeHTML(t.title)}"</div>
      </li>
    `).join('')}
  </ul>
  <p class="meta">&#9889; 3 endpoint selesai digabungkan dalam <strong>${ms} ms</strong> secara paralel via <code>Promise.all</code>.</p>`;

// Latihan 2: retry dengan exponential backoff
const withRetry = async (task, { retries = 4, baseDelay = 400, onRetry = () => {} } = {}) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task(attempt);
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = baseDelay * 2 ** attempt;
      onRetry({ attempt: attempt + 1, delay, error });
      await sleep(delay);
    }
  }
};

const runRetryDemo = async (failTimes) => {
  const log = $('retry-log');
  const write = (text) => { log.textContent += `${text}\n`; };
  log.textContent = '';
  try {
    const todo = await withRetry(async (attempt) => {
      write(`Percobaan ${attempt + 1}...`);
      if (attempt < failTimes) throw new Error('Server sibuk (simulasi)');
      return fetchJSON(`${API}/todos/1`);
    }, { onRetry: ({ attempt, delay, error }) => write(`  Gagal: ${error.message}. Retry ke-${attempt} dalam ${delay} ms`) });
    write(`Berhasil memuat todo: "${toIndo(todo.title)}"`);
    write(`  [Asli API: "${todo.title}"]`);
  } catch (error) {
    write(`Menyerah setelah semua percobaan: ${error.message}`);
  }
};

// Latihan 4: handler global untuk promise yang tidak punya catch
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  const banner = $('global-error');
  banner.hidden = false;
  banner.textContent = `Error async tak tertangani ditangkap: ${event.reason?.message ?? event.reason}`;
});

// Latihan 5: pagination dengan async/await
const pager = { page: 1, limit: 5, total: 100 };
const fetchPosts = async (page, limit) => {
  const res = await fetch(`${API}/posts?_page=${page}&_limit=${limit}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} dari jsonplaceholder`);
  return { items: await res.json(), total: Number(res.headers.get('x-total-count')) || pager.total };
};

const updatePager = () => {
  const lastPage = Math.ceil(pager.total / pager.limit);
  $('btn-prev').disabled = pager.page <= 1;
  $('btn-next').disabled = pager.page >= lastPage;
  $('page-label').textContent = `Halaman ${pager.page} dari ${lastPage}`;
};

const loadPage = async (page) => {
  await panels.page.run(() => fetchPosts(page, pager.limit), ({ items, total }) => {
    Object.assign(pager, { page, total });
    return `<ul class="paginated-list">${items.map(({ id, title }) => `
      <li>
        <span class="page-item-id">#${id}</span>
        <div class="page-item-content">
          <div class="translated-title">${escapeHTML(toIndo(title, id))}</div>
          <div class="api-raw-hint">Asli API: "${escapeHTML(title)}"</div>
        </div>
      </li>`).join('')}</ul>`;
  });
  updatePager();
};

// Latihan 6: debounced search dengan async API call
const debounce = (fn, wait = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
};

const stats = { keys: 0, requests: 0 };
const showStats = () => { $('search-stats').textContent = `Ketikan: ${stats.keys}, request terkirim: ${stats.requests}`; };
let controller;

const searchProducts = async (query) => {
  controller?.abort(); // batalkan request sebelumnya yang masih berjalan
  if (!query.trim()) { panels.search.cancel(); $('out-search').textContent = ''; return; }
  controller = new AbortController();
  stats.requests++;
  showStats();
  await panels.search.run(
    () => fetchJSON(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`, { signal: controller.signal }),
    ({ products, total }) => products.length
      ? `<p><strong>${total} produk cocok ditemukan:</strong></p><ul class="product-result-list">${products.map((p) => `
          <li>
            <div class="product-main-row">
              <span class="product-title">&#128230; ${escapeHTML(p.title)}</span>
              <span class="product-price">$${p.price}</span>
            </div>
            <div class="product-sub-row">
              <span class="product-category">Kategori: ${escapeHTML(p.category || 'Umum')}</span>
              ${p.brand ? `<span class="product-brand">&bull; Merek: ${escapeHTML(p.brand)}</span>` : ''}
              <div class="product-desc-id">&bull; ${escapeHTML(p.description)}</div>
            </div>
          </li>`).join('')}</ul>`
      : '<p>Tidak ada produk yang cocok. Coba kata kunci lain.</p>'
  );
};

const debouncedSearch = debounce(searchProducts, 400);

// Pasang event
$('btn-combine').addEventListener('click', () => panels.combine.run(fetchCombined, renderCombined));
$('btn-retry-ok').addEventListener('click', () => runRetryDemo(3));
$('btn-retry-fail').addEventListener('click', () => runRetryDemo(Infinity));
$('btn-loading').addEventListener('click', () => panels.loading.run(
  async () => { await sleep(1500); return fetchJSON(`${API}/posts/1`); },
  ({ title, body }) => `
    <div class="post-preview-card">
      <h3 class="post-headline">&#128221; ${escapeHTML(toIndo(title, 1))}</h3>
      <p class="post-body-id">${escapeHTML(toIndoBody())}</p>
      <div class="api-raw-box">
        <span class="raw-label">Data Asli Respons API JSONPlaceholder (Bahasa Latin):</span>
        <blockquote class="latin-quote">"${escapeHTML(title)}"</blockquote>
        <p class="latin-body">${escapeHTML(body)}</p>
      </div>
    </div>`
));
$('btn-error').addEventListener('click', () => panels.error.run(() => fetchJSON(`${API}/posts/99999`), () => ''));
$('btn-unhandled').addEventListener('click', () => { Promise.reject(new Error('Promise ini tidak punya catch')); });
$('btn-prev').addEventListener('click', () => loadPage(pager.page - 1));
$('btn-next').addEventListener('click', () => loadPage(pager.page + 1));
$('search').addEventListener('input', ({ target }) => { stats.keys++; showStats(); debouncedSearch(target.value); });
loadPage(1);
