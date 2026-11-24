"use client";

import { useEffect, useRef, useState } from "react";

/** Persegi panjang dengan sudut cekung (melengkung ke dalam), digambar sesuai ukuran asli
 *  supaya lengkung sudut tidak gepeng di layar sempit/lebar. */
function notchPath(w: number, h: number, i: number, r: number) {
  const a = (x: number, y: number) => `A ${r} ${r} 0 0 0 ${x} ${y}`;
  return [
    `M ${i + r} ${i}`,
    `H ${w - i - r}`,
    a(w - i, i + r),
    `V ${h - i - r}`,
    a(w - i - r, h - i),
    `H ${i + r}`,
    a(i, h - i - r),
    `V ${i + r}`,
    a(i + r, i),
    "Z",
  ].join(" ");
}

/** Bingkai krem bergaris emas ganda dengan sudut cekung. Taruh di dalam elemen ber-`position: relative`. */
export function NotchFrame({ r = 30 }: { r?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => setSize([el.clientWidth, el.clientHeight]);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <svg ref={ref} className="nf" aria-hidden>
      {size && (
        <>
          <path className="nf-fill" d={notchPath(size[0], size[1], 0, r)} />
          <path className="nf-l1" d={notchPath(size[0], size[1], 7, r)} />
          <path className="nf-l2" d={notchPath(size[0], size[1], 12, r - 3)} />
        </>
      )}
    </svg>
  );
}
