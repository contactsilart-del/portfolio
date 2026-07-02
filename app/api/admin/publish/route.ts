import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { adminForbidden, ROOT } from "../admin-utils";

function git(cmd: string): string {
  return execSync(`git ${cmd}`, {
    cwd: ROOT,
    env: { ...process.env, GIT_SSH_COMMAND: "ssh -o StrictHostKeyChecking=no" },
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120_000,
  }).toString();
}

export async function POST() {
  if (adminForbidden()) {
    return NextResponse.json({ error: "Panel admin désactivé en production." }, { status: 404 });
  }

  try {
    git("add -A");
    const status = git("status --porcelain").trim();
    if (!status) {
      return NextResponse.json({ message: "Aucun changement à publier — le site en ligne est déjà à jour." });
    }
    git('commit -m "Mise a jour des images (panel admin)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"');
    git("push");
    return NextResponse.json({
      message: "Publié ✓ Vercel déploie — bysilart.fr sera à jour dans ~1 minute.",
    });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Échec de la publication : ${detail.slice(0, 300)}` },
      { status: 500 }
    );
  }
}
