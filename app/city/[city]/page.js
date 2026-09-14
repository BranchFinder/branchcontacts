import { notFound } from "next/navigation";
import Crumbs from "@/components/Crumbs";
import Tile from "@/components/Tile";
import { getCities, getCity, getBrands, branchesFor } from "@/lib/data";

export async function generateStaticParams() {
  return (await getCities()).map((c) => ({ city: c.slug }));
}
export async function generateMetadata({ params }) {
  const c = await getCity(params.city);
  if (!c) return {};
  return { title: `Bank, restaurant & hospital branches in ${c.name}`, description: `All listed branches in ${c.name}, ${c.province} — addresses, phone numbers and hours.` };
}

export default async function CityPage({ params }) {
  const c = await getCity(params.city);
  if (!c) notFound();
  const branches = await branchesFor({ city: c.slug });
  const brands = (await getBrands()).filter((b) => branches.some((x) => x.brand === b.slug));
  return (
    <>
      <Crumbs items={[{ label: c.name }]} />
      <h1 className="text-3xl font-extrabold">Branches in {c.name}</h1>
      <p className="mt-2 text-ink/70">{branches.length} branches from {brands.length} brands in {c.name}, {c.province}.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {brands.map((b) => (
          <li key={b.slug}><Tile href={`/${b.slug}/${c.slug}`} title={b.name} sub={`${branches.filter((x) => x.brand === b.slug).length} in ${c.name}`} /></li>
        ))}
      </ul>
    </>
  );
}
