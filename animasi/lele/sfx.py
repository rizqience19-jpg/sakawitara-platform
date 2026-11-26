"""Efek suara pendek (bukan musik) untuk "Lele Aldi Hilang Satu per Satu".

Pemakaian: python3 animasi/lele/sfx.py  -> WAV di animasi/lele/sfx/
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


rng = np.random.default_rng(31)
noise = lambda d: rng.standard_normal(int(SR * d))
env = lambda t: np.abs(np.sin(np.pi * t / t[-1]))

t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)

# Cipratan air.
t = secs(0.7)
save("ciprat", (noise(.7) - lowpass(noise(.7), 4)) * np.exp(-t * 7) + .4 * lowpass(noise(.7), 10) * np.exp(-t * 4), 0.5)

# Hujan.
t = secs(2.5)
save("hujan", lowpass(noise(2.5), 3) * (0.8 + .2 * np.sin(2 * np.pi * .7 * t)) * env(t) ** .3, 0.4)

# Klik senter.
t = secs(0.1)
save("klik", noise(.1) * np.exp(-t * 90) + np.sin(2 * np.pi * 2200 * t) * np.exp(-t * 60), 0.7)

# Nada gagal.
t = secs(0.7)
f = np.where(t < .3, 392, 311)
save("gagal", np.sin(2 * np.pi * f * t) * np.exp(-((t % .3)) * 5) * .8, 0.4)

print("SFX selesai di", OUT)
