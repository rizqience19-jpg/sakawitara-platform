"""Efek suara pendek & pelan (bukan musik) untuk "Rumah Kosong Keluarga Hardjo".

Pemakaian: python3 animasi/rumah-kosong/sfx.py  -> WAV di animasi/rumah-kosong/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")
rng = np.random.default_rng(7)


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


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


# Angin malam: desis berfilter yang naik-turun pelan.
t = secs(2.4)
n = lowpass(lowpass(rng.standard_normal(len(t)), 40), 40)
env = np.sin(np.pi * t / t[-1]) ** 1.5 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.8 * t))
save("angin", n * env)

# Derit pintu: gesekan bernada naik-turun dengan getaran kasar.
t = secs(1.1)
f = 320 + 140 * np.sin(2 * np.pi * 1.3 * t) + 60 * t
ph = 2 * np.pi * np.cumsum(f) / SR
buzz = np.sign(np.sin(ph)) * 0.4 + np.sin(ph) + 0.4 * np.sin(2 * ph)
grain = 0.6 + 0.4 * (np.sin(2 * np.pi * 38 * t) > 0)
save("derit", lowpass(buzz * grain, 6) * np.sin(np.pi * t / t[-1]) ** .7)


def steps(count, gap):
    out = []
    for _ in range(count):
        d = secs(0.07)
        thump = np.sin(2 * np.pi * 90 * d) * np.exp(-d * 45) + 0.3 * lowpass(rng.standard_normal(len(d)), 8) * np.exp(-d * 60)
        out += [thump, np.zeros(int(SR * gap))]
    return np.concatenate(out)


save("langkah", steps(4, 0.38))
save("langkah-cepat", steps(8, 0.12))

# Klik senter mati.
t = secs(0.05)
save("klik", rng.standard_normal(len(t)) * np.exp(-t * 180))

# Dentum rendah pendek untuk "Empat."
t = secs(0.9)
save("dum", (np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 82 * t)) * np.exp(-t * 4))
