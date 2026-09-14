import Link from "next/link";
import SearchBox from "@/components/SearchBox";
export default function NotFound() {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-extrabold">That page doesn't exist</h1>
      <p className="mt-2 text-ink/70">The branch may have moved or the link is wrong. Try searching instead.</p>
      <div className="mt-6"><SearchBox /></div>
      <Link href="/" className="mt-6 inline-block font-semibold text-pine">Back to home</Link>
    </div>
  );
}
