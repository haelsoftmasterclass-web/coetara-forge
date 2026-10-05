import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cta, routes } from "@/lib/site";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main">
    <section className="relative overflow-hidden">
      <div className="wrap py-28 md:py-40">
        <p className="eyebrow text-muted">404 · Page not found</p>
        <h1 className="display mt-6 max-w-3xl text-[48px] sm:text-[72px]">
          This page hasn&apos;t been <span className="flame-text">built yet.</span>
        </h1>
        <p className="lede mt-6">The link may be out of date, or the page may have moved. Here are the best places to go next.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={routes.home}>Back to Home</Button>
          <Button href={cta.primary.href} variant="ghost" track={cta.primary.track}>{cta.primary.label}</Button>
        </div>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
