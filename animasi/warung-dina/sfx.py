"""Efek suara pendek (bukan musik) untuk "3 Aturan Aneh di Laci Agen BRILink".

Pemakaian: python3 animasi/warung-dina/sfx.py  -> WAV di animasi/warung-dina/sfx/
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


rng = np.random.default_rng(51)
noise = lambda d: rng.standard_normal(int(SR * d))

t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)
t = secs(1.2)
save("lonceng", sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in [(1320, 3), (1980, 4), (2640, 5)]), 0.5)
t = secs(0.35)
save("laci", noise(.35) * np.exp(-t * 14) * .6 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 20), 0.6)
t = secs(0.5)
save("notif", np.sin(2 * np.pi * 880 * t) * (t < .12) + np.sin(2 * np.pi * 1320 * t) * ((t > .15) & (t < .3)), 0.4)
t = secs(1.4)
save("dering", (np.sin(2 * np.pi * 880 * t) + np.sin(2 * np.pi * 1320 * t)) * (np.sin(2 * np.pi * 4 * t) > 0) * (t < 1.2), 0.35)
t = secs(0.7)
f = np.where(t < .3, 392, 311)
save("gagal", np.sin(2 * np.pi * f * t) * np.exp(-((t % .3)) * 5) * .8, 0.4)
print("SFX selesai di", OUT)
