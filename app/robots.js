import site from "@/site.config";
export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: "/search" }, sitemap: `${site.url}/sitemap.xml` };
}
