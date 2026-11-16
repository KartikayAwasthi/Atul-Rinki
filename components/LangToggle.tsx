"use client";

import { LANG_KEY } from "@/lib/lang";

function setLang(lang: "en" | "hi") {
  const html = document.documentElement;
  html.dataset.lang = lang;
  html.lang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

export function LangToggle() {
  return (
    <button
      type="button"
      onClick={() => setLang(document.documentElement.dataset.lang === "hi" ? "en" : "hi")}
      className="ml-1 inline-flex h-9 shrink-0 items-center rounded-full border border-gold/60 bg-maroon/60 p-0.5 text-xs font-semibold"
    >
      {/* Highlight is driven by CSS on html[data-lang], so no client state needed */}
      <span className="lang-pill-en rounded-full px-2 py-1">EN</span>
      <span lang="hi" className="lang-pill-hi rounded-full px-2 py-1">हिं</span>
      <span className="sr-only">
        <span className="i18n-en">Switch language to Hindi</span>
        <span lang="hi" className="i18n-hi">भाषा अंग्रेज़ी में बदलें</span>
      </span>
    </button>
  );
}
