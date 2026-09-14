import "./globals.css";
import Link from "next/link";
import site from "@/site.config";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-line sticky top-0 z-50 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pine rounded-lg flex items-center justify-center text-white font-black text-sm">B</div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-pine">Branch</span><span className="text-ink">Contacts</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { href: "/category/banks", label: "🏦 Banks" },
                { href: "/category/restaurants", label: "🍔 Restaurants" },
                { href: "/category/hospitals", label: "🏥 Hospitals" },
                { href: "/category/couriers", label: "📦 Couriers" },
              ].map((n) => (
                <Link key={n.href} href={n.href}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-ink/70 hover:text-pine hover:bg-pinelite transition-colors">
                  {n.label}
                </Link>
              ))}
            </nav>
            <Link href="/search" className="bg-pine text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-pinedeep transition-colors">
              🔍 Search
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="mt-20 bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-pine rounded-md flex items-center justify-center text-white font-black text-xs">B</div>
                  <span className="font-black text-lg"><span className="text-pine">Branch</span>Contacts</span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">Pakistan's most complete branch directory with phone numbers and contact details.</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wide">Categories</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {["Banks","Restaurants","Hospitals","Couriers","Pharmacies"].map(c=>(
                    <li key={c}><Link href={`/category/${c.toLowerCase()}`} className="hover:text-pine transition-colors">{c}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wide">Cities</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {["Karachi","Lahore","Islamabad","Rawalpindi","Peshawar","Multan"].map(c=>(
                    <li key={c}><Link href={`/city/${c.toLowerCase()}`} className="hover:text-pine transition-colors">{c}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wide">Popular Banks</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {[["HBL","hbl"],["UBL","ubl"],["Meezan Bank","meezan-bank"],["MCB","mcb"],["Bank Alfalah","bank-alfalah"]].map(([n,s])=>(
                    <li key={s}><Link href={`/${s}`} className="hover:text-pine transition-colors">{n}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/40">
              <p>© {new Date().getFullYear()} BranchContacts. All branch details are publicly available information.</p>
              <p>Spotted wrong info? Use the report link on that branch page.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
