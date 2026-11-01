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
      className={`flex h-40 w-full cursor-pointer items-center justify-center rounded-2xl bg-accent text-2xl font-bold text-accent-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
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
