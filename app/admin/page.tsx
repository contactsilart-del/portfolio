import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Panel admin — SILART",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  // Le panel n'existe qu'en développement local : en production (Vercel), 404.
  if (process.env.NODE_ENV === "production") notFound();
  return <AdminClient />;
}
