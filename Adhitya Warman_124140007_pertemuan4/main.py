import math_operations
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin

print("Nilai PI:", math_operations.PI)

print("\n=== PERSEGI ===")
for sisi in [4, 7]:
    print(f"Sisi {sisi}")
    print("Luas     :", math_operations.luas_persegi(sisi))
    print("Keliling :", math_operations.keliling_persegi(sisi))

print("\n=== PERSEGI PANJANG ===")
print("Panjang 10, lebar 5")
print("Luas     :", math_operations.luas_persegi_panjang(10, 5))
print("Keliling :", math_operations.keliling_persegi_panjang(10, 5))
print("Panjang 8, lebar 3")
print("Luas     :", math_operations.luas_persegi_panjang(8, 3))
print("Keliling :", math_operations.keliling_persegi_panjang(8, 3))

print("\n=== LINGKARAN ===")
for jari in [7, 10]:
    print(f"Jari-jari {jari}")
    print("Luas     :", math_operations.luas_lingkaran(jari))
    print("Keliling :", math_operations.keliling_lingkaran(jari))

print("\n=== KONVERSI SUHU ===")
for suhu in [0, 37, 100]:
    fahrenheit = celsius_ke_fahrenheit(suhu)
    kelvin = celsius_ke_kelvin(suhu)
    print(f"{suhu} C = {fahrenheit} F = {kelvin} K")
