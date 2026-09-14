import site from "@/site.config";
import { getBranches, getBrands, getCities, getCategories } from "@/lib/data";

export default async function sitemap() {
  const [branches, brands, cities, cats] = await Promise.all([getBranches(), getBrands(), getCities(), getCategories()]);
  const u = (p, priority) => ({ url: `${site.url}${p}`, priority, changeFrequency: "weekly" });
  const pairs = [...new Set(branches.map((x) => `/${x.brand}/${x.city}`))];
  return [
    u("/", 1),
    ...cats.map((c) => u(`/category/${c.slug}`, 0.8)),
    ...brands.map((b) => u(`/${b.slug}`, 0.8)),
    ...cities.map((c) => u(`/city/${c.slug}`, 0.7)),
    ...pairs.map((p) => u(p, 0.7)),
    ...branches.map((x) => u(`/${x.brand}/${x.city}/${x.slug}`, 0.6)),
  ];
}
