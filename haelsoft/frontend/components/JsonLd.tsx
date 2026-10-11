/** Structured data. Only ever pass facts that are true; never ratings, reviews or invented claims. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped, so a value can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
