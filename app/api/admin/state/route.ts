import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { adminForbidden, readManifest, ROOT } from "../admin-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  if (adminForbidden()) {
    return NextResponse.json({ error: "Panel admin désactivé en production." }, { status: 404 });
  }

  let pending: string[] = [];
  try {
    pending = execSync("git status --porcelain", { cwd: ROOT })
      .toString()
      .split("\n")
      .filter(Boolean);
  } catch {
    // git indisponible : on affiche quand même le manifeste
  }

  return NextResponse.json({ manifest: readManifest(), pending });
}
