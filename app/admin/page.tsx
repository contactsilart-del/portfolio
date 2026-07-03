import type { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Panel admin — SILART",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  // Accessible en ligne (bysilart.fr/admin) — protégé par ADMIN_PASSWORD côté API.
  return <AdminClient />;
}
