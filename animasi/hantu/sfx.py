"""Membuat efek suara episode "Hantu Kena Sensor" secara sintetis (tanpa sampel luar).

Pemakaian: python3 animasi/hantu/sfx.py  -> menulis WAV ke animasi/hantu/sfx/
"""
import os
import wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "sfx")
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def lowpass(x, a):
    """Filter satu kutub sederhana; a mendekati 1 = lebih redup."""
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = a * acc + (1 - a) * v
        y[i] = acc
    return y


def bell(freq, dur, decay):
    tt = t(dur)
    env = np.exp(-tt * decay) * np.minimum(1, tt / 0.004)
    partials = [(1, 1.0), (2.0, 0.42), (2.76, 0.22), (5.4, 0.08)]
    return env * sum(a * np.sin(2 * np.pi * freq * k * tt) for k, a in partials)


# Ting-tong: dua nada bel interkom (tinggi lalu rendah).
ting = bell(988, 1.1, 3.2)
tong = bell(784, 1.6, 2.4)
gap = int(SR * 0.42)
tt_mix = np.zeros(gap + len(tong))
tt_mix[: len(ting)] += ting
tt_mix[gap : gap + len(tong)] += tong
save("ting-tong", tt_mix)

# Langkah kaki: hentakan tumit (noise rendah) + gesekan sepatu.
def step(seed):
    r = np.random.default_rng(seed)
    tt = t(0.22)
    thump = np.sin(2 * np.pi * (95 + 30 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 38)
    scuff = lowpass(r.standard_normal(len(tt)), 0.86) * np.exp(-tt * 55) * 0.5
    return thump + scuff

for i in range(4):
    save(f"step{i}", step(10 + i), peak=0.7)

# Klik senter: dua klik mekanis rapat.
def click(freq=3200, dur=0.03, seed=3):
    r = np.random.default_rng(seed)
    tt = t(dur)
    return (r.standard_normal(len(tt)) * 0.6 + np.sin(2 * np.pi * freq * tt)) * np.exp(-tt * 260)

ck = np.zeros(int(SR * 0.12))
c1, c2 = click(2600), click(3600, seed=5)
ck[: len(c1)] += c1
ck[int(SR * 0.045) : int(SR * 0.045) + len(c2)] += c2 * 0.8
save("klik", ck, peak=0.85)

# "Tik": taring plastik jatuh ke lantai, ada pantulan kecil.
tk = np.zeros(int(SR * 0.4))
for off, g in [(0, 1.0), (0.09, 0.45), (0.15, 0.2)]:
    s = click(5200, 0.025, seed=int(off * 100) + 9) * g
    i = int(SR * off)
    tk[i : i + len(s)] += s
save("tik", tk, peak=0.8)

# Lampu menyala: relay "klak" + dengung neon singkat.
tt = t(0.6)
clunk = click(1400, 0.05, seed=21) * 1.2
buzz = (np.sin(2 * np.pi * 100 * tt) + 0.5 * np.sin(2 * np.pi * 200 * tt)) * np.exp(-tt * 5) * 0.25
lamp_on = buzz.copy()
lamp_on[: len(clunk)] += clunk
save("lampu-nyala", lamp_on, peak=0.7)

# Lampu mati: relay lebih pelan.
save("lampu-mati", click(1100, 0.05, seed=31), peak=0.5)

# Tombol ditekan: "cetek" plastik.
save("tombol", click(1900, 0.04, seed=41), peak=0.7)

# Hantu mendarat setelah lompat: "puk" lembut.
tt = t(0.18)
save("puk", np.sin(2 * np.pi * (180 - 300 * tt) * tt) * np.exp(-tt * 30), peak=0.5)

# Nada dengung ruangan (AC/hum + desis halus), 36 detik.
tt = t(36)
hum = 0.5 * np.sin(2 * np.pi * 50 * tt) + 0.25 * np.sin(2 * np.pi * 100 * tt)
air = lowpass(rng.standard_normal(len(tt)), 0.97) * 3.0
save("ruangan", (hum * 0.25 + air) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.07 * tt)), peak=0.25)

# Sengatan seram lembut untuk awal (nada rendah bergetar).
tt = t(6)
drone = sum(np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.4 * tt)) for f in (55, 82.4, 110.5))
save("seram", drone * np.minimum(1, tt / 2) * np.minimum(1, (6 - tt) / 1.5), peak=0.35)

print("SFX selesai di", OUT)
