// Ornamen gunungan (kayon) sederhana, digambar sebagai SVG garis.
export default function Gunungan({ size = 120 }: { size?: number }) {
  return (
    <svg
      className="ornamen"
      width={size}
      height={size * 1.25}
      viewBox="0 0 100 125"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M50 4 C66 26 88 52 90 84 C90 98 76 106 50 106 C24 106 10 98 10 84 C12 52 34 26 50 4 Z" />
      <path d="M50 18 C61 34 76 56 77 80 C77 90 67 95 50 95 C33 95 23 90 23 80 C24 56 39 34 50 18 Z" opacity=".7" />
      <path d="M50 30 V95" />
      <path d="M50 48 C42 44 36 46 32 52 M50 48 C58 44 64 46 68 52" />
      <path d="M50 62 C40 58 32 61 28 68 M50 62 C60 58 68 61 72 68" />
      <path d="M50 76 C42 73 36 75 33 80 M50 76 C58 73 64 75 67 80" />
      <circle cx="50" cy="38" r="3" />
      <path d="M38 106 H62 V114 H38 Z" />
      <path d="M30 114 H70 V120 H30 Z" />
    </svg>
  );
}
