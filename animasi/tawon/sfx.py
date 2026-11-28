"""Efek suara pendek (bukan musik) untuk "Saat Tawon Menyerang".

Pemakaian: python3 animasi/tawon/sfx.py  -> WAV di animasi/tawon/sfx/
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


rng = np.random.default_rng(7)

# Dengung tawon: gergaji ~220 Hz bergoyang, tipis, 1,6 detik, naik-turun.
t = secs(1.6)
f = 220 + 18 * np.sin(2 * np.pi * 7 * t) + 9 * rng.standard_normal(len(t)).cumsum() / 400
ph = 2 * np.pi * np.cumsum(f) / SR
buzz = (2 * ((ph / (2 * np.pi)) % 1) - 1) + .5 * np.sin(2 * ph * 1.01)
save("dengung", lowpass(buzz, 6) * np.sin(np.pi * t / t[-1]) ** .6, 0.5)

# Ting kartu bagian.
t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)

# Dering telepon.
t = secs(1.4)
save("dering", (np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1320 * t)) * (np.sin(2 * np.pi * 4 * t) > 0) * (t < 1.2), 0.35)

print("SFX selesai di", OUT)
