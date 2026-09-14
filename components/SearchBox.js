"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ large = false, initial = "" }) {
  const [q, setQ] = useState(initial);
  const [locating, setLocating] = useState(false);
  const router = useRouter();

  const go = () => q.trim() && router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  const nearMe = () => {
    if (!navigator.geolocation) return alert("Location not available on this device.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => router.push(`/search?lat=${p.coords.latitude.toFixed(5)}&lng=${p.coords.longitude.toFixed(5)}${q ? `&q=${encodeURIComponent(q)}` : ""}`),
      () => { setLocating(false); alert("Allow location access to find nearby branches."); }
    );
  };

  if (large) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 flex items-center gap-2 rounded-xl bg-white px-4 border-2 border-transparent focus-within:border-amber transition-colors">
          <span className="text-lg text-ink/40">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Bank name, city, or area…"
            aria-label="Search branches"
            className="flex-1 bg-transparent border-none outline-none py-4 text-base text-ink placeholder:text-ink/40"
          />
          {q && <button onClick={() => setQ("")} className="text-ink/40 hover:text-ink text-lg">×</button>}
        </div>
        <div className="flex gap-2">
          <button onClick={go} className="flex-1 rounded-xl bg-amber text-ink font-bold px-6 py-4 hover:brightness-95 transition-all">
            Search
          </button>
          <button onClick={nearMe} disabled={locating}
            className="rounded-xl border-2 border-white/40 text-white font-bold px-4 py-4 hover:bg-white/10 disabled:opacity-60 transition-colors">
            {locating ? "…" : "📍"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex items-center gap-2 rounded-xl bg-white border border-line px-4 focus-within:border-pine transition-colors">
        <span className="text-ink/40">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Search branches…"
          aria-label="Search branches"
          className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-ink placeholder:text-ink/40"
        />
        {q && <button onClick={() => setQ("")} className="text-ink/40 hover:text-ink">×</button>}
      </div>
      <button onClick={go} className="rounded-xl bg-pine text-white font-bold px-5 py-3 hover:bg-pinedeep transition-colors text-sm">
        Search
      </button>
      <button onClick={nearMe} disabled={locating}
        className="rounded-xl border border-pine text-pine font-bold px-3 py-3 hover:bg-pinelite disabled:opacity-60 transition-colors text-sm">
        {locating ? "…" : "📍"}
      </button>
    </div>
  );
}
