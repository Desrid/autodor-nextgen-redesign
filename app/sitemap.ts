import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://russianhighways.ru/",
      lastModified: new Date("2026-07-15T00:00:00+03:00"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
