"""Efek suara sintetis untuk "Nasinya Masih Muter".

Pemakaian: python3 animasi/hajatan/sfx.py  -> WAV di animasi/hajatan/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")
rng = np.random.default_rng(21)


def secs(d):
    return np.arange(int(SR * d)) / SR


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) or 1.0) * peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def smooth(x, n):
    return np.convolve(x, np.ones(n) / n, mode="same")


def engine(dur, f_start, f_end, rough=0.5):
    t = secs(dur)
    f = np.linspace(f_start, f_end, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sign(np.sin(ph)) * 0.5 + np.sin(2 * ph) * 0.35 + np.sin(0.5 * ph) * 0.4
    x += rng.standard_normal(len(t)) * rough * 0.3
    return smooth(x, 40)


# Rem: decit ban + mesin turun.
t = secs(1.6)
squeal = np.sin(2 * np.pi * (1850 + 120 * np.sin(2 * np.pi * 9 * t)) * t) * np.exp(-((t - 0.35) ** 2) / 0.08) * 0.5
save("rem", squeal + engine(1.6, 42, 24) * np.linspace(1, 0.4, len(t)), peak=0.7)

# Mesin pikap jalan pelan (untuk adegan menyetir / mundur), 4 detik.
e = engine(4.0, 30, 34)
save("mesin", e * np.minimum(1, secs(4.0) / 0.3) * np.minimum(1, (4.0 - secs(4.0)) / 0.5), peak=0.5)

# Musik hajatan samar: kendang + organ, 16 detik (diulang).
dur = 16.0
t = secs(dur)
mus = np.zeros(len(t))
beat = 60 / 112
for k in range(int(dur / beat * 2)):
    i = int(k * beat / 2 * SR)
    tt = secs(0.25)
    if k % 4 in (0, 3):
        hit = np.sin(2 * np.pi * (110 - 140 * tt) * tt) * np.exp(-tt * 18)
    else:
        hit = np.sin(2 * np.pi * (320 - 200 * tt) * tt) * np.exp(-tt * 30) * 0.6
    mus[i:i + len(tt)] += hit[: len(mus) - i]
melody = [392, 440, 494, 440, 392, 330, 294, 330, 392, 440, 392, 330]
for k, f in enumerate(melody * 2):
    i = int(k * beat * SR)
    tt = secs(beat * 0.95)
    note = (np.sign(np.sin(2 * np.pi * f * tt)) * 0.25 + np.sin(2 * np.pi * f * 2 * tt) * 0.2) * np.exp(-tt * 1.5)
    note = smooth(note, 8) * (1 + 0.15 * np.sin(2 * np.pi * 6 * tt))
    mus[i:i + len(tt)] += note[: len(mus) - i]
save("musik-hajatan", smooth(mus, 3), peak=0.5)

# Teng: sendok ke dasar wadah logam (dua kali).
def clang(seed):
    tt = secs(0.9)
    parts = [(1180, 1.0), (2470, 0.6), (3920, 0.35), (5310, 0.2)]
    return sum(a * np.sin(2 * np.pi * f * tt + seed) for f, a in parts) * np.exp(-tt * 5) * np.minimum(1, tt / 0.002)
teng = np.zeros(int(SR * 1.6))
for k, off in enumerate([0.0, 0.55]):
    c = clang(k)
    i = int(off * SR)
    teng[i:i + len(c)] += c[: len(teng) - i]
save("teng", teng, peak=0.7)

# Dering ponsel: nada melodi pendek, 3 kali.
ring = np.zeros(int(SR * 3.3))
notes = [1319, 1568, 1760, 1568]
for rep in range(3):
    for k, f in enumerate(notes):
        tt = secs(0.12)
        n = np.sin(2 * np.pi * f * tt) * np.minimum(1, tt / 0.005) * np.minimum(1, (0.12 - tt) / 0.01)
        i = int((rep * 1.1 + k * 0.13) * SR)
        ring[i:i + len(tt)] += n
save("dering", ring, peak=0.55)

# Terpal dibuka: desir kain plastik.
t = secs(0.9)
cloth = rng.standard_normal(len(t))
cloth = cloth - smooth(cloth, 6)
save("terpal", cloth * np.sin(np.pi * t / 0.9) ** 0.7 * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)), peak=0.5)

# Kursi plastik diangkat & ditumpuk: ketukan plastik cepat.
kursi = np.zeros(int(SR * 2.0))
for k in range(7):
    tt = secs(0.08)
    knock = (rng.standard_normal(len(tt)) * 0.5 + np.sin(2 * np.pi * (700 + k * 60) * tt)) * np.exp(-tt * 70)
    i = int((0.1 + k * 0.24 + rng.uniform(-0.04, 0.04)) * SR)
    kursi[i:i + len(tt)] += knock
save("kursi", kursi, peak=0.6)

# Gigi satu masuk: klek mekanis + mesin naik.
t = secs(1.8)
klek = np.zeros(len(t))
tt = secs(0.05)
k = (rng.standard_normal(len(tt)) * 0.6 + np.sin(2 * np.pi * 900 * tt)) * np.exp(-tt * 120)
klek[: len(k)] += k * 1.5
save("gigi", klek + engine(1.8, 26, 46) * np.minimum(1, t / 0.6) * 0.6, peak=0.6)

# Suasana desa: ayam jago jauh, burung, gumam tamu, 140 detik.
t = secs(140)
amb = smooth(rng.standard_normal(len(t)), 300) * 4
for k in range(30):
    at = rng.uniform(0, 138)
    i = int(at * SR)
    tt = secs(0.16)
    amb[i:i + len(tt)] += np.sin(2 * np.pi * (3000 + 800 * np.sin(2 * np.pi * 15 * tt)) * tt) * np.exp(-tt * 20) * 0.07
for at in (12, 70, 118):
    i = int(at * SR)
    tt = secs(1.4)
    f = 520 + 260 * np.sin(np.pi * tt / 1.4)
    crow = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-((tt - 0.7) ** 2) / 0.2) * 0.05
    amb[i:i + len(tt)] += smooth(crow, 12)
save("desa", amb, peak=0.2)

# Gumam tamu hajatan (untuk adegan di dalam tenda), 10 detik.
t = secs(10)
mur = np.zeros(len(t))
for k in range(12):
    f0 = rng.uniform(110, 220)
    env = np.clip(np.sin(2 * np.pi * rng.uniform(0.3, 0.8) * t + rng.uniform(0, 6)), 0, None)
    mur += np.sin(2 * np.pi * f0 * t + 3 * np.sin(2 * np.pi * rng.uniform(3, 6) * t)) * env
save("gumam", smooth(mur + rng.standard_normal(len(t)) * 0.3, 20), peak=0.3)

print("SFX selesai di", OUT)
