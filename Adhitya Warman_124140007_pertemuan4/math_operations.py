PI = 3.14159


def luas_persegi(sisi):
    """Menghitung luas persegi.

    Parameter:
        sisi: panjang sisi persegi

    Mengembalikan:
        luas persegi
    """
    return sisi * sisi


def keliling_persegi(sisi):
    """Menghitung keliling persegi.

    Parameter:
        sisi: panjang sisi persegi

    Mengembalikan:
        keliling persegi
    """
    return 4 * sisi


def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang.

    Parameter:
        panjang: panjang persegi panjang
        lebar: lebar persegi panjang

    Mengembalikan:
        luas persegi panjang
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang.

    Parameter:
        panjang: panjang persegi panjang
        lebar: lebar persegi panjang

    Mengembalikan:
        keliling persegi panjang
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran.

    Parameter:
        jari_jari: jari-jari lingkaran

    Mengembalikan:
        luas lingkaran
    """
    return PI * jari_jari * jari_jari


def keliling_lingkaran(jari_jari):
    """Menghitung keliling lingkaran.

    Parameter:
        jari_jari: jari-jari lingkaran

    Mengembalikan:
        keliling lingkaran
    """
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius):
    """Mengubah suhu Celsius ke Fahrenheit.

    Parameter:
        celsius: suhu dalam Celsius

    Mengembalikan:
        suhu dalam Fahrenheit
    """
    return celsius * 9 / 5 + 32


def celsius_ke_kelvin(celsius):
    """Mengubah suhu Celsius ke Kelvin.

    Parameter:
        celsius: suhu dalam Celsius

    Mengembalikan:
        suhu dalam Kelvin
    """
    return celsius + 273.15
