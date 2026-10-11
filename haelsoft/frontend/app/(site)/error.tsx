"use client";

import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/lib/site";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface the digest in the browser console so support can match it to server logs.
    if (error.digest) console.warn(`Page error reference: ${error.digest}`);
  }, [error]);

  return (
    <section className="section bg-paper">
      <div className="wrap max-w-3xl">
        <p className="eyebrow text-muted">Something went wrong</p>
        <h1 className="display mt-6 text-[40px] sm:text-[56px]">This page didn&apos;t load properly.</h1>
        <p className="lede mt-6">It may be a temporary problem reaching our servers. Please try again, or come back a little later.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
          <Link href={routes.home} className="btn btn-secondary">Go to the homepage</Link>
        </div>
      </div>
    </section>
  );
}
