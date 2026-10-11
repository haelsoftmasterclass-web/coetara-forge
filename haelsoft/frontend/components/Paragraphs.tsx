/** Plain text from Django, split on blank lines. No HTML from the API is ever injected. */
export default function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={`prose-brand ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
