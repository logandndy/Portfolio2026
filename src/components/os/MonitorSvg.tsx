// Pure decorative SVG — monitor frame, no interactive elements
export default function MonitorSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* ── Monitor body ── */}
      <rect x="14" y="8" width="1172" height="672" rx="16" fill="#0d1e30" stroke="#2a4a6f" strokeWidth="1.5"/>

      {/* ── Screen area (content rendered here via CSS overlay) ── */}
      <rect x="50" y="36" width="1100" height="608" rx="6" fill="#020810"/>

      {/* ── Subtle bezel gradient top edge ── */}
      <rect x="50" y="36" width="1100" height="2" rx="1" fill="url(#topBezel)" opacity="0.5"/>

      {/* ── Corner L-brackets (cyber accent) ── */}
      <path d="M50 74 L50 36 L88 36"  stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M1112 36 L1150 36 L1150 74"  stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M50 608 L50 644 L88 644"   stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M1112 644 L1150 644 L1150 608" stroke="#00d4ff" strokeWidth="2" fill="none" opacity="0.7"/>

      {/* ── Bottom bezel chin ── */}
      <rect x="50" y="644" width="1100" height="36" rx="0 0 5 5" fill="#0c1e30"/>

      {/* ── Power LED ── */}
      <circle cx="600" cy="663" r="5" fill="#00ff88" opacity="0.9"/>
      <circle cx="600" cy="663" r="11" fill="#00ff88" opacity="0.12"/>

      {/* ── Decorative vent lines on chin ── */}
      {[540,556,572,588,604,620,636,652,668].map((x) => (
        <line key={x} x1={x} y1="650" x2={x} y2="672" stroke="#1e3a5a" strokeWidth="1" opacity="0.6"/>
      ))}

      {/* ── Stand neck (trapezoid) ── */}
      <polygon points="492,680 708,680 728,724 472,724" fill="#0c1e30" stroke="#1e3a5a" strokeWidth="1"/>
      <line x1="492" y1="680" x2="472" y2="724" stroke="#2a4a6f" strokeWidth="0.8"/>
      <line x1="708" y1="680" x2="728" y2="724" stroke="#2a4a6f" strokeWidth="0.8"/>

      {/* ── Stand base ── */}
      <rect x="322" y="720" width="556" height="26" rx="13" fill="#0d1e30" stroke="#2a4a6f" strokeWidth="1.5"/>
      {/* Base highlight */}
      <line x1="348" y1="727" x2="852" y2="727" stroke="#3a5a7f" strokeWidth="0.6" opacity="0.6"/>

      {/* ── Screen edge glow (left and right) ── */}
      <line x1="50"  y1="36" x2="50"  y2="644" stroke="#00d4ff" strokeWidth="0.5" opacity="0.06"/>
      <line x1="1150" y1="36" x2="1150" y2="644" stroke="#00d4ff" strokeWidth="0.5" opacity="0.06"/>

      <defs>
        <linearGradient id="topBezel" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0"   stopColor="transparent"/>
          <stop offset="0.25" stopColor="#00d4ff"/>
          <stop offset="0.75" stopColor="#00d4ff"/>
          <stop offset="1"   stopColor="transparent"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
