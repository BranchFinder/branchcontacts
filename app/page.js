import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import JsonLd from "@/components/JsonLd";
import site from "@/site.config";
import { getCategories, getBrands, getCities, getBranches } from "@/lib/data";

const catIcons = { banks:"🏦", restaurants:"🍔", hospitals:"🏥", couriers:"📦", pharmacies:"💊" };
const catColors = {
  banks:"from-blue-500 to-blue-700",
  restaurants:"from-orange-400 to-red-600",
  hospitals:"from-green-500 to-emerald-700",
  couriers:"from-purple-500 to-purple-700",
  pharmacies:"from-pink-500 to-rose-700",
};

export default async function Home() {
  const [cats, brands, cities, branches] = await Promise.all([
    getCategories(), getBrands(), getCities(), getBranches()
  ]);
  const count = (f) => branches.filter(f).length;
  const topBrands = brands.slice(0, 8);

  return (
    <>
      <JsonLd data={{
        "@context":"https://schema.org","@type":"WebSite",name:site.name,url:site.url,
        potentialAction:{"@type":"SearchAction",target:`${site.url}/search?q={q}`,"query-input":"required name=q"},
      }} />

      {/* ── HERO ── */}
      <section className="gradient-hero rounded-2xl px-6 py-14 sm:py-20 text-white mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:"radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",backgroundSize:"40px 40px"}} />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            <span>🇵🇰</span> Pakistan's Branch Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Find any branch<br />contact in Pakistan
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl">
            {branches.length.toLocaleString()} branches across {cities.length} cities — phone numbers, WhatsApp, addresses and opening hours.
          </p>
          <SearchBox large />
          <p className="mt-4 text-sm text-white/60">
            Try: <span className="text-white/80">HBL Gulberg</span> · <span className="text-white/80">KFC Karachi</span> · <span className="text-white/80">Meezan Bank Lahore</span>
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        {[
          { n: branches.length.toLocaleString(), label:"Total Branches" },
          { n: brands.length.toString(), label:"Brands Listed" },
          { n: cities.length.toString(), label:"Cities Covered" },
        ].map((s)=>(
          <div key={s.label} className="bg-mist rounded-xl p-5 text-center border border-line">
            <div className="text-3xl font-black text-pine">{s.n}</div>
            <div className="text-sm text-ink/60 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ── */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-1">Browse by type</h2>
        <p className="text-ink/60 mb-5 text-sm">Banks, restaurants, hospitals and more — all in one place</p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {cats.map((c) => {
            const total = count((b) => brands.find((x) => x.slug === b.brand)?.category === c.slug);
            return (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`}
                  className="card-hover block rounded-2xl bg-gradient-to-br p-6 text-white shadow-card overflow-hidden relative"
                  style={{background: c.slug==="banks"?"linear-gradient(135deg,#2563eb,#1e40af)":
                    c.slug==="restaurants"?"linear-gradient(135deg,#f97316,#dc2626)":
                    c.slug==="hospitals"?"linear-gradient(135deg,#10b981,#065f46)":
                    c.slug==="couriers"?"linear-gradient(135deg,#8b5cf6,#5b21b6)":
                    "linear-gradient(135deg,#ec4899,#be185d)"}}>
                  <div className="text-4xl mb-3">{catIcons[c.slug]||"📍"}</div>
                  <div className="font-black text-xl">{c.name}</div>
                  <div className="text-sm text-white/70 mt-1">{total} branches · {c.blurb}</div>
                  <div className="absolute right-4 bottom-4 text-5xl opacity-10">{catIcons[c.slug]}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── POPULAR BRANDS ── */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-1">Popular brands</h2>
        <p className="text-ink/60 mb-5 text-sm">Tap any brand to browse its branches by city</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {topBrands.map((b) => (
            <li key={b.slug}>
              <Link href={`/${b.slug}`}
                className="card-hover flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-card">
                <div className="w-10 h-10 rounded-lg bg-mist flex items-center justify-center text-xl shrink-0">
                  {catIcons[b.category]||"📍"}
                </div>
                <div>
                  <div className="font-bold text-sm">{b.name}</div>
                  <div className="text-xs text-ink/50">{count((x)=>x.brand===b.slug)} branches</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {brands.length > 8 && (
          <Link href="/category/banks" className="mt-4 inline-flex items-center gap-1 text-pine font-semibold text-sm hover:underline">
            View all brands →
          </Link>
        )}
      </section>

      {/* ── CITIES ── */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-1">Browse by city</h2>
        <p className="text-ink/60 mb-5 text-sm">Find branches in your city</p>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link key={c.slug} href={`/city/${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-pine hover:text-pine hover:bg-pinelite transition-colors shadow-sm">
              📍 {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="rounded-2xl bg-mist border border-line p-8 mb-4">
        <h2 className="text-2xl font-black mb-6 text-center">Why BranchContacts?</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon:"📞", title:"Phone & WhatsApp", desc:"Direct call and WhatsApp links for every branch — one tap to connect." },
            { icon:"📍", title:"Exact Location", desc:"Google Maps integration for turn-by-turn directions to any branch." },
            { icon:"🕐", title:"Opening Hours", desc:"Know before you go — check branch timings including Saturdays." },
          ].map((f)=>(
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <div className="font-bold mb-1">{f.title}</div>
              <div className="text-sm text-ink/60">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
