import SearchBox from "@/components/SearchBox";
import BranchCard from "@/components/BranchCard";
import { searchBranches, getBranches, getCities, distanceKm } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search branches", robots: { index: false } };

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || "";
  const lat = parseFloat(searchParams.lat), lng = parseFloat(searchParams.lng);
  const nearMode = !isNaN(lat) && !isNaN(lng);
  const cities = Object.fromEntries((await getCities()).map((c) => [c.slug, c]));

  let results = q ? await searchBranches(q) : nearMode ? await getBranches() : [];
  if (nearMode) {
    results = results
      .map((x) => ({ ...x, distance: distanceKm(lat, lng, x.lat, x.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 30);
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold">{nearMode ? "Branches near you" : q ? `Results for “${q}”` : "Search"}</h1>
      <div className="mt-4"><SearchBox initial={q} /></div>
      {results.length === 0 ? (
        <p className="mt-8 text-ink/70">{q ? "No branches match that. Try a brand name plus a city, like “UBL Lahore”." : "Type a brand, city or area to begin."}</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {results.map((x) => <BranchCard key={`${x.brand}-${x.city}-${x.slug}`} b={x} city={cities[x.city]} distance={x.distance} />)}
        </ul>
      )}
    </>
  );
}
