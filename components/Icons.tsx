export function Arrow({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
export function Check({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function Cross({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
/** The slanted Forge ribbon used as a bullet / section marker. */
export function Ribbon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
      <defs>
        <linearGradient id="rb" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#feb101" />
          <stop offset="1" stopColor="#fe5301" />
        </linearGradient>
      </defs>
      <path d="M5 0h9L9 5H0z" fill="url(#rb)" />
      <path d="M5 7h7l-5 5H0z" fill="url(#rb)" opacity=".75" />
    </svg>
  );
}
