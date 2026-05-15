import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Irwan & Anira - Wedding Invitation",
  description: "Undangan pernikahan Irwan Pratomo & Anira Tri Agustini - 5 Juli 2026",
  keywords: ["wedding", "undangan", "pernikahan", "Irwan", "Anira"],
  authors: [{ name: "Irwan & Anira" }],
  icons: {
    icon: "/images/hero-poster.jpg",
  },
  openGraph: {
    title: "Irwan & Anira - Wedding Invitation",
    description: "Undangan pernikahan Irwan Pratomo & Anira Tri Agustini - 5 Juli 2026",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
