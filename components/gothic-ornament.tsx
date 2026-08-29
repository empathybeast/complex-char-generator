import { cn } from "@/lib/utils";

const CORNER_POS = {
  tl: "top-0.5 left-0.5",
  tr: "top-0.5 right-0.5 scale-x-[-1]",
  bl: "bottom-0.5 left-0.5 scale-y-[-1]",
  br: "bottom-0.5 right-0.5 scale-[-1]",
} as const;

export function CornerFlourish({
  corner,
  className,
}: {
  corner: keyof typeof CORNER_POS;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 72 72"
      className={cn(
        "pointer-events-none absolute z-[3] size-14 text-ice",
        CORNER_POS[corner],
        className,
      )}
    >
      <path
        d="M4 54 V14 Q4 4 14 4 H54"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M11 46 V20 Q11 11 20 11 H46"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.72"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M46 11 C62 10 66 28 48 34 C32 40 30 16 52 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M11 46 C10 62 28 66 34 48 C40 32 16 30 20 52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M54 4 C60 4 64 10 58 16 C54 20 62 22 64 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M26 11 v7 M36 11 v4.5 M11 26 h7 M11 36 h4.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <path d="M20 20 l5.4-5.4 5.4 5.4-5.4 5.4 z" fill="currentColor" opacity="0.95" />
      <circle cx="4" cy="4" r="1.8" fill="currentColor" />
      <circle cx="46" cy="11" r="1.15" fill="currentColor" />
      <circle cx="11" cy="46" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function EdgeJewel({ edge }: { edge: "t" | "b" | "l" | "r" }) {
  const pos = {
    t: "top-[2px] left-1/2 -translate-x-1/2",
    b: "bottom-[2px] left-1/2 -translate-x-1/2 rotate-180",
    l: "left-[2px] top-1/2 -translate-y-1/2 -rotate-90",
    r: "right-[2px] top-1/2 -translate-y-1/2 rotate-90",
  }[edge];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 36 20"
      className={cn("pointer-events-none absolute z-[3] h-4 w-8 text-ice", pos)}
    >
      <path
        d="M6 10 C10 10 12 4 18 4 C24 4 26 10 30 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M6 10 C10 10 12 16 18 16 C24 16 26 10 30 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d="M18 2.2 L22.4 10 L18 17.8 L13.6 10 Z" fill="currentColor" />
      <path d="M2 10 H8 M28 10 H34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function FiligreeDivider({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 36"
      className={cn("h-7 w-full max-w-md text-ice", className)}
    >
      <path
        d="M8 18 H128"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <path
        d="M292 18 H412"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <path
        d="M128 18 C148 18 154 6 172 8 C186 10 190 18 210 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M292 18 C272 18 266 6 248 8 C234 10 230 18 210 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M128 18 C146 18 152 30 170 28 C184 26 190 18 210 18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1"
      />
      <path
        d="M292 18 C274 18 268 30 250 28 C236 26 230 18 210 18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1"
      />
      <path
        d="M152 10 C146 2 136 4 138 12 M268 10 C274 2 284 4 282 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M210 6 L219 18 L210 30 L201 18 Z" fill="currentColor" />
      <path d="M128 18 L132 14 136 18 132 22 Z" fill="currentColor" opacity="0.9" />
      <path d="M292 18 L288 14 284 18 288 22 Z" fill="currentColor" opacity="0.9" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="412" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function TitleCrest({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 36"
      className={cn("h-8 w-14 text-ice", className)}
    >
      <path
        d="M32 3 L38 16 L32 33 L26 16 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path d="M32 10 L35.2 16 L32 22.5 L28.8 16 Z" fill="currentColor" />
      <path
        d="M8 16 H22 M42 16 H56"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M8 16 C8 8 18 6 20 13 M56 16 C56 8 46 6 44 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M8 16 C10 24 18 24 20 18 M56 16 C54 24 46 24 44 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="8" cy="16" r="1.4" fill="currentColor" />
      <circle cx="56" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function GothicArch({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 56"
      className={cn("h-10 w-full max-w-lg text-ice", className)}
    >
      <path
        d="M20 48 C60 48 90 8 180 8 C270 8 300 48 340 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M44 48 C80 48 104 16 180 16 C256 16 280 48 316 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <path
        d="M96 30 C110 18 140 14 180 14 C220 14 250 18 264 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M72 44 C64 28 78 22 88 34 M288 44 C296 28 282 22 272 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      <path d="M180 4 L186 14 L180 20 L174 14 Z" fill="currentColor" />
      <circle cx="20" cy="48" r="1.5" fill="currentColor" />
      <circle cx="340" cy="48" r="1.5" fill="currentColor" />
      <circle cx="96" cy="30" r="1.2" fill="currentColor" />
      <circle cx="264" cy="30" r="1.2" fill="currentColor" />
    </svg>
  );
}
