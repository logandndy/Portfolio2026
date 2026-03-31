// Pure decorative SVG — phone frame, no interactive elements
// viewBox 0 0 400 820  |  screen rect: x=18 y=85 w=364 h=640
export default function PhoneSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* ── Phone body ── */}
      <rect x="4" y="4" width="392" height="812" rx="44" fill="#0d1e30" stroke="#2a4a6f" strokeWidth="1.5"/>

      {/* ── Inner bezel ── */}
      <rect x="12" y="12" width="376" height="796" rx="38" fill="#070f1a" stroke="#1e3a5a" strokeWidth="0.8"/>

      {/* ── Screen area ── */}
      <rect x="18" y="85" width="364" height="640" rx="8" fill="#020810"/>

      {/* ── Dynamic island (pill notch) ── */}
      <rect x="150" y="20" width="100" height="28" rx="14" fill="#050b10" stroke="#1a2d42" strokeWidth="1"/>
      {/* Camera dot */}
      <circle cx="220" cy="34" r="5" fill="#0a1520"/>
      <circle cx="220" cy="34" r="3" fill="#050b10"/>
      {/* Speaker grille */}
      <rect x="165" y="30" width="40" height="4" rx="2" fill="#0c1a28"/>

      {/* ── Status bar area (above screen) ── */}
      {/* Signal bars */}
      <rect x="30" y="24" width="3" height="6"  rx="1" fill="#2a4a6f" opacity="0.6"/>
      <rect x="35" y="22" width="3" height="8"  rx="1" fill="#2a4a6f" opacity="0.6"/>
      <rect x="40" y="20" width="3" height="10" rx="1" fill="#00d4ff" opacity="0.8"/>
      <rect x="45" y="18" width="3" height="12" rx="1" fill="#00d4ff" opacity="0.8"/>
      {/* Wifi */}
      <path d="M55 32 Q60 27 65 32" stroke="#00d4ff" strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M57.5 35 Q60 32.5 62.5 35" stroke="#00d4ff" strokeWidth="1.2" fill="none" opacity="0.8"/>
      <circle cx="60" cy="38" r="1.5" fill="#00d4ff" opacity="0.9"/>
      {/* Battery */}
      <rect x="348" y="21" width="22" height="12" rx="3" stroke="#2a4a6f" strokeWidth="1"/>
      <rect x="350" y="23" width="14" height="8" rx="1.5" fill="#00ff88" opacity="0.85"/>
      <path d="M371 25 v4" stroke="#2a4a6f" strokeWidth="2" strokeLinecap="round"/>

      {/* ── Corner L-brackets (cyber accent) ── */}
      <path d="M18 110 L18 85 L43 85" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M357 85 L382 85 L382 110" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M18 700 L18 725 L43 725" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M357 725 L382 725 L382 700" stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.7"/>

      {/* ── Screen edge glow ── */}
      <rect x="18" y="85" width="364" height="640" rx="8" stroke="#00d4ff" strokeWidth="0.5" opacity="0.08" fill="none"/>

      {/* ── Bottom chin / home indicator zone ── */}
      <rect x="18" y="732" width="364" height="8" rx="0" fill="#050b10" opacity="0.6"/>
      {/* Home indicator bar */}
      <rect x="152" y="790" width="96" height="5" rx="2.5" fill="#2a4a6f" opacity="0.7"/>

      {/* ── Volume buttons (left side) ── */}
      <rect x="0" y="200" width="4" height="50" rx="2" fill="#0c1e30" stroke="#1e3a5a" strokeWidth="0.8"/>
      <rect x="0" y="265" width="4" height="50" rx="2" fill="#0c1e30" stroke="#1e3a5a" strokeWidth="0.8"/>

      {/* ── Power button (right side) ── */}
      <rect x="396" y="230" width="4" height="70" rx="2" fill="#0c1e30" stroke="#1e3a5a" strokeWidth="0.8"/>

      {/* ── Power LED bottom ── */}
      <circle cx="200" cy="808" r="3" fill="#00ff88" opacity="0.6"/>

      <defs>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0.03"/>
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="18" y="85" width="364" height="640" rx="8" fill="url(#screenGlow)"/>
    </svg>
  );
}
