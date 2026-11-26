"""Efek suara pendek (bukan musik) untuk "300 Puyuh, Telurnya Nol".

Pemakaian: python3 animasi/puyuh/sfx.py  -> WAV di animasi/puyuh/sfx/
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


rng = np.random.default_rng(41)
noise = lambda d: rng.standard_normal(int(SR * d))

t = secs(0.8)
save("ting", (np.sin(2 * np.pi * 1760 * t) + .4 * np.sin(2 * np.pi * 3520 * t)) * np.exp(-t * 6), 0.6)

# Cicit puyuh: beberapa kicau pendek naik-turun.
parts = []
for k in range(5):
    t = secs(0.09)
    f = np.linspace(2600, 3400, len(t)) if k % 2 else np.linspace(3200, 2500, len(t))
    parts.append(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / t[-1]))
    parts.append(np.zeros(int(SR * (0.05 + rng.random() * .08))))
save("cicit", np.concatenate(parts), 0.4)

# Motor lewat.
t = secs(2.2)
eng = np.sign(np.sin(2 * np.pi * (55 + 25 * np.sin(np.pi * t / t[-1])) * t)) * .5 + lowpass(noise(2.2), 8)
save("motor", lowpass(eng, 6) * np.abs(np.sin(np.pi * t / t[-1])) ** 1.5, 0.5)

# Klakson.
t = secs(0.5)
save("klakson", (np.sign(np.sin(2 * np.pi * 400 * t)) + np.sign(np.sin(2 * np.pi * 500 * t))) * np.abs(np.sin(np.pi * t / t[-1])) ** .3, 0.35)

# Nada gagal.
t = secs(0.7)
f = np.where(t < .3, 392, 311)
save("gagal", np.sin(2 * np.pi * f * t) * np.exp(-((t % .3)) * 5) * .8, 0.4)

print("SFX selesai di", OUT)
