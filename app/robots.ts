import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://russianhighways.ru/sitemap.xml",
    host: "https://russianhighways.ru",
  };
}
