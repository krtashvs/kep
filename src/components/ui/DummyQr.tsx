import { memo } from "react";

const MODULES = 17;

function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function inFinder(x: number, y: number) {
  const far = MODULES - 7;
  return (x < 7 && y < 7) || (x >= far && y < 7) || (x < 7 && y >= far);
}

/** A decorative, deliberately non-scannable QR lookalike. */
export const DummyQr = memo(function DummyQr({ seed, className }: { seed: number; className?: string }) {
  const rand = seeded(seed);
  const cells: string[] = [];
  for (let y = 0; y < MODULES; y++) {
    for (let x = 0; x < MODULES; x++) {
      if (!inFinder(x, y) && rand() > 0.5) cells.push(`M${x} ${y}h1v1h-1z`);
    }
  }
  const finder = (x: number, y: number) =>
    `M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z M${x + 2} ${y + 2}h3v3h-3z`;

  return (
    <svg viewBox={`-1 -1 ${MODULES + 2} ${MODULES + 2}`} className={className} aria-hidden shapeRendering="crispEdges">
      <rect x="-1" y="-1" width={MODULES + 2} height={MODULES + 2} fill="#f4f2f3" rx="1" />
      <path d={`${finder(0, 0)} ${finder(MODULES - 7, 0)} ${finder(0, MODULES - 7)}`} fill="#0b0b0f" fillRule="evenodd" />
      <path d={cells.join("")} fill="#0b0b0f" />
    </svg>
  );
});
