# Tugas Praktikum Pertemuan 4: Python Dasar

Nama : Adhitya Warman
NIM  : 124140007

## Cara Menjalankan
Buka terminal di folder ini, lalu jalankan:

```
python tugas1_bmi.py
python tugas2_nilai_mahasiswa.py
python main.py
```

## Penjelasan Program

### Soal 1: Penghitung BMI (`tugas1_bmi.py`)
Program meminta berat badan (kg) dan tinggi badan (m), lalu menghitung BMI dengan rumus berat / (tinggi * tinggi). Kategori ditentukan dengan if-elif-else:
- BMI kurang dari 18.5: Berat badan kurang
- 18.5 sampai kurang dari 25: Berat badan normal
- 25 sampai kurang dari 30: Berat badan berlebih
- 30 ke atas: Obesitas

### Soal 2: Data Nilai Mahasiswa (`tugas2_nilai_mahasiswa.py`)
Data 5 mahasiswa disimpan dalam list berisi dictionary. Nilai akhir dihitung dengan rumus 30% UTS + 40% UAS + 30% Tugas, lalu grade A sampai E ditentukan dari nilai akhir. Hasilnya ditampilkan dalam bentuk tabel, beserta mahasiswa dengan nilai tertinggi dan terendah.

### Soal 3: Modul Matematika (`math_operations.py` dan `main.py`)
`math_operations.py` berisi konstanta PI, fungsi luas dan keliling untuk persegi, persegi panjang, dan lingkaran, serta fungsi konversi suhu Celsius ke Fahrenheit dan Kelvin. `main.py` mengimpor modul tersebut dengan dua cara (`import math_operations` dan `from math_operations import ...`) lalu memakai semua fungsinya.

## Screenshot Hasil Program
- ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/7beb33ef88133aca02ae68caec3f4eebeed1d9f3/DOKUM/PAW/praktikum4/1.png)
- ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/7beb33ef88133aca02ae68caec3f4eebeed1d9f3/DOKUM/PAW/praktikum4/2.png)
- ![Image Alt](https://github.com/AW2606/fotodokumtugas/blob/7beb33ef88133aca02ae68caec3f4eebeed1d9f3/DOKUM/PAW/praktikum4/3.png)
