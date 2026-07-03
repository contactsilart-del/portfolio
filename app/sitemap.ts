import type { MetadataRoute } from "next";
import { getProjets } from "@/app/data/projets-server";
import { site } from "@/app/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projets = await getProjets();
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projets.map((p) => ({
      url: `${site.url}/projets/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
