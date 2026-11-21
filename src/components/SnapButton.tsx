"use client";

import type { ChangeEvent } from "react";

type Props = {
  busy: boolean;
  onPhoto: (file: File) => void;
};

export default function SnapButton({ busy, onPhoto }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Cleared so that picking the same photo again still fires a change event.
    event.target.value = "";
    if (file) onPhoto(file);
  }

  return (
    <label
      className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-foreground bg-fill text-2xl font-bold text-foreground shadow-[0_6px_0_var(--foreground)] transition-transform focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-foreground active:translate-y-1 active:shadow-[0_2px_0_var(--foreground)] ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        className="h-10 w-10"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 11 Q4 8 7 8 H10 L12 5 H20 L22 8 H25 Q28 8 28 11 V24 Q28 27 25 27 H7 Q4 27 4 24 Z" />
        <circle cx={16} cy={17} r={5} />
      </svg>
      {busy ? "Working…" : "Snap fridge"}
      <input
        className="sr-only"
        type="file"
        accept="image/*"
        capture="environment"
        disabled={busy}
        onChange={handleChange}
      />
    </label>
  );
}
