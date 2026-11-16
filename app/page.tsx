import Image from "next/image";
import bride from "@/public/images/couple/bride.png";
import groom from "@/public/images/couple/groom.png";
import { Countdown } from "@/components/Countdown";
import { DownloadCard } from "@/components/DownloadCard";
import { LangToggle } from "@/components/LangToggle";
import { Ornament, SectionTitle } from "@/components/Ornament";
import { Petals } from "@/components/Petals";
import { T } from "@/components/T";
import { optionalImage } from "@/lib/assets";
import { links, ui, wedding, type L, type WeddingEvent } from "@/lib/wedding";

const cardImages = { groom: groom.src, bride: bride.src };

const NAV = [
  [ui.nav.couple, "#couple", HeartIcon],
  [ui.nav.events, "#events", CalendarIcon],
  [ui.nav.venue, "#venue", PinIcon],
  [ui.nav.rsvp, "#rsvp", LetterIcon],
] as const;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Couple />
        <Events />
        <Venue />
        <Rsvp />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

/** Thumb-friendly tab bar shown on phones instead of the cramped header links */
function MobileNav() {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-maroon-deep/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV.map(([label, href, Icon]) => (
          <li key={href}>
            <a
              href={href}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-gold-light/85 transition active:scale-95 active:text-gold-light"
            >
              <Icon />
              <span className="font-display text-[0.65rem] tracking-wider">
                <T t={label} hiClass="text-xs" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Scalloped edge at the top of a section; colour it like the section above */
function Scallop({ className }: { className: string }) {
  return <div aria-hidden="true" className={`scallop absolute inset-x-0 top-0 ${className}`} />;
}

/* ───────────────────────── Header ───────────────────────── */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-maroon-deep/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-1 px-3 sm:gap-2 sm:px-4">
        <a href="#top" className="shrink-0 font-script text-2xl text-gold-light sm:text-3xl" aria-label="Back to top">
          <T t={ui.monogram} hiClass="text-xl sm:text-2xl" />
        </a>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-gold-light/80 sm:hidden">
          <T t={wedding.dateLabel} hiClass="text-sm tracking-normal" />
        </p>
        <div className="flex min-w-0 items-center">
          <ul className="hidden min-w-0 items-center sm:flex sm:gap-2 sm:text-base">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="block whitespace-nowrap rounded-full px-4 py-2 font-display tracking-wide text-ivory/85 transition hover:bg-gold/15 hover:text-gold-light"
                >
                  <T t={label} />
                </a>
              </li>
            ))}
          </ul>
          <LangToggle />
        </div>
      </nav>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const palace = optionalImage("/images/palace/palace-background.webp");
  const flowers = optionalImage("/images/decorations/flowers.png");
  // Groom stands ~15% taller than the bride
  const groomH = "h-[min(48svh,80vw)] md:h-[60svh]";
  const brideH = "h-[min(41.5svh,69vw)] md:h-[52svh]";

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-palace text-ivory"
    >
      {palace ? (
        <>
          <Image src={palace} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-maroon-deep/70 via-maroon/50 to-maroon-deep/90" />
        </>
      ) : (
        <>
          <div className="bg-jaali absolute inset-0 -z-20" />
          <PalaceSilhouette />
        </>
      )}

      {flowers && (
        <>
          <Image src={flowers} alt="" width={260} height={260} className="pointer-events-none absolute -left-10 -top-6 -z-10 w-32 opacity-90 sm:w-56" />
          <Image src={flowers} alt="" width={260} height={260} className="pointer-events-none absolute -right-10 -top-6 -z-10 w-32 -scale-x-100 opacity-90 sm:w-56" />
        </>
      )}

      <Petals />

      <div className="animate-fade-up relative mx-auto w-full max-w-3xl px-4 pt-6 text-center sm:pt-12">
        <p className="mb-1 text-sm text-gold-light/70 sm:text-base">
          <T t={ui.card.ganesh} enClass="font-display text-[0.65rem] tracking-[0.25em] sm:text-xs" />
        </p>
        <p className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold-light/80 sm:text-sm">
          <T t={ui.shubhVivah} hiClass="text-base sm:text-lg" />
        </p>
        <p className="mt-2 text-base italic text-ivory/80 sm:mt-3 sm:text-lg">
          <T t={ui.withFamilies} hiClass="not-italic" />
        </p>
        <h1 className="mt-2 font-script leading-[1.05]">
          <span className="text-gold-gradient block text-6xl sm:text-7xl md:text-8xl">
            <T t={wedding.groom.name} hiClass="inline-block py-1 text-5xl leading-tight sm:text-6xl md:text-7xl" />
          </span>
          <span className="block font-display text-2xl text-gold sm:text-3xl">
            <T t={{ en: "&", hi: "संग" }} hiClass="text-xl sm:text-2xl" />
          </span>
          <span className="text-gold-gradient block text-6xl sm:text-7xl md:text-8xl">
            <T t={wedding.bride.name} hiClass="inline-block py-1 text-5xl leading-tight sm:text-6xl md:text-7xl" />
          </span>
        </h1>
        <Ornament className="mt-3" />
        <p className="mt-3 font-display text-sm uppercase tracking-[0.2em] text-ivory sm:text-base">
          <T t={wedding.dateLabel} hiClass="text-lg sm:text-xl" />
        </p>
        <ExternalLink
          href={links.map}
          className="mt-1 inline-flex min-h-8 items-center gap-1 text-sm text-ivory/75 underline decoration-gold/40 decoration-dotted underline-offset-4 hover:text-gold-light sm:text-base"
        >
          <PinIcon className="h-4 w-4" /> <T t={wedding.city} />
        </ExternalLink>
      </div>

      {/* Couple portraits */}
      <div className="relative mt-auto flex items-end justify-center pt-6">
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon-deep to-transparent" />
        <div className="absolute bottom-[4%] left-1/2 h-[60%] w-[min(90vw,560px)] -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
        <Image
          src={groom}
          alt={`${wedding.groom.name.en} (${wedding.groom.name.hi}), the groom`}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 260px, 40vw"
          className={`${groomH} relative z-10 w-auto animate-float drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)] [animation-delay:-3s]`}
        />
        <Image
          src={bride}
          alt={`${wedding.bride.name.en} (${wedding.bride.name.hi}), the bride`}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 420px, 55vw"
          className={`${brideH} relative -ml-4 w-auto animate-float drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)] sm:-ml-6`}
        />
      </div>

      <div className="relative bg-maroon-deep px-4 pb-12 pt-2 sm:pb-14">
        <p className="mb-4 text-center font-script text-3xl text-gold-light sm:text-4xl">
          <T t={ui.countdown.title} hiClass="font-serif text-xl" />
        </p>
        <Countdown date={wedding.date} labels={ui.countdown} />
        <div className="mt-6 text-center">
          <DownloadCard images={cardImages} className="min-h-11 px-5 text-sm sm:text-base" />
        </div>
      </div>
    </section>
  );
}

