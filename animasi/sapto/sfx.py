"""Efek suara pendek (bukan musik) untuk "Sapto Belum Nikah-Nikah".

Pemakaian: python3 animasi/sapto/sfx.py  -> WAV di animasi/sapto/sfx/
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

# Wah-wah: dua nada turun (gagal/batal).
w1 = tone_sweep(0.35, 330, 300, (1, .6, .3)) * np.sin(np.pi * secs(0.35) / 0.35)
w2 = tone_sweep(0.7, 290, 220, (1, .6, .3)) * np.sin(np.pi * secs(0.7) / 0.7) * (1 + .15 * np.sin(2 * np.pi * 6 * secs(0.7)))
save("wawa", np.concatenate([w1, np.zeros(int(SR * .05)), w2]), 0.55)

# Jreng: genjreng gitar (Karplus-Strong) untuk momen "Ternyata...".
def pluck(freq, dur, seed):
    r = np.random.default_rng(seed)
    n = int(SR / freq)
    buf = r.uniform(-1, 1, n)
    out = np.empty(int(SR * dur))
    for i in range(len(out)):
        v = buf[i % n]
        buf[i % n] = 0.996 * 0.5 * (v + buf[(i + 1) % n])
        out[i] = v
    return out
j = np.zeros(int(SR * 2.0))
for k, f in enumerate([98, 123.5, 146.8, 196, 246.9, 392]):
    s = pluck(f, 2.0 - k * .012, 7 + k)
    i = int(SR * k * .012)
    j[i:i + len(s)] += s[:len(j) - i]
save("jreng", j, 0.7)

print("SFX selesai di", OUT)
