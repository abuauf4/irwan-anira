import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Amiri, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kitab Cinta — Irwan & Anira",
  description: "Undangan pernikahan Kitab Cinta — Irwan Pratomo & Anira Tri Agustini — 5 Juli 2026",
  keywords: ["wedding", "undangan", "pernikahan", "Irwan", "Anira"],
  authors: [{ name: "Irwan & Anira" }],
  icons: {
    icon: "/images/hero-poster.jpg",
  },
  openGraph: {
    title: "Kitab Cinta — Irwan & Anira",
    description: "Undangan pernikahan Kitab Cinta — Irwan Pratomo & Anira Tri Agustini — 5 Juli 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${greatVibes.variable} ${cormorantGaramond.variable} ${amiri.variable} ${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
