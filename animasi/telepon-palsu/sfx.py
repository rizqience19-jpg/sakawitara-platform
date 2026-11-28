"""Efek suara pendek (bukan musik) untuk "Telepon dari Nomor Asing".

Pemakaian: python3 animasi/telepon-palsu/sfx.py  -> WAV di animasi/telepon-palsu/sfx/
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


rng = np.random.default_rng(11)

t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)

t = secs(1.4)
save("dering", (np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1320 * t)) * (np.sin(2 * np.pi * 4 * t) > 0) * (t < 1.2), 0.35)

# Nada sambung telepon.
t = secs(1.0)
save("sambung", np.sin(2 * np.pi * 425 * t) * (t < .6), 0.3)

print("SFX selesai di", OUT)
