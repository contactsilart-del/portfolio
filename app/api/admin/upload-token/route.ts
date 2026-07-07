import { NextResponse } from "next/server";
import path from "path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { blobConfigured, passwordConfigured, verifierMotDePasse } from "../admin-utils";

/**
 * Upload DIRECT navigateur → Vercel Blob.
 * Les fonctions Vercel refusent les corps de requête > 4,5 Mo : les photos
 * ne peuvent donc pas transiter par le serveur. Cette route ne délivre
 * qu'un jeton signé (après vérification du mot de passe) ; le fichier part
 * ensuite du navigateur directement vers le Blob, jusqu'à 25 Mo.
 * Le manifeste est mis à jour ensuite par /api/admin/attach.
 */

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);
const CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];
const MAX_SIZE = 25 * 1024 * 1024; // 25 Mo

export async function POST(req: Request) {
  if (!passwordConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD non configuré." }, { status: 503 });
  }
  if (!blobConfigured()) {
    return NextResponse.json(
      { error: "Stockage Vercel Blob non configuré." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let mdp = "";
        try {
          mdp = (JSON.parse(clientPayload ?? "{}") as { mdp?: string }).mdp ?? "";
        } catch {}
        if (!verifierMotDePasse(mdp)) {
          throw new Error("Mot de passe incorrect.");
        }
        const ext = path.extname(pathname).toLowerCase();
        if (!pathname.startsWith("images/") || !EXTENSIONS.has(ext)) {
          throw new Error(
            `Format non supporté (${ext || "sans extension"}). Utilise jpg, png, webp, gif, avif ou svg.`
          );
        }
        return {
          allowedContentTypes: CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
        };
      },
      // Le panel appelle /api/admin/attach après l'upload : rien à faire ici.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur pendant l'upload." },
      { status: 400 }
    );
  }
}
