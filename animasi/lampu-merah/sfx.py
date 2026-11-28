"""Efek suara sintetis untuk "Konser di Lampu Merah".

Pemakaian: python3 animasi/lampu-merah/sfx.py  -> WAV di animasi/lampu-merah/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")
rng = np.random.default_rng(11)


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


def pluck(freq, dur=2.2, bright=0.5, seed=0):
    """Senar gitar (Karplus-Strong)."""
    r = np.random.default_rng(seed)
    n = int(SR / freq)
    buf = r.uniform(-1, 1, n)
    buf = np.convolve(buf, [bright, 1 - bright], mode="same")
    out = np.empty(int(SR * dur))
    idx = 0
    for i in range(len(out)):
        v = buf[idx]
        nxt = buf[(idx + 1) % n]
        buf[idx] = 0.996 * 0.5 * (v + nxt)
        out[i] = v
        idx = (idx + 1) % n
    body = np.convolve(out, np.exp(-np.arange(60) / 12) * 0.08, mode="same")
    return out + body


# Petikan senar satu (E tinggi) dan senar dua (B), agak sumbang karena sedang disetem.
save("petik1", pluck(329.6 * 0.985, 2.0, seed=1), peak=0.7)
save("petik2", pluck(246.9 * 1.01, 2.0, seed=2), peak=0.7)

# Genjreng kunci G: enam senar berurutan cepat.
G = [98.0, 123.5, 146.8, 196.0, 246.9, 392.0]
def strum(freqs, dur=2.6, gap=0.012, seed=5):
    out = np.zeros(int(SR * dur))
    for k, f in enumerate(freqs):
        s = pluck(f, dur - k * gap, bright=0.45, seed=seed + k)
        i = int(SR * k * gap)
        out[i:i + len(s)] += s[: len(out) - i]
    return out
save("genjreng", strum(G), peak=0.85)
# Iringan pelan di bawah nyanyian "Kuuu" dan "Sayaaang" (C lalu Am).
C = [130.8, 164.8, 196.0, 261.6, 329.6]
Am = [110.0, 164.8, 220.0, 261.6, 329.6]
arp = np.zeros(int(SR * 3.2))
for k, f in enumerate(C + Am[::-1]):
    s = pluck(f, 2.0, bright=0.6, seed=20 + k) * 0.6
    i = int(SR * k * 0.28)
    arp[i:i + len(s)] += s[: len(arp) - i]
save("iringan", arp, peak=0.6)

# Klakson motor "tin! tin!": dua nada persegi yang diredam.
def horn(dur):
    t = secs(dur)
    sq = np.sign(np.sin(2 * np.pi * 415 * t)) + 0.6 * np.sign(np.sin(2 * np.pi * 523 * t))
    env = np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.02)
    return np.convolve(sq * env, np.ones(6) / 6, mode="same")
tin = np.zeros(int(SR * 0.62))
a, b = horn(0.2), horn(0.26)
tin[: len(a)] += a
tin[int(SR * 0.3): int(SR * 0.3) + len(b)] += b
save("tin-tin", tin, peak=0.55)

# Lampu sein: tik ... tok berulang (4 kali).
def tick(freq, seed):
    r = np.random.default_rng(seed)
    t = secs(0.03)
    return (r.standard_normal(len(t)) * 0.4 + np.sin(2 * np.pi * freq * t)) * np.exp(-t * 200)
sein = np.zeros(int(SR * 2.6))
for k in range(4):
    for off, f in [(0.0, 2400), (0.33, 1700)]:
        s = tick(f, k * 2 + int(off * 10))
        i = int(SR * (k * 0.66 + off))
        sein[i:i + len(s)] += s
save("sein", sein, peak=0.6)

# Motor lewat / jalan: dengung mesin dengan Doppler sederhana.
t = secs(3.0)
f0 = 38 + 10 * np.tanh((t - 1.5) * 2) * -1
phase = 2 * np.cumsum(np.pi * f0 / SR)
eng = np.sign(np.sin(phase)) * 0.5 + np.sin(2 * phase) * 0.4
eng = np.convolve(eng, np.ones(30) / 30, mode="same")
save("motor-jalan", eng * np.exp(-((t - 1.2) ** 2) / 0.9), peak=0.5)

# Suasana jalan sore: dengung lalu lintas jauh + kicau burung sesekali, 130 detik.
t = secs(130)
noise = rng.standard_normal(len(t))
far = np.convolve(noise, np.ones(220) / 220, mode="same") * 6
far *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.05 * t)
amb = far
for k in range(26):
    at = rng.uniform(0, 128)
    i = int(at * SR)
    tt = secs(0.18)
    chirp = np.sin(2 * np.pi * (2600 + 900 * np.sin(2 * np.pi * 14 * tt)) * tt) * np.exp(-tt * 18) * 0.08
    amb[i:i + len(tt)] += chirp
save("jalan", amb, peak=0.22)

print("SFX selesai di", OUT)
