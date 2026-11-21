"use client";

import { useEffect, useState } from "react";
import Fridge, { SpeechBubble } from "@/components/Fridge";

// Module state survives client-side navigation but resets on a full app
// launch, so the walk-on plays once per launch rather than on every visit.
let hasPlayed = false;

type Props = {
  busy: boolean;
  hasResult: boolean;
};

export default function FridgeIntro({ busy, hasResult }: Props) {
  const [arrived, setArrived] = useState(() => hasPlayed);

  useEffect(() => {
    hasPlayed = true;
  }, []);

  const message = busy ? "hmm, let me look…" : hasResult ? "yum!" : "hungry ?";

  return (
    <div className="flex h-44 items-start gap-1 pt-6">
      <div
        className={`shrink-0 ${arrived ? "" : "fridge-walk-in"}`}
        onAnimationEnd={(event) => {
          if (event.animationName === "walk-in") setArrived(true);
        }}
      >
        <Fridge
          className="h-36 w-28"
          walking={!arrived}
          bobbing={busy}
          pose={busy ? "think" : hasResult ? "heart" : "stand"}
        />
      </div>
      {arrived && (
        <SpeechBubble key={message} className="pop-in">
          {message}
        </SpeechBubble>
      )}
    </div>
  );
}
