import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { site } from "@/app/data/site";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "SILART — Silas Clamens Albert · Développeur web full-stack",
  description:
    "Portfolio de Silas Clamens Albert (SILART), développeur web full-stack, designer et créatif. Sites sur mesure, e-commerce, branding et audiovisuel. Next.js, React, TypeScript.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SILART — Silas Clamens Albert · Développeur web full-stack",
    description:
      "Sites sur mesure, e-commerce, branding et audiovisuel. Designer · Développeur · Créatif.",
    url: site.url,
    siteName: "SILART",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={kanit.variable}>
      <body>{children}</body>
    </html>
  );
}
