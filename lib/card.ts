// Client-only: draws the wedding invitation on canvases (A5 @ 300 dpi) and
// saves them as a 2-page PDF with clickable links (map, WhatsApp, phone).
// Drawing in the browser means Hindi (Devanagari) text is shaped correctly
// by the browser's text engine.
//
// Page 1 — cover, styled like the website's hero.
// Page 2 — events, venue and RSVP, styled like the website's sections.

import { links, ui, wedding, type L } from "./wedding";

type Lang = keyof L;
type Link = { page: number; x: number; y: number; w: number; h: number; url: string };

const W = 1748; // A5 width  @ 300dpi
const H = 2480; // A5 height @ 300dpi
const CX = W / 2;
const PX_TO_MM = 148 / W;

const C = {
  maroonDeep: "#3a060d",
  maroon: "#5c0b16",
  crimson: "#9b1b2a",
  gold: "#d4a24c",
  goldLight: "#f3d58a",
  ivory: "#fdf6e7",
  ink: "#3b1d12",
};

/** Same gradients as the website's event cards (Tailwind colours as hex) */
const EVENT_TONES: Record<string, [string, string, string]> = {
  haldi: ["#fcd34d", "#facc15", "#f59e0b"],
  mehndi: ["#84cc16", "#059669", "#065f46"],
  sangeet: ["#c026d3", "#7e22ce", "#312e81"],
  wedding: ["#be123c", "#991b1b", "#4a0a12"],
};

const PETAL_COLORS = ["#f59e0b", "#e11d48", "#fbbf24"];

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const optional = (src: string) => loadImage(src).catch(() => null);

const mapUrl = () => links.map;
const whatsappUrl = (lang: Lang) => links.whatsapp(lang);
const telUrl = () => links.tel;

