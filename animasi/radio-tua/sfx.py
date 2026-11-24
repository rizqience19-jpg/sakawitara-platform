"""Efek suara pendek (bukan musik) untuk "Radio Tua Mbah Kakung".

Pemakaian: python3 animasi/radio-tua/sfx.py  -> WAV di animasi/radio-tua/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")


def secs(d):
    return np.arange(int(SR * d)) / SR


def save(name, x, peak=0.8):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) or 1.0) * peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def tone_sweep(dur, f0, f1, harm=(1, .5, .3, .15)):
    t = secs(dur)
    f = np.linspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(a * np.sin(k * ph) for k, a in enumerate(harm, 1))


# Ayam berkokok: "ku-ku-ruu-yuuk" dari empat suku nada.
parts = [(0.12, 700, 900), (0.12, 760, 950), (0.35, 850, 1100), (0.6, 1050, 700)]
out = []
for d, a, b in parts:
    s = tone_sweep(d, a, b, (1, .7, .5, .3, .2)) * np.sin(np.pi * secs(d) / d) ** .6
    out += [s, np.zeros(int(SR * .03))]
kok = np.concatenate(out)
save("kokok", np.convolve(kok, np.ones(4) / 4, mode="same"), 0.6)

# Ting: lonceng kecil untuk label larangan.
t = secs(0.9)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t) + .2 * np.sin(2 * np.pi * 4890 * t)) * np.exp(-t * 6), 0.6)

rng = np.random.default_rng(11)


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


# Cicit tikus: tiga cicitan tinggi pendek.
parts = []
for f in (3200, 3500, 3000):
    d = secs(0.07)
    parts += [np.sin(2 * np.pi * (f + 900 * d / d[-1]) * d) * np.sin(np.pi * d / d[-1]), np.zeros(int(SR * .06))]
save("cicit", np.concatenate(parts), 0.5)

# Jangkrik: denyut nada tinggi berulang.
t = secs(1.6)
save("jangkrik", np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 30 * t) > .3) * (np.sin(2 * np.pi * 2.2 * t) > -.2), 0.4)

# Meong pendek.
t = secs(0.6)
f = 600 + 300 * np.sin(np.pi * t / t[-1])
save("meong", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / t[-1]) * (1 + .3 * np.sin(2 * np.pi * 2 * f / 600 * t)), 0.4)

# Klontang: ember logam jatuh.
t = secs(0.8)
clang = sum(np.sin(2 * np.pi * fr * t) * np.exp(-t * d) for fr, d in ((520, 6), (1310, 9), (2270, 12), (3100, 15)))
save("klontang", clang + .4 * rng.standard_normal(len(t)) * np.exp(-t * 30), 0.6)

# Boing: pantulan bola karet.
t = secs(0.45)
save("boing", np.sin(2 * np.pi * np.cumsum(np.linspace(180, 420, len(t))) / SR) * np.exp(-t * 5) * (1 + .4 * np.sin(2 * np.pi * 14 * t)), 0.5)

# Bel sekolah: kring pendek.
t = secs(0.7)
save("kring", np.sin(2 * np.pi * 2400 * t) * (np.sin(2 * np.pi * 22 * t) > 0) * np.exp(-t * 2), 0.4)

# Klakson bus jauh.
t = secs(0.6)
save("klakson", (np.sign(np.sin(2 * np.pi * 330 * t)) + np.sign(np.sin(2 * np.pi * 415 * t))) * np.sin(np.pi * t / t[-1]) ** .3, 0.4)

# Gemerisik kertas/amplop.
t = secs(0.5)
save("kertas", (rng.standard_normal(len(t)) - lowpass(rng.standard_normal(len(t)), 6)) * (0.4 + .6 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * t / t[-1]), 0.5)

# Dentum rendah untuk "Bersambung".
t = secs(1.2)
save("dum", (np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 82 * t)) * np.exp(-t * 3), 0.7)

# Ketukan pintu kayu.
parts = []
for _ in range(3):
    d = secs(0.08)
    parts += [(np.sin(2 * np.pi * 180 * d) + .4 * rng.standard_normal(len(d))) * np.exp(-d * 50), np.zeros(int(SR * .22))]
save("ketuk", np.concatenate(parts), 0.5)

# Kresek radio: desis dengan putus-putus.
t = secs(1.2)
save("kresek", (rng.standard_normal(len(t)) - lowpass(rng.standard_normal(len(t)), 4)) * (0.5 + .5 * (np.sin(2 * np.pi * 9 * t) > -.3)) * np.sin(np.pi * t / t[-1]) ** .4, 0.4)

# Hujan ringan.
t = secs(3.0)
save("hujan", lowpass(rng.standard_normal(len(t)), 3) * (0.8 + .2 * np.sin(2 * np.pi * .7 * t)) * np.sin(np.pi * t / t[-1]) ** .5, 0.4)

print("SFX selesai di", OUT)
