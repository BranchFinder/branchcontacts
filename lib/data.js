import categoriesJson from "@/data/categories.json";
import brandsJson from "@/data/brands.json";
import citiesJson from "@/data/cities.json";
import branchesJson from "@/data/branches.json";

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const useSupabase = Boolean(SUPA_URL && SUPA_KEY);

async function supa(table, query = "") {
  const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status}`);
  return res.json();
}

const fromRow = (r) => ({
  ...r,
  fullName: r.full_name ?? r.fullName,
  branchCode: r.branch_code ?? r.branchCode,
  features: r.features ?? [],
});

export async function getCategories() {
  return useSupabase ? (await supa("categories","order=name")).map(fromRow) : categoriesJson;
}
export async function getBrands() {
  return useSupabase ? (await supa("brands","order=name")).map(fromRow) : brandsJson;
}
export async function getBranches() {
  return useSupabase ? (await supa("branches","order=name&limit=100000")).map(fromRow) : branchesJson;
}

// ── شہر: cities.json + branches.json سے خود بنائیں ──
export async function getCities() {
  const base = useSupabase
    ? (await supa("cities","order=name")).map(fromRow)
    : citiesJson;

  // branches.json میں جو شہر ہیں مگر cities.json میں نہیں — انہیں خود بنا لو
  const branches = await getBranches();
  const known = new Set(base.map(c => c.slug));
  const extra = [];
  const seen = new Set();

  for (const b of branches) {
    if (!b.city) continue;
    const slug = b.city.toLowerCase().trim();
    if (known.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    // slug سے نام بناؤ: abbottabad → Abbottabad
    const name = slug.split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    extra.push({ slug, name, province: "Pakistan", lat: b.lat || 30.3753, lng: b.lng || 69.3451 });
  }

  return [...base, ...extra].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getBrand(slug) {
  if (!slug) return null;
  return (await getBrands()).find(b => b.slug === slug) || null;
}

export async function getCity(slug) {
  if (!slug) return null;
  const list = await getCities();
  return list.find(c => c.slug === slug) || {
    slug,
    name: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    province: "Pakistan", lat: 30.3753, lng: 69.3451
  };
}

export async function getCategory(slug) {
  if (!slug) return null;
  return (await getCategories()).find(c => c.slug === slug) || null;
}

export async function getBranch(brand, city, slug) {
  if (!brand || !city || !slug) return null;
  return (await getBranches()).find(x => x.brand === brand && x.city === city && x.slug === slug) || null;
}

export async function branchesFor({ brand, city, category } = {}) {
  let list = await getBranches();
  if (category) {
    const brandSlugs = new Set((await getBrands()).filter(b => b.category === category).map(b => b.slug));
    list = list.filter(x => brandSlugs.has(x.brand));
  }
  if (brand) list = list.filter(x => x.brand === brand);
  if (city) list = list.filter(x => x.city === city);
  return list;
}

export async function searchBranches(q) {
  const term = (q || "").trim().toLowerCase();
  if (!term) return [];
  const words = term.split(/\s+/);
  const brands = await getBrands();
  const cities = await getCities();
  const bMap = Object.fromEntries(brands.map(b => [b.slug, b]));
  const cMap = Object.fromEntries(cities.map(c => [c.slug, c]));
  return (await getBranches())
    .filter(x => {
      const hay = [x.name, x.address, x.branchCode, bMap[x.brand]?.name, bMap[x.brand]?.fullName, cMap[x.city]?.name]
        .join(" ").toLowerCase();
      return words.every(w => hay.includes(w));
    })
    .slice(0, 60);
}

export function distanceKm(aLat, aLng, bLat, bLng) {
  const R = 6371, toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat), dLng = toRad(bLng - aLng);
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
