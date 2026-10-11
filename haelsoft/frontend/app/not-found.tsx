import Link from "next/link";
import Logo from "@/components/Logo";
import { routes } from "@/lib/site";

/** Rendered for unmatched URLs and any page that calls notFound(); served with HTTP 404. */
export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100svh] flex-col bg-paper">
      <div className="wrap flex h-[72px] items-center">
        <Link href={routes.home} aria-label="Haelsoft EdTech home"><Logo /></Link>
      </div>
      <div className="wrap flex flex-1 flex-col justify-center py-20">
        <p className="eyebrow text-muted">Error 404</p>
        <h1 className="display mt-6 text-[44px] sm:text-[64px]">We couldn&apos;t find that page.</h1>
        <p className="lede mt-6">The link may be out of date, or the page may have moved. These pages are a good place to continue:</p>
        <ul className="mt-10 flex flex-wrap gap-3">
          <li><Link href={routes.home} className="btn btn-primary">Go to the homepage</Link></li>
          <li><Link href={routes.instructors} className="btn btn-secondary">Browse instructors</Link></li>
          <li><Link href={routes.contact} className="btn btn-secondary">Contact us</Link></li>
        </ul>
      </div>
    </main>
  );
}
