import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { CartProvider } from "@/components/Cart";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/data";
import "./globals.css";

// DM Sans is the closest free match to Halyard Display (the reference font, which is paid):
// same geometric shapes, and within ~2% on letter widths. If you license Halyard via Adobe Fonts, swap it in here.
const display = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

const serif = Instrument_Serif({
  variable: "--font-serif-italic",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" className={`${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <CartProvider>
          <Header />
          <main id="page" className="gutter pt-[calc(var(--header-h)+40px)] max-xl:pt-[calc(var(--header-h)+35px)]">
            {children}
          </main>
          <Footer />
          {/* AI assistant is built (components/AskAI.tsx + api/chat) but hidden for now — swap back in when ready */}
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
