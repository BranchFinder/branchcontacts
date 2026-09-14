import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import Tile from "@/components/Tile";
import JsonLd from "@/components/JsonLd";
import site from "@/site.config";
import { getBrands, getBrand, getCities, getCategory, branchesFor } from "@/lib/data";

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ brand: b.slug }));
}
export async function generateMetadata({ params }) {
  const b = await getBrand(params.brand);
  if (!b) return {};
  return { title: `${b.name} branches in Pakistan — addresses & phone numbers`, description: `Complete list of ${b.fullName} branches across Pakistan with phone numbers, ${b.category === "banks" ? "branch codes, " : ""}opening hours and directions.` };
}

export default async function BrandPage({ params }) {
  const b = await getBrand(params.brand);
  if (!b) notFound();
  const [cat, cities, branches] = await Promise.all([getCategory(b.category), getCities(), branchesFor({ brand: b.slug })]);
  const withBranches = cities.filter((c) => branches.some((x) => x.city === c.slug));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: b.fullName, url: b.website, telephone: b.helpline }} />
      <Crumbs items={[{ label: cat?.name, href: `/category/${b.category}` }, { label: b.name }]} />
      <h1 className="text-3xl font-extrabold">{b.name} branches in Pakistan</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{b.blurb} {branches.length} branches listed in {withBranches.length} cities.</p>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {b.helpline && <div><dt className="text-ink/60">Helpline</dt><dd><a href={`tel:${b.helpline}`} className="font-semibold text-pine">{b.helpline}</a></dd></div>}
        {b.website && <div><dt className="text-ink/60">Website</dt><dd><a href={b.website} rel="nofollow noopener" className="font-semibold text-pine">{b.website.replace(/^https?:\/\//, "")}</a></dd></div>}
      </dl>
      <h2 className="mt-8 text-xl font-bold">Choose a city</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {withBranches.map((c) => (
          <li key={c.slug}><Tile href={`/${b.slug}/${c.slug}`} title={c.name} sub={`${branches.filter((x) => x.city === c.slug).length} branches`} /></li>
        ))}
      </ul>
    </>
  );
}
