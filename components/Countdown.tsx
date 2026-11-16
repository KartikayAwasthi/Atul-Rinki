"use client";

import { useEffect, useState } from "react";
import type { L } from "@/lib/wedding";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown({
  date,
  labels,
}: {
  date: string;
  labels: Record<keyof Parts, L>;
}) {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = new Date(date).getTime();
    const tick = () => setParts(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [date]);

  const keys: (keyof Parts)[] = ["days", "hours", "minutes", "seconds"];

  return (
    <div
      className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:max-w-xl sm:gap-4"
      role="timer"
      aria-label="Countdown to the wedding / विवाह की उलटी गिनती"
    >
      {keys.map((k) => (
        <div
          key={k}
          className="gold-tile rounded-t-[2rem] rounded-b-xl px-1 pb-3 pt-4 text-center sm:rounded-t-[3rem] sm:pb-5 sm:pt-7"
        >
          <div className="text-gold-gradient font-display text-[1.75rem] font-bold leading-none tabular-nums sm:text-5xl">
            {parts ? String(parts[k]).padStart(2, "0") : "--"}
          </div>
          <div className="mt-2 text-[0.65rem] uppercase tracking-widest text-ivory/75 sm:text-xs">
            <span lang="en" className="i18n-en">{labels[k].en}</span>
            <span lang="hi" className="i18n-hi text-xs sm:text-sm">{labels[k].hi}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
