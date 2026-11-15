import type { MetadataRoute } from "next";
import { fields } from "@/lib/fields";
import { institutions, programs } from "@/lib/majors";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/mayadin", "/takhasus", "/hasiba", "/jamiat", "/hayat", "/sanawat"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const fieldPages = fields.map((field) => ({
    url: `${base}/mayadin/${field.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const programPages = programs.map((program) => ({
    url: `${base}/takhasus/${program.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const institutionPages = institutions.map((institution) => ({
    url: `${base}/jamiat/${institution.code}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...fieldPages, ...programPages, ...institutionPages];
}
