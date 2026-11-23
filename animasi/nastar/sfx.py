"""Efek suara sintetis untuk "Nastar Masih Disegel" (versi video gaya Mbah Darmi).

Pemakaian: python3 animasi/nastar/sfx.py  -> WAV di animasi/nastar/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")
rng = np.random.default_rng(33)


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


def hp(x, k=6):
    """Saring tinggi sederhana: sinyal dikurangi rata-ratanya."""
    return x - np.convolve(x, np.ones(k) / k, mode="same")


def bandnoise(dur, smooth_hi=4, smooth_lo=1):
    n = rng.standard_normal(int(SR * dur))
    return hp(np.convolve(n, np.ones(smooth_lo) / smooth_lo, mode="same"), smooth_hi)


# Kuku menggesek pinggiran toples: rentetan gesekan pendek bernada tinggi.
out = np.zeros(int(SR * 1.2))
for k in range(9):
    tt = secs(0.09)
    g = bandnoise(0.09, 3) * np.sin(np.pi * tt / 0.09) * (0.7 + 0.3 * rng.random())
    i = int(k * 0.12 * SR)
    out[i:i + len(g)] += g
save("gesek", out, 0.55)

# Tutup diputar tapi tertahan: derit plastik.
t = secs(0.7)
creak = np.sign(np.sin(2 * np.pi * (90 + 40 * np.sin(2 * np.pi * 3 * t)) * t)) * 0.4
creak += bandnoise(0.7, 8, 3) * 0.6
save("derit", creak * np.sin(np.pi * t / 0.7), 0.5)

# Ujung selotip terangkat: "tik" kecil.
t = secs(0.06)
save("tik", (rng.standard_normal(len(t)) * 0.5 + np.sin(2 * np.pi * 2600 * t)) * np.exp(-t * 90), 0.55)

# Selotip ditarik pelan: desis lengket yang makin keras.
t = secs(2.6)
pull = bandnoise(2.6, 5) * (np.linspace(0.1, 1, len(t)) ** 1.5) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 7 * t)))
save("tarik-pelan", pull, 0.45)

# Sobek: robekan singkat.
t = secs(0.22)
save("sobek", bandnoise(0.22, 3) * np.exp(-t * 18), 0.7)

# Kreeeek panjang: selotip ditarik memutar (berderak-derak).
t = secs(3.5)
crackle = bandnoise(3.5, 4) * 0.5
for k in range(140):
    i = int(rng.uniform(0, 3.45) * SR)
    tt = secs(0.012)
    crackle[i:i + len(tt)] += rng.standard_normal(len(tt)) * np.exp(-tt * 300) * 1.4
env = np.minimum(1, t / 0.2) * np.minimum(1, (3.5 - t) / 0.3)
save("kreek", crackle * env, 0.55)

# Diremas: kresek plastik beruntun.
out = np.zeros(int(SR * 1.0))
for k in range(10):
    tt = secs(0.06)
    g = bandnoise(0.06, 3) * np.exp(-tt * 40)
    i = int(rng.uniform(0, 0.92) * SR)
    out[i:i + len(g)] += g
save("remas", out, 0.55)

# Toples / bola diletakkan di meja: "tuk".
t = secs(0.25)
tuk = np.sin(2 * np.pi * (180 - 200 * t) * t) * np.exp(-t * 30) + bandnoise(0.25, 3) * np.exp(-t * 80) * 0.4
save("taruh", tuk, 0.6)

print("SFX selesai di", OUT)
