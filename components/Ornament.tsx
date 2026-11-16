import Image from "next/image";
import { optionalImage } from "@/lib/assets";
import type { L } from "@/lib/wedding";
import { T } from "./T";

/** Golden divider — uses /images/decorations/golden-ornaments.png if present, else an SVG. */
export function Ornament({ className = "" }: { className?: string }) {
  const src = optionalImage("/images/decorations/golden-ornaments.png");
  if (src) {
    return (
      <div className={`relative mx-auto h-10 w-56 sm:h-12 sm:w-72 ${className}`}>
        <Image src={src} alt="" fill sizes="288px" className="object-contain" />
      </div>
    );
  }
  return (
    <svg
      viewBox="0 0 240 24"
      aria-hidden="true"
      className={`mx-auto h-6 w-52 text-gold sm:w-64 ${className}`}
      fill="none"
      stroke="currentColor"
    >
      <path d="M0 12 H92" strokeWidth="1" />
      <path d="M148 12 H240" strokeWidth="1" />
      <path d="M100 12 Q110 2 120 12 Q130 22 140 12" strokeWidth="1.2" />
      <path d="M100 12 Q110 22 120 12 Q130 2 140 12" strokeWidth="1.2" />
      <circle cx="120" cy="12" r="3" fill="currentColor" />
      <circle cx="96" cy="12" r="1.6" fill="currentColor" />
      <circle cx="144" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: L;
  title: L;
  light?: boolean;
}) {
  return (
    <div className="mb-10 text-center sm:mb-14">
      <p
        className={`font-display text-xs uppercase tracking-[0.3em] sm:text-sm ${
          light ? "text-gold-light/80" : "text-crimson/80"
        }`}
      >
        <T t={eyebrow} hiClass="text-sm sm:text-base" />
      </p>
      <h2
        className={`mt-2 font-script text-5xl leading-tight sm:text-6xl ${
          light ? "text-gold-gradient" : "text-maroon"
        }`}
      >
        <T t={title} hiClass="block py-1 text-4xl leading-snug sm:text-5xl" />
      </h2>
      <Ornament className="mt-3" />
    </div>
  );
}