export async function renderCard(
  lang: Lang,
  images: { groom: string; bride: string },
): Promise<{ pages: HTMLCanvasElement[]; hotspots: Link[] }> {
  const fam = {
    script: cssVar("--font-vibes", "cursive"),
    display: cssVar("--font-cinzel", "serif"),
    serif: cssVar("--font-cormorant", "serif"),
    hindi: cssVar("--font-hindi", "serif"),
  };
  const hi = lang === "hi";
  const t = (s: L) => s[lang];
  const hotspots: Link[] = [];

  // Make sure every font (and the Devanagari subset) is loaded before drawing
  const sample = "AaBb & 0123 अतुल रिंकी शुभ विवाह फ़रवरी";
  await Promise.all(
    [
      `40px ${fam.script}`,
      `40px ${fam.display}`,
      `700 40px ${fam.display}`,
      `40px ${fam.serif}`,
      `italic 40px ${fam.serif}`,
      `40px ${fam.hindi}`,
    ].map((f) => document.fonts.load(f, sample).catch(() => [])),
  );
  await document.fonts.ready;

  const [groomImg, brideImg, ...eventImgs] = await Promise.all([
    loadImage(images.groom),
    loadImage(images.bride),
    ...wedding.events.map((e) => optional(e.image)),
  ]);

  /* ───────────── drawing helpers (bound to the current canvas) ───────────── */

  let ctx!: CanvasRenderingContext2D;
  let page = 0;

  const newPage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d")!;
    ctx.textBaseline = "alphabetic";
    return canvas;
  };

  type Kind = "script" | "display" | "serif";
  const font = (kind: Kind, size: number, opts: { italic?: boolean; bold?: boolean } = {}) => {
    const family = hi ? fam.hindi : fam[kind];
    const style = opts.italic && !hi ? "italic " : "";
    const weight = opts.bold && !hi ? "700 " : "400 ";
    return `${style}${weight}${size}px ${family}`;
  };

  const goldGradient = (y: number, size: number) => {
    const g = ctx.createLinearGradient(0, y - size, 0, y + size * 0.15);
    g.addColorStop(0, "#fff1c1");
    g.addColorStop(0.4, C.goldLight);
    g.addColorStop(0.75, C.gold);
    g.addColorStop(1, "#a8741f");
    return g;
  };

  const setSpacing = (px: number) => {
    if ("letterSpacing" in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = hi ? "0px" : `${px}px`;
    }
  };

  const text = (
    str: string,
    y: number,
    f: string,
    fill: string | CanvasGradient,
    { x = CX, spacing = 0, align = "center" as CanvasTextAlign } = {},
  ) => {
    ctx.font = f;
    ctx.fillStyle = fill;
    ctx.textAlign = align;
    setSpacing(spacing);
    ctx.fillText(str, x, y);
    setSpacing(0);
  };

  const measure = (str: string, f: string, spacing = 0) => {
    ctx.font = f;
    setSpacing(spacing);
    const w = ctx.measureText(str).width;
    setSpacing(0);
    return w;
  };

  /** Draws text wrapped to maxWidth, centered on x; returns y of the last line. */
  const wrapped = (str: string, y: number, f: string, fill: string, maxWidth: number, lh: number, x = CX) => {
    ctx.font = f;
    const lines: string[] = [];
    let line = "";
    for (const w of str.split(" ")) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    lines.forEach((l, i) => text(l, y + i * lh, f, fill, { x }));
    return y + (lines.length - 1) * lh;
  };

  const link = (x: number, y: number, w: number, h: number, url: string) =>
    hotspots.push({ page, x, y, w, h, url });

  const divider = (y: number, half = 280, color = C.gold, x = CX) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - half, y);
    ctx.lineTo(x - 70, y);
    ctx.moveTo(x + 70, y);
    ctx.lineTo(x + half, y);
    ctx.stroke();
    ctx.lineWidth = 3.5;
    for (const dir of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(x - 60, y);
      ctx.quadraticCurveTo(x - 30, y - 26 * dir, x, y);
      ctx.quadraticCurveTo(x + 30, y + 26 * dir, x + 60, y);
      ctx.stroke();
    }
    for (const [dx, r] of [[0, 8], [-70, 5], [70, 5]] as const) {
      ctx.beginPath();
      ctx.arc(x + dx, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  /** The website's `bg-palace`: maroon gradient with a gold glow on top and crimson below */
  const palaceBg = (x: number, y: number, w: number, h: number) => {
    const bg = ctx.createLinearGradient(0, y, 0, y + h);
    bg.addColorStop(0, C.maroonDeep);
    bg.addColorStop(0.55, C.maroon);
    bg.addColorStop(1, C.maroonDeep);
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    const top = ctx.createRadialGradient(x + w / 2, y, 0, x + w / 2, y, Math.max(w, h) * 0.6);
    top.addColorStop(0, "rgba(243,213,138,0.26)");
    top.addColorStop(1, "rgba(243,213,138,0)");
    ctx.fillStyle = top;
    ctx.fillRect(x, y, w, h);
    const bottom = ctx.createRadialGradient(x + w / 2, y + h, 0, x + w / 2, y + h, Math.max(w, h) * 0.5);
    bottom.addColorStop(0, "rgba(155,27,42,0.55)");
    bottom.addColorStop(1, "rgba(155,27,42,0)");
    ctx.fillStyle = bottom;
    ctx.fillRect(x, y, w, h);
  };

  /** The website's `bg-paper`: ivory with soft gold and crimson washes */
  const paperBg = () => {
    ctx.fillStyle = C.ivory;
    ctx.fillRect(0, 0, W, H);
    for (const [cx, cy, color] of [
      [W * 0.2, H * 0.1, "rgba(212,162,76,0.14)"],
      [W * 0.8, H * 0.9, "rgba(155,27,42,0.08)"],
    ] as const) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.7);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  };

  /** Diamond-and-circle lattice, like the website's `bg-jaali` */
  const jaali = (x0: number, y0: number, w: number, h: number, alpha = 0.1) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, w, h);
    ctx.clip();
    ctx.strokeStyle = `rgba(212,162,76,${alpha})`;
    ctx.lineWidth = 2;
    const step = 96;
    for (let y = y0; y < y0 + h + step; y += step) {
      for (let x = x0; x < x0 + w + step; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, y - step / 2 + 4);
        ctx.lineTo(x + step / 2 - 4, y);
        ctx.lineTo(x, y + step / 2 - 4);
        ctx.lineTo(x - step / 2 + 4, y);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  /** Toran-style scallops hanging from y */
  const scallop = (y: number, color: string, r = 26) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, y - 2, W, 2);
    for (let x = r; x < W + r; x += r * 2) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI);
      ctx.fill();
    }
    ctx.restore();
  };

  const border = () => {
    ctx.save();
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 8;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.lineWidth = 2.5;
    ctx.strokeRect(76, 76, W - 152, H - 152);
    ctx.fillStyle = C.gold;
    for (const [x, y, sx, sy] of [
      [76, 76, 1, 1],
      [W - 76, 76, -1, 1],
      [76, H - 76, 1, -1],
      [W - 76, H - 76, -1, -1],
    ]) {
      ctx.lineWidth = 3;
      const a0 = sx > 0 ? (sy > 0 ? 0 : -Math.PI / 2) : sy > 0 ? Math.PI / 2 : Math.PI;
      for (const r of [70, 100]) {
        ctx.beginPath();
        ctx.arc(x, y, r, a0, a0 + Math.PI / 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x + 30 * sx, y + 10 * sy);
      ctx.lineTo(x + 40 * sx, y + 30 * sy);
      ctx.lineTo(x + 30 * sx, y + 50 * sy);
      ctx.lineTo(x + 20 * sx, y + 30 * sy);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  /** Falling marigold / rose petals, frozen mid-air */
  const petals = () => {
    for (let i = 0; i < 22; i++) {
      const x = i % 2 ? W - 130 - ((i * 173) % 330) : 130 + ((i * 173) % 330); // keep petals to the sides, clear of the text
      const y = 140 + ((i * 587) % 820);
      const s = 16 + ((i * 7) % 14);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((i * 47 * Math.PI) / 180);
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = PETAL_COLORS[i % 3];
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s, -s, s, 0);
      ctx.quadraticCurveTo(0, s, -s, s);
      ctx.quadraticCurveTo(-s, 0, 0, -s);
      ctx.fill();
      ctx.restore();
    }
  };

  /** Rectangle with a semicircular top, like the website's `rounded-t-full` frames */
  const archPath = (x: number, y: number, w: number, h: number) => {
    const r = w / 2;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  };

  const pill = (
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    url: string,
    style: "gold" | "maroon" | "outline",
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    if (style === "gold") {
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, C.goldLight);
      g.addColorStop(1, C.gold);
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = g;
      ctx.fill();
    } else if (style === "maroon") {
      ctx.shadowColor = "rgba(92,11,22,0.35)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = C.maroon;
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(58,6,13,0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(212,162,76,0.9)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();
    const size = hi ? 36 : 32;
    const f = font("display", size, { bold: style === "gold" });
    const color = style === "gold" ? C.maroonDeep : C.goldLight;
    const label2 = hi ? label : label.toUpperCase();
    const iconW = 44;
    const tw = measure(label2, f, 3);
    const startX = x + (w - tw - iconW) / 2;
    drawIcon(url, startX + 14, y + h / 2, color);
    text(label2, y + h / 2 + size * 0.36, f, color, { x: startX + iconW, spacing: 3, align: "left" });
    link(x, y, w, h, url);
  };

  /** Small line icon chosen from the link type */
  const drawIcon = (url: string, cx: number, cy: number, color: string) => {
    ctx.save();
    ctx.translate(cx - 14, cy - 14);
    ctx.scale(28 / 24, 28 / 24);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (url.startsWith("tel:")) {
      ctx.stroke(new Path2D("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"));
    } else if (url.includes("wa.me")) {
      ctx.stroke(new Path2D("M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"));
      ctx.stroke(new Path2D("M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"));
    } else {
      ctx.stroke(new Path2D("M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"));
      ctx.beginPath();
      ctx.arc(12, 9.5, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  /** Gold line-art mandap — the same drawing the website shows for the venue */
  const mandap = (x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(w / 400, h / 300);
    const glow = ctx.createRadialGradient(200, 215, 0, 200, 215, 190);
    glow.addColorStop(0, "rgba(243,213,138,0.35)");
    glow.addColorStop(1, "rgba(243,213,138,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 400, 300);
    ctx.strokeStyle = C.gold;
    ctx.lineCap = "round";
    const s = (d: string, lw: number, fill?: string) => {
      const p = new Path2D(d);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill(p);
      }
      ctx.lineWidth = lw;
      ctx.stroke(p);
    };
    s("M150 92 Q200 30 250 92", 2);
    s("M200 30 V24", 2);
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    ctx.arc(200, 19, 5, 0, Math.PI * 2);
    ctx.fill();
    s("M110 92 H290 L300 104 H100 Z", 2, "rgba(58,6,13,0.4)");
    ctx.setLineDash([1, 5]);
    s("M112 106 Q140 130 168 106 Q200 132 232 106 Q260 130 288 106", 1.5);
    ctx.setLineDash([]);
    for (const gx of [126, 154, 200, 246, 274]) {
      const len = gx === 200 ? 140 : 128;
      s(`M${gx} 108 V${len}`, 1);
      ctx.fillStyle = C.gold;
      ctx.beginPath();
      ctx.arc(gx, len + 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const px of [118, 282]) {
      s(`M${px - 8} 104 V240 M${px + 8} 104 V240 M${px - 12} 104 H${px + 12} M${px - 12} 240 H${px + 12}`, 2);
      s(`M${px - 8} 150 H${px + 8} M${px - 8} 196 H${px + 8}`, 1);
    }
    s("M90 240 H310 M76 252 H324 M62 264 H338", 2);
    s("M186 240 H214 L210 228 H190 Z", 1.5, "rgba(58,6,13,0.5)");
    ctx.strokeStyle = C.goldLight;
    s("M200 226 C190 214 198 204 200 196 C203 206 211 212 200 226 Z", 1, "#f59e0b");
    ctx.strokeStyle = C.gold;
    for (const kx of [160, 240]) {
      s(`M${kx - 9} 240 Q${kx - 13} 226 ${kx} 222 Q${kx + 13} 226 ${kx + 9} 240 Z`, 1.5, "rgba(155,27,42,0.6)");
      s(`M${kx - 6} 222 Q${kx} 212 ${kx + 6} 222`, 1.5);
    }
    ctx.restore();
  };

  /** Draw an image so it covers the box (like CSS object-fit: cover) */
  const cover = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  };

  /* ───────────────────────────── Page 1: cover ───────────────────────────── */

  const cover1 = newPage();
  page = 0;
  palaceBg(0, 0, W, H);
  jaali(0, 0, W, H, 0.09);
  petals();

  let y = 205;
  text(t(ui.card.ganesh), y, font("display", hi ? 44 : 32), "rgba(243,213,138,0.8)", { spacing: 8 });
  y += 82;
  text(hi ? t(ui.shubhVivah) : t(ui.shubhVivah).toUpperCase(), y, font("display", hi ? 58 : 44), goldGradient(y, 50), { spacing: 14 });
  y += 80;
  text(t(ui.withFamilies), y, font("serif", hi ? 42 : 48, { italic: true }), "rgba(253,246,231,0.85)");

  const nameSize = hi ? 160 : 200;
  y += hi ? 200 : 215;
  text(t(wedding.groom.name), y, font("script", nameSize), goldGradient(y, nameSize));
  y += hi ? 120 : 125;
  text(hi ? "संग" : "&", y, font("display", hi ? 56 : 80), C.gold);
  y += hi ? 190 : 205;
  text(t(wedding.bride.name), y, font("script", nameSize), goldGradient(y, nameSize));
  y += 95;
  divider(y);
  y += 85;
  y = wrapped(t(ui.card.invite), y, font("serif", hi ? 40 : 46, { italic: true }), C.ivory, 1250, 58);

  y += 100;
  text(hi ? t(wedding.dateLabel) : t(wedding.dateLabel).toUpperCase(), y, font("display", hi ? 72 : 74, { bold: true }), goldGradient(y, 72), { spacing: 8 });
  y += 66;
  const ceremony = wedding.events.find((e) => e.key === "wedding")!;
  text(`${t(wedding.weekday)} · ${t(ceremony.time)}`, y, font("serif", hi ? 40 : 46), "rgba(253,246,231,0.85)");

  // Couple portraits standing on a dark band, like the hero
  const bandTop = 2130;
  const portraitsTop = y + 50;
  const groomH = bandTop - portraitsTop;
  const brideH = Math.round(groomH / 1.15); // groom stands taller
  const gW = (groomImg.width / groomImg.height) * groomH;
  const bW = (brideImg.width / brideImg.height) * brideH;
  const overlap = 40;
  const startX = CX - (gW + bW - overlap) / 2;

  const halo = ctx.createRadialGradient(CX, bandTop - 260, 0, CX, bandTop - 260, 560);
  halo.addColorStop(0, "rgba(243,213,138,0.32)");
  halo.addColorStop(1, "rgba(243,213,138,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, portraitsTop - 100, W, bandTop - portraitsTop + 100);

  const floor = ctx.createLinearGradient(0, bandTop - 320, 0, bandTop);
  floor.addColorStop(0, "rgba(58,6,13,0)");
  floor.addColorStop(1, C.maroonDeep);
  ctx.fillStyle = floor;
  ctx.fillRect(0, bandTop - 320, W, 320);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(groomImg, startX, bandTop - groomH, gW, groomH);
  ctx.drawImage(brideImg, startX + gW - overlap, bandTop - brideH, bW, brideH);
  ctx.restore();

  ctx.fillStyle = C.maroonDeep;
  ctx.fillRect(0, bandTop, W, H - bandTop);
  ctx.fillStyle = "rgba(212,162,76,0.5)";
  ctx.fillRect(0, bandTop, W, 3);

  // Venue on the band — the whole block opens Google Maps
  const venueLine = `${t(wedding.venue.name)} · ${t(wedding.city)}`;
  const vf = font("display", hi ? 50 : 46);
  const vw = measure(venueLine, vf, 4) + 50;
  drawIcon(mapUrl(), CX - vw / 2 + 14, 2220, C.goldLight);
  text(venueLine, 2236, vf, C.goldLight, { x: CX + 25, spacing: 4 });
  text(t(ui.card.mapHint), 2300, font("serif", hi ? 34 : 38, { italic: true }), "rgba(253,246,231,0.7)");
  link(CX - vw / 2 - 20, 2170, vw + 40, 160, mapUrl());

  border();

  /* ─────────────────── Page 2: events, venue & RSVP ─────────────────── */

  const details = newPage();
  page = 1;
  paperBg();
  scallop(0, C.maroonDeep, 28);

  const eyebrow = (s: L, yy: number, color: string, x = CX) =>
    text(hi ? t(s) : t(s).toUpperCase(), yy, font("display", hi ? 38 : 32), color, { x, spacing: 10 });
  const title = (s: L, yy: number, color: string, x = CX) =>
    text(t(s), yy, font("script", hi ? 84 : 116), color, { x });

  eyebrow(ui.events.eyebrow, 205, "rgba(155,27,42,0.8)");
  title(ui.events.title, 320, C.maroon);
  divider(380, 240);

  // 2 × 2 event cards, same look as the website
  const gx0 = 150;
  const gap = 50;
  const cardW = (W - gx0 * 2 - gap) / 2;
  const cardH = 520;
  const headH = 210;
  wedding.events.forEach((e, i) => {
    const x = gx0 + (i % 2) * (cardW + gap);
    const cy = 420 + Math.floor(i / 2) * (cardH + 30);

    ctx.save();
    ctx.shadowColor = "rgba(58,6,13,0.35)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.beginPath();
    ctx.roundRect(x, cy, cardW, cardH, 34);
    ctx.fillStyle = C.maroonDeep;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, cy, cardW, cardH, 34);
    ctx.clip();
    const img = eventImgs[i];
    if (img) {
      cover(img, x, cy, cardW, headH);
    } else {
      const [a, b, c] = EVENT_TONES[e.key] ?? EVENT_TONES.wedding;
      const g = ctx.createLinearGradient(x, cy, x + cardW, cy + headH);
      g.addColorStop(0, a);
      g.addColorStop(0.5, b);
      g.addColorStop(1, c);
      ctx.fillStyle = g;
      ctx.fillRect(x, cy, cardW, headH);
      jaali(x, cy, cardW, headH, 0.22);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 16;
      text(t(e.name), cy + headH / 2 + 34, font("script", hi ? 84 : 110), "rgba(255,255,255,0.93)", { x: x + cardW / 2 });
      ctx.restore();
    }
    const shade = ctx.createLinearGradient(0, cy + headH / 2, 0, cy + headH);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = shade;
    ctx.fillRect(x, cy + headH / 2, cardW, headH / 2);
    ctx.restore();

    // date pill
    const df = font("display", hi ? 28 : 24);
    const dw = measure(t(e.date), df, 2) + 44;
    ctx.beginPath();
    ctx.roundRect(x + 26, cy + headH - 70, dw, 50, 25);
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fill();
    text(t(e.date), cy + headH - 36, df, C.goldLight, { x: x + 26 + 22, spacing: 2, align: "left" });

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, cy, cardW, cardH, 34);
    ctx.strokeStyle = "rgba(212,162,76,0.55)";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    const bx = x + 40;
    let by = cy + headH + 72;
    text(hi ? t(e.name) : t(e.name).toUpperCase(), by, font("display", hi ? 52 : 46), C.goldLight, { x: bx, spacing: 3, align: "left" });
    by += 50;
    text(t(e.tagline), by, font("serif", hi ? 32 : 36, { italic: true }), "rgba(253,246,231,0.75)", { x: bx, align: "left" });
    by += 64;
    for (const [label, value, url] of [
      [ui.events.time, e.time, null],
      [ui.events.venue, e.venue, mapUrl()],
      [ui.events.dress, e.dress, null],
    ] as const) {
      text(hi ? t(label) : t(label).toUpperCase(), by, font("display", hi ? 30 : 24), "rgba(212,162,76,0.95)", { x: bx, spacing: 3, align: "left" });
      const vf2 = font("serif", hi ? 32 : 36);
      text(t(value), by, vf2, url ? C.goldLight : "rgba(253,246,231,0.92)", { x: bx + 150, align: "left" });
      if (url) {
        const w = measure(t(value), vf2);
        ctx.fillStyle = "rgba(243,213,138,0.6)";
        ctx.fillRect(bx + 150, by + 8, w, 2);
        link(bx + 150 - 10, by - 40, w + 20, 56, url);
      }
      by += 48;
    }
  });

  // Venue
  const vy = 420 + 2 * cardH + 30 + 90;
  eyebrow(ui.venue.eyebrow, vy, "rgba(155,27,42,0.8)");
  title(ui.venue.title, vy + 118, C.maroon);

  const ax = 170;
  const ay = vy + 148;
  const aw = 460;
  const ah = 330;
  ctx.save();
  ctx.shadowColor = "rgba(92,11,22,0.3)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  archPath(ax, ay, aw, ah);
  ctx.fillStyle = C.maroon;
  ctx.fill();
  ctx.restore();
  ctx.save();
  archPath(ax, ay, aw, ah);
  ctx.clip();
  palaceBg(ax, ay, aw, ah);
  jaali(ax, ay, aw, ah, 0.16);
  mandap(ax, ay + 20, aw, ah - 20);
  ctx.restore();
  archPath(ax, ay, aw, ah);
  ctx.strokeStyle = "rgba(212,162,76,0.85)";
  ctx.lineWidth = 8;
  ctx.stroke();
  link(ax, ay, aw, ah, mapUrl());

  const tx = (ax + aw + 60 + W - 150) / 2; // centre of the text column
  const colW = W - 150 - (ax + aw + 60);
  text(hi ? t(wedding.venue.name) : t(wedding.venue.name).toUpperCase(), ay + 90, font("display", hi ? 62 : 56), C.maroon, { x: tx, spacing: 3 });
  text(t(wedding.venue.address), ay + 150, font("serif", hi ? 38 : 44), "rgba(59,29,18,0.8)", { x: tx });
  link(tx - colW / 2, ay + 30, colW, 150, mapUrl());
  pill(tx - 280, ay + 200, 560, 96, t(ui.venue.directions), mapUrl(), "maroon");

  // RSVP panel
  const ry = ay + ah + 45;
  const rx = 190;
  const rw = W - rx * 2;
  const rh = H - 110 - ry;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 36);
  ctx.clip();
  palaceBg(rx, ry, rw, rh);
  jaali(rx, ry, rw, rh, 0.1);
  ctx.restore();
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 36);
  ctx.strokeStyle = "rgba(212,162,76,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();

  const rsvpLine = hi
    ? `कृपया ${t(wedding.rsvp.deadline)} तक सूचित करें`
    : `${t(ui.card.rsvp)} ${t(wedding.rsvp.deadline)}`;
  text(rsvpLine, ry + 78, font("serif", hi ? 38 : 42, { italic: true }), "rgba(253,246,231,0.9)");
  const bw = 600;
  const bh = 86;
  const bgap = 40;
  const bx0 = CX - bw - bgap / 2;
  const btnY = ry + rh - bh - 40;
  pill(bx0, btnY, bw, bh, t(ui.rsvp.whatsapp), whatsappUrl(lang), "gold");
  pill(bx0 + bw + bgap, btnY, bw, bh, wedding.rsvp.phone, telUrl(), "outline");

  border();

  return { pages: [cover1, details], hotspots };
}

export async function downloadCardPdf(lang: Lang, images: { groom: string; bride: string }) {
  const [{ pages, hotspots }, { jsPDF }] = await Promise.all([renderCard(lang, images), import("jspdf")]);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5", compress: true });
  pdf.setProperties({
    title: `${wedding.groom.name.en} & ${wedding.bride.name.en} — Wedding Invitation`,
    subject: "Wedding Invitation",
  });
  pages.forEach((canvas, i) => {
    if (i > 0) pdf.addPage("a5", "portrait");
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 148, 210, undefined, "FAST");
    for (const l of hotspots.filter((l) => l.page === i)) {
      pdf.link(l.x * PX_TO_MM, l.y * PX_TO_MM, l.w * PX_TO_MM, l.h * PX_TO_MM, { url: l.url });
    }
  });
  const suffix = lang === "hi" ? "Hindi" : "English";
  pdf.save(`${wedding.groom.name.en}-${wedding.bride.name.en}-Wedding-Invitation-${suffix}.pdf`);
}
