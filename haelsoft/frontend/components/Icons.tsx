export function Arrow({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="m2 3.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
export function Search({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="m12 12 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
/** The Haelsoft ribbon, reduced to a bullet / section marker. */
export function Ribbon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
      <rect x="0" y="0" width="4.5" height="14" rx="2" fill="#fd7301" />
      <rect x="11.5" y="0" width="4.5" height="14" rx="2" fill="#f2500a" />
      <path d="M1 11.5C4 7 9 5 15 4.5" stroke="#e31700" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