function PalaceSilhouette() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 -z-10 h-[45%] w-full text-maroon-deep opacity-80"
      fill="currentColor"
    >
      <path d="M0 300 V210 H80 V170 Q110 120 140 170 V210 H230 V150 H250 Q300 70 350 150 H370 V210 H450 V120 Q450 60 520 40 Q560 0 600 0 Q640 0 680 40 Q750 60 750 120 V210 H830 V150 H850 Q900 70 950 150 H970 V210 H1060 V170 Q1090 120 1120 170 V210 H1200 V300 Z" />
      <g fill="#d4a24c" opacity="0.35">
        <rect x="585" y="140" width="30" height="50" rx="15" />
        <rect x="290" y="170" width="20" height="34" rx="10" />
        <rect x="890" y="170" width="20" height="34" rx="10" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Couple ───────────────────────── */

function Couple() {
  const people = [
    { ...wedding.groom, role: ui.couple.groom, img: groom, h: "h-[94%]" },
    { ...wedding.bride, role: ui.couple.bride, img: bride, h: "h-[82%]" },
  ];
  const couplePhoto = optionalImage("/images/couple/couple.png");

  return (
    <section id="couple" className="bg-paper relative px-4 py-16 sm:py-24">
      <Scallop className="text-maroon-deep" />
      <SectionTitle eyebrow={ui.couple.eyebrow} title={ui.couple.title} />

      <div className="reveal relative mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:gap-10">
        {/* Gold heart medallion between the two portraits */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[38%] z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border-2 border-gold bg-ivory text-crimson shadow-lg shadow-maroon/30 sm:top-[42%] sm:h-16 sm:w-16"
        >
          <HeartIcon className="h-5 w-5 fill-current sm:h-7 sm:w-7" />
        </div>
        {people.map((p) => (
          <article key={p.role.en} className="text-center">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-t-full border-[3px] border-gold/70 bg-gradient-to-b from-crimson to-maroon-deep shadow-xl shadow-maroon/25 ring-1 ring-gold/40 ring-offset-4 ring-offset-ivory sm:border-4">
              <div className="bg-jaali absolute inset-0" />
              <Image
                src={p.img}
                alt={`${p.name.en} (${p.name.hi}), ${p.role.en.toLowerCase()}`}
                sizes="(min-width: 640px) 300px, 45vw"
                className={`absolute inset-x-0 bottom-0 mx-auto ${p.h} w-auto object-contain object-bottom`}
              />
            </div>
            <p className="mt-4 font-display text-[0.65rem] uppercase tracking-[0.3em] text-crimson/80 sm:mt-5 sm:text-xs">
              <T t={p.role} hiClass="text-sm sm:text-base" />
            </p>
            <h3 className="font-script text-4xl text-maroon sm:text-5xl">
              <T t={p.name} hiClass="inline-block py-1 text-3xl sm:text-4xl" />
            </h3>
          </article>
        ))}
      </div>

      {couplePhoto && (
        <div className="relative mx-auto mt-14 aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full border-4 border-gold/70 shadow-xl sm:aspect-[4/3] sm:max-w-2xl sm:rounded-3xl">
          <Image
            src={couplePhoto}
            alt={`${wedding.groom.name.en} and ${wedding.bride.name.en}`}
            fill
            sizes="(min-width: 640px) 672px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <blockquote className="reveal relative mx-auto mt-12 max-w-xl rounded-2xl border border-gold/40 bg-white/40 px-6 pb-6 pt-8 text-center text-lg italic leading-relaxed text-ink/80 shadow-sm sm:mt-16 sm:text-xl">
        <span aria-hidden="true" className="absolute -top-5 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border border-gold/50 bg-maroon pt-3 font-serif text-4xl leading-none text-gold-light shadow-md">
          &ldquo;
        </span>
        <T t={ui.couple.quote} hiClass="not-italic leading-loose" />
      </blockquote>
    </section>
  );
}

/* ───────────────────────── Events ───────────────────────── */

function Events() {
  return (
    <section id="events" className="bg-palace relative isolate px-4 py-16 text-ivory sm:py-24">
      <div className="bg-jaali absolute inset-0 -z-10" />
      <Scallop className="text-ivory" />
      <SectionTitle eyebrow={ui.events.eyebrow} title={ui.events.title} light />
      {/* Phones: swipeable row with the next card peeking in. Larger screens: grid. */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-auto sm:grid sm:max-w-6xl sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {wedding.events.map((e, i) => (
          <EventCard key={e.key} event={e} index={i} />
        ))}
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm italic text-ivory/60 sm:hidden">
        <T t={ui.events.swipe} hiClass="not-italic" />
        <span aria-hidden="true" className="not-italic">→</span>
      </p>
    </section>
  );
}

function EventCard({ event: e, index }: { event: WeddingEvent; index: number }) {
  const img = optionalImage(e.image);
  return (
    <article className="reveal group w-[82%] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl border border-gold/40 bg-maroon-deep/70 shadow-lg shadow-black/30 backdrop-blur-sm sm:w-auto sm:max-w-none">
      <span className="sr-only">{`${index + 1} of ${wedding.events.length}`}</span>
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${e.tone} sm:aspect-[4/3]`}>
        {img ? (
          <Image
            src={img}
            alt={`${e.name.en} ceremony`}
            fill
            sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="bg-jaali absolute inset-0 grid place-items-center">
            <span className="font-script text-6xl text-white/90 drop-shadow-lg">
              <T t={e.name} hiClass="py-2 text-5xl" />
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 font-display text-xs tracking-wider text-gold-light backdrop-blur">
          <T t={e.date} hiClass="text-sm" />
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl text-gold-light">
          <T t={e.name} />
        </h3>
        <p className="italic text-ivory/75">
          <T t={e.tagline} hiClass="not-italic" />
        </p>
        <dl className="mt-4 space-y-1.5 text-[0.95rem]">
          <Row label={ui.events.time} value={e.time} />
          <Row label={ui.events.venue} value={e.venue} href={links.map} />
          <Row label={ui.events.dress} value={e.dress} />
        </dl>
      </div>
    </article>
  );
}

function Row({ label, value, href }: { label: L; value: L; href?: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-14 shrink-0 font-display text-xs uppercase leading-6 tracking-wider text-gold/90">
        <T t={label} hiClass="text-sm" />
      </dt>
      <dd className="text-ivory/90">
        {href ? (
          <ExternalLink
            href={href}
            className="inline-flex items-center gap-1 text-gold-light underline decoration-gold/50 decoration-dotted underline-offset-4 hover:decoration-gold-light"
          >
            <T t={value} />
            <PinIcon className="h-3.5 w-3.5" />
          </ExternalLink>
        ) : (
          <T t={value} />
        )}
      </dd>
    </div>
  );
}

/** Link that opens in a new tab (maps, WhatsApp) */
function ExternalLink({ href, className, children, label }: { href: string; className?: string; children: React.ReactNode; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      {children}
    </a>
  );
}

/* ───────────────────────── Venue ───────────────────────── */

function Venue() {
  const mandap = optionalImage("/images/palace/mandap.webp");
  return (
    <section id="venue" className="bg-paper relative px-4 py-16 sm:py-24">
      <Scallop className="text-maroon-deep" />
      <SectionTitle eyebrow={ui.venue.eyebrow} title={ui.venue.title} />
      <div className="reveal mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <ExternalLink
          href={links.map}
          label={`${wedding.venue.name.en} — open in Google Maps`}
          className="group relative mx-auto block aspect-[4/3] w-full max-w-md overflow-hidden rounded-t-[9rem] border-4 border-gold/70 bg-palace shadow-xl shadow-maroon/25 transition hover:shadow-2xl sm:rounded-t-[12rem] md:max-w-none"
        >
          {mandap ? (
            <Image src={mandap} alt="" fill sizes="(min-width:768px) 480px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <>
              <div className="bg-jaali absolute inset-0" />
              <MandapIllustration />
            </>
          )}
        </ExternalLink>
        <div className="text-center md:text-left">
          <ExternalLink href={links.map} className="group inline-block">
            <h3 className="font-display text-3xl text-maroon underline decoration-gold/0 underline-offset-8 transition group-hover:decoration-gold sm:text-4xl">
              <T t={wedding.venue.name} />
            </h3>
            <p className="mt-2 inline-flex items-center gap-1.5 text-lg text-ink/80">
              <PinIcon className="h-4 w-4 text-crimson" />
              <T t={wedding.venue.address} />
            </p>
          </ExternalLink>
          <p className="mt-4 text-ink/70">
            <T t={ui.venue.note} hiClass="leading-relaxed" />
          </p>
          <ExternalLink
            href={links.map}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-7 font-display tracking-wide text-gold-light shadow-lg shadow-maroon/30 transition hover:bg-crimson active:scale-95"
          >
            <PinIcon /> <T t={ui.venue.directions} />
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── RSVP ───────────────────────── */

function Rsvp() {
  const btn =
    "min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-light to-gold px-7 font-display font-bold tracking-wide text-maroon-deep shadow-lg shadow-black/30 transition hover:brightness-110 active:scale-95";

  return (
    <section id="rsvp" className="bg-palace relative isolate px-4 py-16 text-center text-ivory sm:py-24">
      <div className="bg-jaali absolute inset-0 -z-10" />
      <Scallop className="text-ivory" />
      <SectionTitle eyebrow={ui.rsvp.eyebrow} title={ui.rsvp.title} light />
      <p className="reveal mx-auto max-w-lg text-lg text-ivory/85">
        <T t={ui.rsvp.before} /> <T t={wedding.rsvp.deadline} enClass="text-gold-light" hiClass="text-gold-light" />
        <T t={ui.rsvp.after} />
      </p>
      <div className="reveal mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        {/* One button per language so the pre-filled WhatsApp message matches */}
        <a lang="en" href={links.whatsapp("en")} target="_blank" rel="noopener noreferrer" className={`i18n-en inline-flex ${btn}`}>
          <ChatIcon /> {ui.rsvp.whatsapp.en}
        </a>
        <a lang="hi" href={links.whatsapp("hi")} target="_blank" rel="noopener noreferrer" className={`i18n-hi inline-flex ${btn}`}>
          <ChatIcon /> {ui.rsvp.whatsapp.hi}
        </a>
        <a
          href={links.tel}
          aria-label={`${ui.rsvp.call.en} ${wedding.rsvp.phone}`}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gold/70 px-7 font-display tracking-wide text-gold-light transition hover:bg-gold/10 active:scale-95"
        >
          <PhoneIcon /> {wedding.rsvp.phone}
        </a>
      </div>
      <DownloadCard images={cardImages} variant="outline" className="mt-4 w-full max-w-md sm:w-auto" />
    </section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

function Footer() {
  return (
    <footer className="bg-maroon-deep px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-10 text-center text-ivory/70 sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <p className="font-script text-4xl text-gold-light">
        <T
          t={{
            en: `${wedding.groom.name.en} & ${wedding.bride.name.en}`,
            hi: `${wedding.groom.name.hi} संग ${wedding.bride.name.hi}`,
          }}
          hiClass="inline-block py-1 text-3xl"
        />
      </p>
      <Ornament className="mt-2 opacity-70" />
      <p className="mt-3 font-display text-xs uppercase tracking-[0.25em]">
        <T t={wedding.dateLabel} hiClass="text-base" />
      </p>
      <p className="mt-4 text-sm">
        <T t={ui.footer.blessings} />
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <ExternalLink href={links.map} className="inline-flex min-h-11 items-center gap-1.5 text-gold-light/90 hover:text-gold-light">
          <PinIcon className="h-4 w-4" /> <T t={wedding.venue.name} />
        </ExternalLink>
        <a href={links.tel} className="inline-flex min-h-11 items-center gap-1.5 text-gold-light/90 hover:text-gold-light">
          <PhoneIcon className="h-4 w-4" /> {wedding.rsvp.phone}
        </a>
      </div>
    </footer>
  );
}

/* ───────────────────────── Icons & art ───────────────────────── */

type IconProps = { className?: string };

function PinIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function ChatIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 4 4 7.3 4c2 0 3.5 1.1 4.7 2.8C13.2 5.1 14.7 4 16.7 4 20 4 22.4 7.2 21.2 10.6 19.5 15.4 12 20 12 20Z" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function LetterIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" strokeLinejoin="round" />
    </svg>
  );
}

/** Gold line-art mandap, shown until a real venue photo is added */
function MandapIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full text-gold"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <defs>
        <radialGradient id="mandap-glow" cx="50%" cy="70%" r="50%">
          <stop offset="0" stopColor="#f3d58a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f3d58a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="215" rx="190" ry="110" fill="url(#mandap-glow)" stroke="none" />
      {/* dome & canopy */}
      <path d="M150 92 Q200 30 250 92" strokeWidth="2" />
      <path d="M200 30 V24" strokeWidth="2" />
      <circle cx="200" cy="19" r="5" fill="currentColor" stroke="none" />
      <path d="M110 92 H290 L300 104 H100 Z" strokeWidth="2" fill="#3a060d" fillOpacity="0.4" />
      {/* hanging garlands */}
      <path d="M112 106 Q140 130 168 106 Q200 132 232 106 Q260 130 288 106" strokeWidth="1.5" strokeDasharray="1 5" />
      {[126, 154, 200, 246, 274].map((x) => (
        <g key={x}>
          <path d={`M${x} 108 V${x === 200 ? 140 : 128}`} strokeWidth="1" />
          <circle cx={x} cy={x === 200 ? 144 : 132} r="3" fill="currentColor" stroke="none" />
        </g>
      ))}
      {/* pillars */}
      {[118, 282].map((x) => (
        <g key={x} strokeWidth="2">
          <path d={`M${x - 8} 104 V240 M${x + 8} 104 V240`} />
          <path d={`M${x - 12} 104 H${x + 12} M${x - 12} 240 H${x + 12}`} />
          <path d={`M${x - 8} 150 H${x + 8} M${x - 8} 196 H${x + 8}`} strokeWidth="1" />
        </g>
      ))}
      {/* steps */}
      <path d="M90 240 H310 M76 252 H324 M62 264 H338" strokeWidth="2" />
      {/* sacred fire */}
      <path d="M186 240 H214 L210 228 H190 Z" strokeWidth="1.5" fill="#3a060d" fillOpacity="0.5" />
      <path d="M200 226 C190 214 198 204 200 196 C203 206 211 212 200 226 Z" fill="#f59e0b" stroke="#f3d58a" strokeWidth="1" />
      {/* kalash on either side */}
      {[160, 240].map((x) => (
        <g key={x} strokeWidth="1.5">
          <path d={`M${x - 9} 240 Q${x - 13} 226 ${x} 222 Q${x + 13} 226 ${x + 9} 240 Z`} fill="#9b1b2a" fillOpacity="0.6" />
          <path d={`M${x - 6} 222 Q${x} 212 ${x + 6} 222`} />
        </g>
      ))}
    </svg>
  );
}
