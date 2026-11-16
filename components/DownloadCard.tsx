"use client";

import { useState } from "react";
import { ui } from "@/lib/wedding";

type Props = {
  images: { groom: string; bride: string };
  variant?: "solid" | "outline";
  className?: string;
};

export function DownloadCard({ images, variant = "solid", className = "" }: Props) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  async function onClick() {
    if (state === "busy") return;
    setState("busy");
    try {
      const lang = document.documentElement.dataset.lang === "hi" ? "hi" : "en";
      const { downloadCardPdf } = await import("@/lib/card");
      await downloadCardPdf(lang, images);
      setState("idle");
    } catch (err) {
      console.error(err);
      setState("error");
    }
  }

  const label = state === "busy" ? ui.card.preparing : state === "error" ? ui.card.failed : ui.card.download;
  const styles =
    variant === "solid"
      ? "bg-gradient-to-b from-gold-light to-gold font-bold text-maroon-deep shadow-lg shadow-black/30 hover:brightness-110"
      : "border border-gold/80 bg-maroon-deep/40 text-gold-light backdrop-blur-sm hover:bg-gold/15";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-busy={state === "busy"}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-display tracking-wide transition disabled:opacity-70 ${styles} ${className}`}
      disabled={state === "busy"}
    >
      {state === "busy" ? <Spinner /> : <DownloadIcon />}
      <span lang="en" className="i18n-en">{label.en}</span>
      <span lang="hi" className="i18n-hi">{label.hi}</span>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 animate-spin" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
