import Link from "next/link";
export default function Tile({ href, title, sub }) {
  return (
    <Link href={href} className="block rounded-xl bg-mist px-4 py-3 hover:bg-line">
      <span className="block font-bold">{title}</span>
      {sub && <span className="block text-sm text-ink/60">{sub}</span>}
    </Link>
  );
}
