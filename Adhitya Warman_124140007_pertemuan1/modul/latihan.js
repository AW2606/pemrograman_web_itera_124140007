// Latihan praktikum Pertemuan 1 - JavaScript Dasar
const hasil = document.getElementById("hasil");

function tampil(judul, isi) {
  hasil.insertAdjacentHTML("beforeend", "<h2>" + judul + "</h2><pre>" + isi + "</pre>");
  console.log(judul + "\n" + isi);
}

// 1. Data diri (const & let)
const namaSaya = "Nama Kalian";
let umurSaya = 20;
const kotaAsal = "Bandar Lampung";
tampil("1. Data Diri", "Nama: " + namaSaya + "\nUmur: " + umurSaya + "\nKota: " + kotaAsal);

// 2. Kelulusan (nilai >= 70)
const nilaiUjian = 72;
tampil("2. Kelulusan", "Nilai " + nilaiUjian + " -> " + (nilaiUjian >= 70 ? "LULUS" : "TIDAK LULUS"));

// 3. Kategori umur
function kategoriUmur(umur) {
  if (umur < 12) return "Anak";
  if (umur <= 17) return "Remaja";
  if (umur <= 59) return "Dewasa";
  return "Lansia";
}
tampil("3. Kategori Umur", [8, 15, 30, 65].map(function (u) { return u + " tahun -> " + kategoriUmur(u); }).join("\n"));

// 4. Switch-case angka hari -> nama hari (Inggris)
function namaHariInggris(angka) {
  switch (angka) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Invalid day";
  }
}
tampil("4. Hari (Inggris)", [1, 3, 7, 9].map(function (n) { return n + " -> " + namaHariInggris(n); }).join("\n"));

// 5. Grade dengan ternary
function gradeTernary(n) {
  return n >= 90 ? "A" : n >= 80 ? "B" : n >= 70 ? "C" : n >= 60 ? "D" : "E";
}
tampil("5. Grade (ternary)", [95, 85, 72, 65, 40].map(function (n) { return n + " -> " + gradeTernary(n); }).join("\n"));

// 6. Tabel perkalian
let tabel = "";
const angkaPilihan = 8;
for (let i = 1; i <= 10; i++) {
  tabel += angkaPilihan + " x " + i + " = " + angkaPilihan * i + "\n";
}
tampil("6. Tabel Perkalian " + angkaPilihan, tabel);

// 7. Faktorial
function faktorial(n) {
  let hasilFaktorial = 1;
  for (let i = 2; i <= n; i++) hasilFaktorial *= i;
  return hasilFaktorial;
}
tampil("7. Faktorial", [0, 5, 10].map(function (n) { return n + "! = " + faktorial(n); }).join("\n"));

// 8. Bilangan prima
function cekPrima(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
tampil("8. Bilangan Prima", [1, 2, 9, 13, 97].map(function (n) { return n + " -> " + (cekPrima(n) ? "prima" : "bukan prima"); }).join("\n"));

// 9. BMI (fungsi + event handler)
function hitungBMI(beratKg, tinggiCm) {
  const tinggiM = tinggiCm / 100;
  return beratKg / (tinggiM * tinggiM);
}
function kategoriBMI(bmi) {
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Gemuk";
  return "Obesitas";
}
document.getElementById("btn-bmi").addEventListener("click", function () {
  const berat = parseFloat(document.getElementById("berat").value);
  const tinggi = parseFloat(document.getElementById("tinggi").value);
  const out = document.getElementById("hasil-bmi");
  if (isNaN(berat) || isNaN(tinggi) || berat <= 0 || tinggi <= 0) {
    out.textContent = "Masukkan berat dan tinggi yang valid!";
    return;
  }
  const bmi = hitungBMI(berat, tinggi);
  out.textContent = "BMI: " + bmi.toFixed(1) + " (" + kategoriBMI(bmi) + ")";
});

// 10. FizzBuzz
let fb = [];
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) fb.push("FizzBuzz");
  else if (i % 3 === 0) fb.push("Fizz");
  else if (i % 5 === 0) fb.push("Buzz");
  else fb.push(i);
}
tampil("10. FizzBuzz 1-100", fb.join(", "));
