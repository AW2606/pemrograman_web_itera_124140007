data_mahasiswa = [
    {"nama": "Andi Pratama", "nim": "124140001",
     "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Siti Rahma", "nim": "124140002",
     "nilai_uts": 75, "nilai_uas": 72, "nilai_tugas": 80},
    {"nama": "Budi Santoso", "nim": "124140003",
     "nilai_uts": 65, "nilai_uas": 62, "nilai_tugas": 70},
    {"nama": "Dewi Lestari", "nim": "124140004",
     "nilai_uts": 55, "nilai_uas": 58, "nilai_tugas": 60},
    {"nama": "Rian Hidayat", "nim": "124140005",
     "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 50},
]


def hitung_nilai_akhir(uts, uas, tugas):
    """Menghitung nilai akhir mahasiswa.

    Parameter:
        uts: nilai UTS (bobot 30%)
        uas: nilai UAS (bobot 40%)
        tugas: nilai tugas (bobot 30%)

    Mengembalikan:
        nilai akhir dalam bentuk angka desimal
    """
    return 0.3 * uts + 0.4 * uas + 0.3 * tugas


def tentukan_grade(nilai_akhir):
    """Menentukan grade berdasarkan nilai akhir.

    Parameter:
        nilai_akhir: nilai akhir mahasiswa

    Mengembalikan:
        huruf grade (A, B, C, D, atau E)
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


for mhs in data_mahasiswa:
    mhs["nilai_akhir"] = hitung_nilai_akhir(
        mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
    )
    mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])

print("DAFTAR NILAI MAHASISWA")
print("-" * 55)
print(f"{'No':<4}{'Nama':<16}{'NIM':<12}{'Nilai Akhir':<14}{'Grade'}")
print("-" * 55)

nomor = 1
for mhs in data_mahasiswa:
    print(f"{nomor:<4}{mhs['nama']:<16}{mhs['nim']:<12}"
          f"{mhs['nilai_akhir']:<14.2f}{mhs['grade']}")
    nomor += 1
print("-" * 55)

tertinggi = data_mahasiswa[0]
terendah = data_mahasiswa[0]

for mhs in data_mahasiswa:
    if mhs["nilai_akhir"] > tertinggi["nilai_akhir"]:
        tertinggi = mhs
    if mhs["nilai_akhir"] < terendah["nilai_akhir"]:
        terendah = mhs

print(f"Nilai tertinggi: {tertinggi['nama']} "
      f"({tertinggi['nilai_akhir']:.2f})")
print(f"Nilai terendah : {terendah['nama']} "
      f"({terendah['nilai_akhir']:.2f})")
