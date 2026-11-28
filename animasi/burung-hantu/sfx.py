"""Efek suara pendek (bukan musik) untuk "Sawah Mbah Painem".

Pemakaian: python3 animasi/burung-hantu/sfx.py  -> WAV di animasi/burung-hantu/sfx/
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

# Lengking serak burung hantu: desis berdesir dengan nada tinggi turun.
t = secs(0.9)
hiss = rng.standard_normal(len(t)) - lowpass(rng.standard_normal(len(t)), 30)
tone = np.sin(2 * np.pi * np.cumsum(np.linspace(2600, 1900, len(t))) / SR)
save("lengking", (hiss * .8 + tone * .5) * (0.6 + .4 * np.sin(2 * np.pi * 18 * t)) * np.sin(np.pi * t / t[-1]) ** .6, 0.6)


def steps(count, gap):
    out = []
    for _ in range(count):
        d = secs(0.07)
        out += [np.sin(2 * np.pi * 90 * d) * np.exp(-d * 45) + 0.3 * lowpass(rng.standard_normal(len(d)), 8) * np.exp(-d * 60), np.zeros(int(SR * gap))]
    return np.concatenate(out)


save("langkah-cepat", steps(8, 0.12))

# Kepak sayap: dua hembusan lembut.
parts = []
for _ in range(3):
    d = secs(0.16)
    parts += [lowpass(rng.standard_normal(len(d)), 12) * np.sin(np.pi * d / d[-1]), np.zeros(int(SR * .1))]
save("kepak", np.concatenate(parts), 0.5)

# Ketuk palu kayu.
parts = []
for _ in range(3):
    d = secs(0.08)
    parts += [(np.sin(2 * np.pi * 420 * d) + .5 * rng.standard_normal(len(d))) * np.exp(-d * 60), np.zeros(int(SR * .25))]
save("ketuk", np.concatenate(parts), 0.5)

print("SFX selesai di", OUT)
