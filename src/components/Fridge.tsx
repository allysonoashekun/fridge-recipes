// The app's mascot: a little fridge drawn in the hand-drawn, monotone style.
// Purely decorative, so it is hidden from screen readers.

export type FridgePose = "stand" | "wave" | "heart" | "think";

type Props = {
  pose?: FridgePose;
  walking?: boolean;
  bobbing?: boolean;
  className?: string;
};

const INK = {
  stroke: "var(--foreground)",
  strokeWidth: 3.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

function Hand({ x, y, up = false }: { x: number; y: number; up?: boolean }) {
  const dy = up ? -1 : 1;
  return (
    <path
      {...INK}
      strokeWidth={3}
      d={`M${x} ${y} l-5 ${4 * dy} M${x} ${y} l0 ${6 * dy} M${x} ${y} l5 ${4 * dy}`}
    />
  );
}

function Arms({ pose }: { pose: FridgePose }) {
  if (pose === "heart") {
    return (
      <>
        <path {...INK} d="M28 72 Q34 92 50 96" />
        <path {...INK} d="M92 72 Q86 92 70 96" />
        <path
          fill="var(--foreground)"
          d="M60 108 C46 99 46 87 53 87 C57 87 60 90 60 93 C60 90 63 87 67 87 C74 87 74 99 60 108 Z"
        />
      </>
    );
  }

  return (
    <>
      <path {...INK} d="M28 70 Q16 80 15 96" />
      <Hand x={15} y={96} />
      {pose === "wave" ? (
        <g className="fridge-wave">
          <path {...INK} d="M92 68 Q106 58 106 42" />
          <Hand x={106} y={42} up />
        </g>
      ) : (
        <>
          <path {...INK} d="M92 70 Q104 80 105 96" />
          <Hand x={105} y={96} />
        </>
      )}
    </>
  );
}

function Face({ pose }: { pose: FridgePose }) {
  if (pose === "heart") {
    // Happy closed eyes.
    return (
      <>
        <path {...INK} strokeWidth={3} d="M45 74 q4 -5 8 0 M59 74 q4 -5 8 0" />
        <path {...INK} strokeWidth={3} d="M51 81 Q56 86 61 81" />
      </>
    );
  }

  const eyeY = pose === "think" ? 70 : 73;
  const eyeX = pose === "think" ? 2 : 0;
  return (
    <>
      <g className="fridge-blink">
        <circle cx={49 + eyeX} cy={eyeY} r={2.8} fill="var(--foreground)" />
        <circle cx={63 + eyeX} cy={eyeY} r={2.8} fill="var(--foreground)" />
      </g>
      {pose === "think" ? (
        <circle {...INK} strokeWidth={3} cx={57} cy={83} r={2.5} />
      ) : (
        <path {...INK} strokeWidth={3} d="M50 81 Q56 87 62 81" />
      )}
    </>
  );
}

export default function Fridge({
  pose = "stand",
  walking = false,
  bobbing = false,
  className = "",
}: Props) {
  return (
    <svg
      viewBox="0 0 120 160"
      aria-hidden
      className={`fridge ${walking ? "is-walking" : ""} ${bobbing ? "is-bobbing" : ""} ${className}`}
    >
      <g className="fridge-legs">
        <path className="fridge-leg-l" {...INK} d="M50 112 V150 H40" />
        <path className="fridge-leg-r" {...INK} d="M70 112 V150 H80" />
      </g>

      <g className="fridge-body">
        {pose !== "heart" && <Arms pose={pose} />}
        <rect x={28} y={14} width={64} height={100} rx={16} fill="var(--fill)" />
        {/* Sprout on top, like a little hair curl. */}
        <path {...INK} strokeWidth={3} d="M60 14 C58 6 62 3 66 7" />
        {/* Freezer door line and handles. */}
        <path {...INK} strokeWidth={3} d="M28 44 H92" />
        <path {...INK} d="M82 24 V34" />
        <path {...INK} d="M82 52 V62" />
        <ellipse cx={42} cy={81} rx={4} ry={2.5} fill="var(--fill-deep)" />
        <ellipse cx={70} cy={81} rx={4} ry={2.5} fill="var(--fill-deep)" />
        <Face pose={pose} />
        {pose === "heart" && <Arms pose="heart" />}
      </g>
    </svg>
  );
}

export function SpeechBubble({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`speech-bubble relative rounded-2xl border-[3px] border-foreground bg-card px-4 py-2 text-lg font-bold whitespace-nowrap ${className}`}
    >
      {children}
    </div>
  );
}
