// Bitlog - dashboard tugas mahasiswa. PAW Pertemuan 2 (ES6+).
const STORAGE_KEY = 'bitlog.tasks.v1';
const API = {
  weather: 'https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true',
  quote: 'https://dummyjson.com/quotes/random',
  todos: 'https://jsonplaceholder.typicode.com/todos?_limit=5',
};
const WEATHER_CODES = { 0: 'Cerah', 1: 'Cerah berawan', 2: 'Berawan', 3: 'Mendung', 45: 'Berkabut',
  51: 'Gerimis', 61: 'Hujan ringan', 63: 'Hujan', 65: 'Hujan lebat', 80: 'Hujan lokal', 95: 'Badai petir' };

// Arrow functions kecil
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Permintaan gagal (${res.status})`);
  return res.json();
};
const today = () => new Date().toISOString().slice(0, 10);
const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const formatDue = (due) => new Date(`${due}T00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

class TaskItem {
  constructor({ id = crypto.randomUUID(), title, course = 'Umum', due = '', done = false }) {
    Object.assign(this, { id, title, course, due, done });
  }
  get isLate() {
    return !this.done && Boolean(this.due) && this.due < today();
  }
}

class DashboardApp {
  constructor() {
    this.tasks = this.load();
    this.filter = 'all';
    this.editingId = null;
    this.$ = (id) => document.getElementById(id);
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).map((d) => new TaskItem(d)) : null;
    } catch {
      return null;
    }
  }
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  // State immutable: selalu membuat array baru dengan spread/map/filter
  add(data) { this.tasks = [new TaskItem(data), ...this.tasks]; this.commit(); }
  update(id, changes) {
    this.tasks = this.tasks.map((t) => (t.id === id ? new TaskItem({ ...t, ...changes }) : t));
    this.commit();
  }
  remove(id) { this.tasks = this.tasks.filter((t) => t.id !== id); this.commit(); }
  commit() { this.save(); this.render(); }

  async init() {
    this.bindEvents();
    if (this.tasks === null) await this.seedFromAPI();
    this.render();
    this.tick();
    setInterval(() => this.tick(), 1000);
    this.loadWeather();
    this.loadQuote();
  }

  async seedFromAPI() {
    try {
      const todos = await fetchJSON(API.todos);
      const SAMPLE_TASKS = [
        'Menyelesaikan modul latihan praktikum PAW',
        'Mempersiapkan materi presentasi proyek akhir',
        'Review implementasi Fetch API dan async/await',
        'Mengerjakan tugas laporan pendahuluan pertemuan 2',
        'Pengujian error boundary dan responsiveness dashboard',
      ];
      const COURSES = ['PAW', 'PAM', 'IB', 'Jarkom', 'Sisfor'];
      this.tasks = todos.map(({ title, completed }, index) => new TaskItem({
        title: SAMPLE_TASKS[index] || title,
        done: completed,
        course: COURSES[index % COURSES.length],
        due: today(),
      }));
    } catch {
      this.tasks = [];
    }
    this.save();
  }

  async loadWeather() {
    const box = this.$('weather');
    try {
      const { current_weather: { temperature, windspeed, weathercode } } = await fetchJSON(API.weather);
      box.innerHTML = `
        <div class="temp">${Math.round(temperature)}&deg;C</div>
        <p>${WEATHER_CODES[weathercode] ?? 'Cuaca tidak dikenal'} di ITERA</p>
        <p>Angin ${windspeed} km/jam</p>`;
    } catch (err) {
      box.textContent = `Cuaca tidak bisa dimuat. ${err.message}. Muat ulang halaman untuk mencoba lagi.`;
    }
  }
  async loadQuote() {
    const box = this.$('quote');
    try {
      const { quote, author } = await fetchJSON(API.quote);
      box.innerHTML = `<p>${escapeHTML(quote)}</p><span class="by">${escapeHTML(author)}</span>`;
    } catch {
      box.textContent = 'Kutipan tidak bisa dimuat. Periksa koneksi internet Anda.';
    }
  }

  tick() {
    const now = new Date();
    this.$('clock').textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    this.$('date').textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  bindEvents() {
    this.$('task-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = { title: this.$('f-title').value.trim(), course: this.$('f-course').value, due: this.$('f-due').value };
      if (!data.title) return;
      this.editingId ? this.update(this.editingId, data) : this.add(data);
      this.stopEditing();
    });
    this.$('f-cancel').addEventListener('click', () => this.stopEditing());
    document.querySelectorAll('[data-filter]').forEach((btn) =>
      btn.addEventListener('click', () => {
        this.filter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        this.render();
      }));
    this.$('task-list').addEventListener('click', ({ target }) => {
      const { action, id } = target.dataset;
      if (action === 'delete') this.remove(id);
      if (action === 'edit') this.startEditing(id);
    });
    this.$('task-list').addEventListener('change', ({ target }) => {
      if (target.dataset.action === 'toggle') this.update(target.dataset.id, { done: target.checked });
    });
  }

  startEditing(id) {
    const { title, course, due } = this.tasks.find((t) => t.id === id);
    this.editingId = id;
    Object.assign(this.$('f-title'), { value: title });
    this.$('f-course').value = course;
    this.$('f-due').value = due;
    this.$('f-submit').textContent = 'Simpan perubahan';
    this.$('f-cancel').hidden = false;
    this.$('f-title').focus();
  }
  stopEditing() {
    this.editingId = null;
    this.$('task-form').reset();
    this.$('f-submit').textContent = 'Tambah tugas';
    this.$('f-cancel').hidden = true;
  }

  render() {
    const doneCount = this.tasks.filter((t) => t.done).length;
    const total = this.tasks.length;
    let summary = 'Belum ada tugas'; // let: nilainya berubah sesuai jumlah tugas
    if (total) summary = `${doneCount} dari ${total} tugas selesai`;
    this.$('summary').textContent = summary;
    this.$('progress').style.width = total ? `${(doneCount / total) * 100}%` : '0';

    const shown = this.tasks.filter((t) => this.filter === 'all' || (this.filter === 'done') === t.done);
    this.$('task-list').innerHTML = shown.length
      ? shown.map((t) => `
        <li class="task ${t.done ? 'done' : ''}">
          <input type="checkbox" data-action="toggle" data-id="${t.id}" ${t.done ? 'checked' : ''} aria-label="Tandai selesai: ${escapeHTML(t.title)}">
          <div>
            <div class="title">${escapeHTML(t.title)}</div>
            <div class="meta"><span class="badge-course">${escapeHTML(t.course)}</span>${t.due ? `<span class="due-text">&middot; Tenggat ${formatDue(t.due)}</span>` : ''}${t.isLate ? ' <span class="late">Lewat tenggat</span>' : ''}</div>
          </div>
          <div class="row-actions">
            <button type="button" data-action="edit" data-id="${t.id}">Ubah</button>
            <button type="button" data-action="delete" data-id="${t.id}">Hapus</button>
          </div>
        </li>`).join('')
      : '<li class="empty">Tidak ada tugas di sini. Tambahkan tugas lewat formulir di atas.</li>';
  }
}

new DashboardApp().init();
