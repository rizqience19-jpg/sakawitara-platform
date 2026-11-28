"""Efek suara pendek (bukan musik) untuk "Enam Kali Gagal Budidaya Jamur Tiram".

Pemakaian: python3 animasi/jamur-tiram/sfx.py  -> WAV di animasi/jamur-tiram/sfx/
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


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


rng = np.random.default_rng(21)
noise = lambda d: rng.standard_normal(int(SR * d))

t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)

# Semprotan kabut: desis pendek berulang.
t = secs(1.2)
save("semprot", (noise(1.2) - lowpass(noise(1.2), 3)) * ((t % .4) < .25) * np.abs(np.sin(np.pi * t / t[-1])) ** .3, 0.4)

# Siraman gayung.
t = secs(1.0)
save("siram", lowpass(noise(1.0), 6) * np.abs(np.sin(np.pi * t / t[-1])) ** .5, 0.5)

# Angin.
t = secs(2.0)
save("angin", lowpass(noise(2.0), 60) * (0.6 + .4 * np.sin(2 * np.pi * .8 * t)) * np.sin(np.pi * t / t[-1]), 0.5)

# Desis uap.
t = secs(1.4)
save("desis", (noise(1.4) - lowpass(noise(1.4), 3)) * np.abs(np.sin(np.pi * t / t[-1])) ** .5, 0.35)

# Nada gagal: dua nada turun pelan.
t = secs(0.7)
f = np.where(t < .3, 392, 311)
save("gagal", np.sin(2 * np.pi * f * t) * np.exp(-((t % .3)) * 5) * .8, 0.4)

print("SFX selesai di", OUT)
