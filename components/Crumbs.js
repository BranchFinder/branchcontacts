import Link from "next/link";
export default function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink/60">
      <ol className="flex flex-wrap gap-1">
        <li><Link href="/" className="hover:text-pine">Home</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex gap-1">
            <span>/</span>
            {it.href ? <Link href={it.href} className="hover:text-pine">{it.label}</Link> : <span className="text-ink">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
