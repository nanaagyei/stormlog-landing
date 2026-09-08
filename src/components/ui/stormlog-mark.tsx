import { cn } from "@/lib/utils";

/**
 * The Stormlog mark: three stacked isometric layers with the middle band in
 * Phosphor Mint.
 *
 * Rebuilt as vector from `public/stormlog_newlogo_5.png`, which is an opaque
 * palette PNG (no alpha) and so cannot sit on the dark ground directly. Corner
 * rounding comes from `stroke-linejoin: round` with the stroke matching each
 * fill, which is why the base geometry is inset — the 1.5-unit stroke radius
 * grows every edge outward by that much.
 *
 * The dark layers use `currentColor` so the mark inherits its surrounding text
 * color (Print White in nav and footer); only the mint band is fixed.
 */
export function StormlogMark({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-6 shrink-0", className)}
      {...props}
    >
      <g strokeLinejoin="round" strokeWidth={3}>
        <path
          d="M16 2.85 27 8.6 16 14.35 5 8.6Z"
          fill="currentColor"
          stroke="currentColor"
        />
        <path
          d="M5 16 16 21.75 27 16 27 13.5 16 19.25 5 13.5Z"
          fill="#40c786"
          stroke="#40c786"
        />
        <path
          d="M5 23.4 16 29.15 27 23.4 27 20.9 16 26.65 5 20.9Z"
          fill="currentColor"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
}
