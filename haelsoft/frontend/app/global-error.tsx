"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "64px 24px", maxWidth: 640, margin: "0 auto" }}>
        <h1>Haelsoft EdTech is temporarily unavailable.</h1>
        <p>Please try again in a moment.</p>
        <button type="button" onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
