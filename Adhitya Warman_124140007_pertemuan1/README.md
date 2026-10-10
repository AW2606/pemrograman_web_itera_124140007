# TechMart POS – Mini POS (Kasir & Keranjang Belanja)

## Identitas

- **Nama Lengkap :** _Adhitya Warman_
- **NIM :** _124140007_
- **Kelas Praktikum :** _RA_

## Deskripsi Aplikasi

**TechMart POS** adalah aplikasi kasir mini bertema teknologi (gaya terminal neon) untuk toko aksesori gadget / kantin kampus. Kasir bisa menambah barang, melihat total dan diskon otomatis, menghitung kembalian, dan keranjang tetap tersimpan di `localStorage` walau halaman di-refresh.

**Studi kasus:** kasir toko aksesori teknologi di kampus.

## Panduan Menjalankan

1. Unduh atau clone repository.
2. Buka folder `Adhitya Warman_124140007_pertemuan1` di VS Code.
3. Jalankan **Live Server** pada `index.html` (atau buka langsung di browser).
4. Latihan materi ada di `modul/index.html`.

## Struktur Folder

```
Adhitya Warman_124140007_pertemuan1/
├── index.html
├── style.css
├── script.js
├── README.md
└── modul/
    ├── index.html
    └── latihan.js
```

## Daftar Fitur

- [x] Validasi nama barang (wajib, minimal 3 karakter)
- [x] Validasi harga satuan (angka, minimal Rp 500)
- [x] Validasi qty (bilangan bulat, minimal 1)
- [x] Pesan error merah di bawah input; barang tidak masuk keranjang jika tidak valid
- [x] Form otomatis di-reset setelah berhasil
- [x] Subtotal per barang (harga × qty)
- [x] Total belanja otomatis
- [x] Diskon 10% otomatis jika total ≥ Rp 50.000
- [x] Input uang bayar, kembalian otomatis, dan pesan jika uang kurang
- [x] Tabel keranjang (No, Nama Barang, Harga Satuan, Qty, Subtotal, Aksi)
- [x] Tombol Hapus per item dengan hitung ulang otomatis
- [x] Penyimpanan localStorage (`JSON.stringify` / `JSON.parse`)
- [x] Tombol Transaksi Baru / Reset
- [x] Format Rupiah dan tampilan responsif

## Tangkapan Layar

> Ganti dengan screenshot sendiri (minimal 3).

1. Form input utama <br>
   ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/f72cd748eeac086fded9957cffa4d23ca6cadb21/DOKUM/PAW/praktikum1/Input.png)
2. Validasi error <br>
   ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/f72cd748eeac086fded9957cffa4d23ca6cadb21/DOKUM/PAW/praktikum1/Eror.png)
3. Hasil perhitungan & tabel <br>
   ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/f72cd748eeac086fded9957cffa4d23ca6cadb21/DOKUM/PAW/praktikum1/Perhitungan.png)

## Penjelasan Teknis Singkat

**Arsitektur.** Seluruh kode dibungkus IIFE dengan satu objek `state`. Perubahan data hanya lewat fungsi `dispatch({ type })` (`ADD`, `REMOVE`, `CLEAR`), yang kemudian menyimpan ke localStorage dan memanggil `render()`.

**Validasi.** Fungsi murni `validate()` memeriksa nama (≥ 3 karakter), harga (≥ 500), dan qty (bilangan bulat ≥ 1), lalu mengembalikan objek galat. Pesan merah ditampilkan di bawah input yang salah dan barang tidak ditambahkan jika ada galat.

**Kalkulator.** Fungsi murni `hitung()` menjumlahkan harga × qty dengan `reduce()`, memberi diskon 10% jika total ≥ 50.000, lalu menghasilkan total akhir. Kembalian = uang bayar − total akhir; jika negatif tampil pesan uang belum mencukupi.

**localStorage.** `save()` memakai `JSON.stringify(state)`, `load()` memakai `JSON.parse()` dalam `try/catch`. Tombol hapus memakai event delegation lewat atribut `data-id`. Reset memanggil `localStorage.removeItem()`.
