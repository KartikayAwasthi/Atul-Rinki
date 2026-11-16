import type { L } from "@/lib/wedding";

/**
 * Renders both languages; CSS shows the one matching <html data-lang>.
 * Keeps the page fully static and avoids hydration mismatches.
 */
export function T({
  t,
  enClass = "",
  hiClass = "",
}: {
  t: L;
  enClass?: string;
  hiClass?: string;
}) {
  return (
    <>
      <span lang="en" className={`i18n-en ${enClass}`}>
        {t.en}
      </span>
      <span lang="hi" className={`i18n-hi ${hiClass}`}>
        {t.hi}
      </span>
    </>
  );
}
