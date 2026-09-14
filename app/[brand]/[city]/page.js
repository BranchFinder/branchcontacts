import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import BranchCard from "@/components/BranchCard";
import { getBranches, getBrand, getCity, branchesFor } from "@/lib/data";

export async function generateStaticParams() {
  const seen = new Set();
  return (await getBranches())
    .filter((x) => !seen.has(x.brand + x.city) && seen.add(x.brand + x.city))
    .map((x) => ({ brand: x.brand, city: x.city }));
}
export async function generateMetadata({ params }) {
  const [b, c] = await Promise.all([getBrand(params.brand), getCity(params.city)]);
  if (!b || !c) return {};
  return { title: `${b.name} branches in ${c.name} — phone numbers & addresses`, description: `All ${b.name} branches in ${c.name}: addresses, contact numbers, ${b.category === "banks" ? "branch codes, " : ""}opening hours and map directions.` };
}

export default async function BrandCityPage({ params }) {
  const [b, c] = await Promise.all([getBrand(params.brand), getCity(params.city)]);
  if (!b || !c) notFound();
  const branches = await branchesFor({ brand: b.slug, city: c.slug });
  if (!branches.length) notFound();
  return (
    <>
      <Crumbs items={[{ label: b.name, href: `/${b.slug}` }, { label: c.name }]} />
      <h1 className="text-3xl font-extrabold">{b.name} branches in {c.name}</h1>
      <p className="mt-2 text-ink/70">{branches.length} {b.name} locations in {c.name}. Tap a number to call.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {branches.map((x) => <BranchCard key={x.slug} b={x} brand={b} />)}
      </ul>
    </>
  );
}
