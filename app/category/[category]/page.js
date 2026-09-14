import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import Tile from "@/components/Tile";
import { getCategories, getCategory, getBrands, getBranches } from "@/lib/data";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}
export async function generateMetadata({ params }) {
  const c = await getCategory(params.category);
  if (!c) return {};
  return { title: `${c.name} in Pakistan — all branches`, description: `Every ${c.name.toLowerCase()} brand in Pakistan with branch addresses, phone numbers and opening hours.` };
}

export default async function CategoryPage({ params }) {
  const c = await getCategory(params.category);
  if (!c) notFound();
  const brands = (await getBrands()).filter((b) => b.category === c.slug);
  const branches = await getBranches();
  return (
    <>
      <Crumbs items={[{ label: c.name }]} />
      <h1 className="text-3xl font-extrabold">{c.name} in Pakistan</h1>
      <p className="mt-2 text-ink/70">{c.blurb}. Pick a brand to see its branches by city.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {brands.map((b) => (
          <li key={b.slug}><Tile href={`/${b.slug}`} title={b.name} sub={`${branches.filter((x) => x.brand === b.slug).length} branches`} /></li>
        ))}
      </ul>
    </>
  );
}
