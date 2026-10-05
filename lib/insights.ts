import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export const insightCategories = [
  "Venture Building",
  "African Innovation",
  "Founder Stories",
  "Technology Commercialisation",
  "AI & Business",
  "Fintech & Infrastructure",
  "Events & Creator Economy",
  "University & Corporate Innovation",
  "Forge Cohort Updates",
  "Portfolio News",
] as const;

export type Insight = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readingTime: number;
  status: "published" | "coming-soon";
  order: number;
  excerpt: string;
  image?: string;
  html: string;
};

const DIR = path.join(process.cwd(), "content", "insights");

export function getInsights(): Insight[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        category: data.category,
        author: data.author || "Coetara Forge",
        date: data.date ? String(data.date) : "",
        readingTime: Number(data.readingTime) || 0,
        status: data.status === "published" ? "published" : "coming-soon",
        order: Number(data.order) || 99,
        excerpt: data.excerpt || "",
        image: data.image || undefined,
        html: marked.parse(content, { async: false }) as string,
      } satisfies Insight;
    })
    .sort((a, b) => a.order - b.order);
}

export function getInsight(slug: string) {
  return getInsights().find((i) => i.slug === slug);
}

export function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? d : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
