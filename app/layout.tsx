import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SILART — Silas Clamens Albert · Développeur web full-stack",
  description:
    "Portfolio de Silas Clamens Albert (SILART), développeur web full-stack, designer et créatif. Sites sur mesure, e-commerce, branding et audiovisuel. Next.js, React, TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
