import Link from "next/link";
import { formatPhone, waLink } from "@/lib/phone";

export default function BranchCard({ b, brand, city, distance }) {
  const href = `/${b.brand}/${b.city}/${b.slug}`;
  const phone = formatPhone(b.phone);
  const contact = formatPhone(b.contactNumber);
  const wa = waLink(b.whatsapp || b.phone);

  return (
    <li className="rounded-xl border border-line bg-white p-4 hover:border-pine hover:shadow-card-hover transition-all card-hover">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <Link href={href} className="text-base font-bold hover:text-pine leading-snug block">{b.name}</Link>
          <p className="text-sm text-ink/60 mt-0.5">{b.address}{city ? `, ${city.name}` : ""}</p>
        </div>
        {distance != null && (
          <span className="shrink-0 rounded-full bg-pinelite text-pine px-2.5 py-1 text-xs font-bold border border-pine/20">
            📍 {distance.toFixed(1)} km
          </span>
        )}
      </div>
      {b.hours && (
        <p className="text-xs text-ink/50 mb-3 flex items-center gap-1">
          <span>🕐</span> {b.hours}
          {b.branchCode && <span className="ml-3">· Code: <strong>{b.branchCode}</strong></span>}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {phone && (
          <a href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-pine text-white text-sm font-bold px-3 py-2 hover:bg-pinedeep transition-colors">
            📞 {phone}
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp text-white text-sm font-bold px-3 py-2 hover:opacity-90 transition-opacity">
            💬 WhatsApp
          </a>
        )}
        {contact && contact !== phone && (
          <a href={`tel:${contact}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line text-sm font-semibold px-3 py-2 hover:border-pine hover:text-pine transition-colors">
            📱 {contact}
          </a>
        )}
      </div>
    </li>
  );
}
