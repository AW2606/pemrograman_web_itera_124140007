# Bitlog

Dashboard pribadi untuk mahasiswa Informatika. Bitlog mencatat tugas kuliah beserta tenggatnya, lalu menampilkan cuaca kampus ITERA dan satu kutipan harian di sampingnya.

## Fitur aplikasi
- Tambah, ubah, hapus, dan tandai selesai pada tugas (per mata kuliah, dengan tenggat).
- Filter tugas: semua, belum selesai, selesai. Ada penanda "Lewat tenggat" dan bar progres.
- Data tersimpan di `localStorage` sehingga tidak hilang saat halaman ditutup.
- Cuaca real-time ITERA (Open-Meteo), kutipan acak (DummyJSON), dan 5 tugas contoh saat pertama kali dibuka (JSONPlaceholder).
- Jam dan tanggal berjalan, mengikuti mode terang/gelap perangkat.

## Cara menjalankan
Buka `index.html` di browser. Tidak perlu instalasi dan tidak perlu API key.

## Screenshot
![Image Alt]()

## Fitur ES6+ (file `app.js`)
| Fitur | Baris |
|---|---|
| `const` untuk nilai tetap (konstanta, referensi) | 2, 3, 8, 12, 150, 151 |
| `let` untuk nilai yang berubah | 152 |
| Arrow functions (lebih dari 3) | 12, 17, 18, 19, 35, 64, 108 |
| Template literals (pesan error, HTML dinamis) | 14, 19, 83, 88, 95, 153, 158 |
| Async/await + `fetch` | 12, 59, 69, 79, 91 |
| Class `TaskItem` (model data, getter `isLate`) | 21 |
| Class `DashboardApp` (state, localStorage, fetch) | 30 |
| Destructuring parameter dan objek | 22, 72, 82, 94, 123, 133 |
| Spread operator (state immutable) | 51, 53 |
| `map`, `filter`, `find`, `forEach` | 41, 53, 56, 133, 150, 156 |
| Default parameter | 22 |
| Nullish coalescing `??` | 85 |
