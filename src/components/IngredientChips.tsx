"use client";

import { useState, type FormEvent } from "react";

type Props = {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
};

export default function IngredientChips({ items, onChange, addLabel }: Props) {
  const [draft, setDraft] = useState("");

  function add(event: FormEvent) {
    event.preventDefault();
    const item = draft.trim();
    if (!item) return;

    const isDuplicate = items.some(
      (existing) => existing.toLowerCase() === item.toLowerCase(),
    );
    if (!isDuplicate) onChange([...items, item]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              aria-label={`Remove ${item}`}
              className="flex min-h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4"
              onClick={() => onChange(items.filter((other) => other !== item))}
            >
              {item}
              <span aria-hidden className="text-muted">
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="flex gap-2">
        <input
          aria-label={addLabel}
          placeholder={addLabel}
          className="h-12 min-w-0 flex-1 rounded-xl border-2 border-border bg-card px-4 outline-none focus:border-accent"
          maxLength={100}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="h-12 rounded-xl border-2 border-border bg-card px-5 font-medium">
          Add
        </button>
      </form>
    </div>
  );
}
