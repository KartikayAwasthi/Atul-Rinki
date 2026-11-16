import type { Metadata, Viewport } from "next";
import {
  Cinzel_Decorative,
  Cormorant_Garamond,
  Great_Vibes,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import { langInitScript } from "@/lib/lang";
import { wedding } from "@/lib/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const vibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: "400",
});

const hindi = Tiro_Devanagari_Hindi({
  variable: "--font-hindi",
  subsets: ["devanagari", "latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const { groom, bride, dateLabel, city } = wedding;
const coupleEn = `${groom.name.en} & ${bride.name.en}`;
const coupleHi = `${groom.name.hi} और ${bride.name.hi}`;

export const metadata: Metadata = {
  title: `${coupleEn} — Wedding · ${coupleHi} — शुभ विवाह`,
  description: `Join us for the wedding of ${coupleEn} on ${dateLabel.en} in ${city.en}. ${coupleHi} के शुभ विवाह में आप सादर आमंत्रित हैं — ${dateLabel.hi}।`,
  openGraph: {
    title: `${coupleEn} are getting married! · ${coupleHi} का शुभ विवाह`,
    description: `${dateLabel.en} · ${city.en}`,
    images: ["/images/couple/bride.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3a060d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${cinzel.variable} ${vibes.variable} ${hindi.variable} antialiased`}
    >
      <body className="min-h-svh font-serif">
        {/* Apply saved language before first paint (no flash) */}
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: langInitScript }}
        />
        {children}
      </body>
    </html>
  );
}
