import { notFound } from "next/navigation";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import JsonLd from "@/components/JsonLd";
import BranchCard from "@/components/BranchCard";
import site from "@/site.config";
import { formatPhone, waLink } from "@/lib/phone";
import { getBranches, getBranch, getBrand, getCity, branchesFor } from "@/lib/data";

const schemaType = { banks:"BankOrCreditUnion", restaurants:"Restaurant", hospitals:"Hospital", pharmacies:"Pharmacy", couriers:"LocalBusiness" };

export async function generateStaticParams() {
  const [branches, brands, cities] = await Promise.all([getBranches(), getBrand("hbl").then(()=>getBrands()), getCities()]);
  const brandSlugs = new Set((await getBrands()).map(b=>b.slug));
  const citySlugs = new Set((await getCities()).map(c=>c.slug));
  return (await getBranches())
    .filter(x => brandSlugs.has(x.brand) && citySlugs.has(x.city))
    .map(x => ({ brand: x.brand, city: x.city, branch: x.slug }));
}

async function getBrands() { return (await import("@/lib/data")).getBrands(); }
async function getCities() { return (await import("@/lib/data")).getCities(); }

export async function generateMetadata({ params }) {
  const [x, c, b] = await Promise.all([
    getBranch(params.brand, params.city, params.branch),
    getCity(params.city), getBrand(params.brand)
  ]);
  if (!x || !c || !b) return {};
  const phone = formatPhone(x.phone);
  return {
    title: `${x.name}, ${c.name} — phone number, address & hours`,
    description: `${x.name} at ${x.address}, ${c.name}. Phone ${phone}${x.branchCode ? `, branch code ${x.branchCode}` : ""}. ${x.hours}.`,
    alternates: { canonical: `${site.url}/${x.brand}/${x.city}/${x.slug}` },
  };
}

export default async function BranchPage({ params }) {
  const [x, b, c] = await Promise.all([
    getBranch(params.brand, params.city, params.branch),
    getBrand(params.brand), getCity(params.city)
  ]);
  if (!x || !b || !c) notFound();

  const phone = formatPhone(x.phone);
  const contact = formatPhone(x.contactNumber);
  const wa = waLink(x.whatsapp || x.phone);
  const nearby = (await branchesFor({ brand: x.brand, city: x.city }))
    .filter(n => n.slug !== x.slug).slice(0, 4);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${x.lat},${x.lng}`;
  const reportUrl = `mailto:hello@branchcontacts.com?subject=${encodeURIComponent(`Wrong info: ${x.name}, ${c.name}`)}`;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": schemaType[b.category] || "LocalBusiness",
        name: x.name,
        branchOf: { "@type": "Organization", name: b.fullName || b.name, url: b.website },
        telephone: phone,
        address: { "@type": "PostalAddress", streetAddress: x.address, addressLocality: c.name, addressRegion: c.province, addressCountry: "PK" },
        geo: { "@type": "GeoCoordinates", latitude: x.lat, longitude: x.lng },
        openingHours: x.hours,
        url: `${site.url}/${x.brand}/${x.city}/${x.slug}`,
      }} />

      <Crumbs items={[
        { label: b.name, href: `/${b.slug}` },
        { label: c.name, href: `/${b.slug}/${c.slug}` },
        { label: x.name }
      ]} />

      <div className="mb-6">
        <h1 className="text-3xl font-black">{x.name}</h1>
        <p className="mt-1 text-lg text-ink/60">📍 {x.address}, {c.name}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {phone && (
          <a href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-xl bg-pine text-white font-bold px-5 py-3 hover:bg-pinedeep transition-colors">
            📞 Call {phone}
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener"
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp text-white font-bold px-5 py-3 hover:opacity-90 transition-opacity">
            💬 WhatsApp
          </a>
        )}
        {contact && contact !== phone && (
          <a href={`tel:${contact}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-pine text-pine font-bold px-5 py-3 hover:bg-pinelite transition-colors">
            📱 {contact}
          </a>
        )}
        <a href={mapsUrl} target="_blank" rel="noopener"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-line font-bold px-5 py-3 hover:border-pine hover:text-pine transition-colors">
          🗺 Get Directions
        </a>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {x.hours && (
            <div className="rounded-xl bg-mist border border-line p-4">
              <div className="text-xs font-bold text-ink/50 uppercase mb-1">Opening Hours</div>
              <div className="font-semibold">🕐 {x.hours}</div>
            </div>
          )}
          {x.branchCode && (
            <div className="rounded-xl bg-mist border border-line p-4">
              <div className="text-xs font-bold text-ink/50 uppercase mb-1">Branch Code</div>
              <div className="font-black text-2xl text-pine">{x.branchCode}</div>
            </div>
          )}
          {x.email && (
            <div className="rounded-xl bg-mist border border-line p-4">
              <div className="text-xs font-bold text-ink/50 uppercase mb-1">Email</div>
              <a href={`mailto:${x.email}`} className="font-semibold text-pine">{x.email}</a>
            </div>
          )}
          {b.helpline && (
            <div className="rounded-xl bg-mist border border-line p-4">
              <div className="text-xs font-bold text-ink/50 uppercase mb-1">{b.name} Helpline</div>
              <a href={`tel:${formatPhone(b.helpline)}`} className="font-semibold text-pine">{formatPhone(b.helpline)}</a>
            </div>
          )}
          {x.features?.length > 0 && (
            <div className="rounded-xl bg-mist border border-line p-4">
              <div className="text-xs font-bold text-ink/50 uppercase mb-2">Available Here</div>
              <div className="flex flex-wrap gap-2">
                {x.features.map(f => (
                  <span key={f} className="rounded-full bg-white border border-line px-3 py-1 text-sm font-semibold">✓ {f}</span>
                ))}
              </div>
            </div>
          )}
          <div className="text-xs text-ink/40">
            Last checked: {x.updated} · <a href={reportUrl} className="text-pine hover:underline">Report wrong info</a>
          </div>
        </div>
        <iframe
          title={`Map of ${x.name}`}
          src={`https://www.google.com/maps?q=${x.lat},${x.lng}&z=15&output=embed`}
          className="h-72 w-full rounded-xl border border-line md:h-full min-h-[280px]"
          loading="lazy"
        />
      </div>

      {nearby.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-black mb-4">Other {b.name} branches in {c.name}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {nearby.map(n => <BranchCard key={n.slug} b={n} />)}
          </ul>
          <Link href={`/${b.slug}/${c.slug}`} className="mt-4 inline-flex items-center gap-1 font-semibold text-pine hover:underline">
            See all {b.name} in {c.name} →
          </Link>
        </section>
      )}
    </>
  );
}
