import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
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
    <html lang="fr" className={kanit.variable}>
      <body>{children}</body>
    </html>
  );
}
