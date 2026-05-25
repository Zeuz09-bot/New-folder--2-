import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ILEYA FEST with SAMAD — Premium Event Tickets",
  description:
    "Get your tickets for ILEYA FEST with SAMAD — the biggest celebration of the year! May 28th, 2026 at GT Hotel and Event Center, Ikire, Osun State. Featuring live performances, premium experiences, and unforgettable entertainment.",
  keywords: [
    "ILEYA FEST",
    "SAMAD",
    "concert tickets",
    "Ikire",
    "Osun State",
    "GT Hotel",
    "event tickets",
    "Nigerian concert",
    "live music",
  ],
  openGraph: {
    title: "ILEYA FEST with SAMAD — Premium Event Tickets",
    description:
      "The biggest celebration of the year! May 28th, 2026 at GT Hotel and Event Center, Ikire.",
    type: "website",
    locale: "en_NG",
    siteName: "ILEYA FEST",
  },
  twitter: {
    card: "summary_large_image",
    title: "ILEYA FEST with SAMAD — Get Your Tickets Now",
    description:
      "The biggest celebration of the year! May 28th, 2026 at GT Hotel and Event Center, Ikire.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen bg-black text-white">{children}</body>
    </html>
  );
}
