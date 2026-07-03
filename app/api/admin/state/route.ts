import { NextResponse } from "next/server";
import { checkAuth, configuration, lireManifest } from "../admin-utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const err = checkAuth(req);
  if (err) {
    return NextResponse.json(
      { error: err.error, configured: configuration() },
      { status: err.status }
    );
  }
  return NextResponse.json({
    manifest: await lireManifest(),
    configured: configuration(),
  });
}
