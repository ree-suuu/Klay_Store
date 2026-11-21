// Scalable vector icons for shop categories in the website's terracotta/charcoal theme
export function CategoryIcon({ name, color = 'currentColor', size = 56 }) {
  switch (name) {

    case 'pressure-cooker':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pressure valve */}
          <rect x="40" y="8" width="6" height="8" rx="2" fill={color} />
          <rect x="38" y="12" width="10" height="3" rx="1" fill={color} />
          {/* Lid knob */}
          <rect x="27" y="8" width="8" height="5" rx="2" fill={color} />
          {/* Lid */}
          <rect x="10" y="13" width="44" height="7" rx="2" fill={color} />
          {/* Body */}
          <rect x="13" y="20" width="38" height="26" rx="4" fill={color} />
          {/* Side handles */}
          <rect x="4" y="23" width="9" height="6" rx="2.5" fill={color} />
          <rect x="51" y="23" width="9" height="6" rx="2.5" fill={color} />
          {/* Rivets on handles */}
          <circle cx="15" cy="30" r="2.5" fill="var(--bg-card, #fff)" />
          <circle cx="49" cy="30" r="2.5" fill="var(--bg-card, #fff)" />
          {/* Base */}
          <rect x="11" y="46" width="42" height="5" rx="2" fill={color} />
        </svg>
      )

    case 'rice-cooker':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Dome lid */}
          <path d="M16 28C16 18 20 13 32 13C44 13 48 18 48 28H16Z" fill={color} />
          {/* Lid handle */}
          <rect x="27" y="9" width="10" height="5" rx="2" fill={color} />
          {/* Body */}
          <rect x="12" y="28" width="40" height="22" rx="3" fill={color} />
          {/* Side handles */}
          <rect x="5" y="31" width="7" height="5" rx="2" fill={color} />
          <rect x="52" y="31" width="7" height="5" rx="2" fill={color} />
          {/* Control panel */}
          <rect x="18" y="38" width="28" height="8" rx="2" fill="var(--bg-card, #fff)" opacity="0.25" />
          <circle cx="26" cy="42" r="2" fill="var(--bg-card, #fff)" />
          <circle cx="38" cy="42" r="2" fill="var(--bg-card, #fff)" />
          {/* Base */}
          <rect x="14" y="50" width="36" height="4" rx="2" fill={color} />
          {/* Feet */}
          <rect x="18" y="54" width="6" height="3" rx="1" fill={color} />
          <rect x="40" y="54" width="6" height="3" rx="1" fill={color} />
        </svg>
      )

    case 'electric-kettle':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Lid knob */}
          <rect x="25" y="10" width="14" height="3" rx="1.5" fill={color} />
          {/* Body */}
          <path d="M21 14H43L47 44H17L21 14Z" fill={color} />
          {/* Spout */}
          <path d="M18 16L11 23L16 28L18 20" fill={color} />
          {/* Large Handle */}
          <path d="M44 17C53 17 56 26 55 35C54 41 49 43 45 43" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
          {/* Water level indicator */}
          <rect x="30" y="21" width="4" height="16" rx="2" fill="var(--bg-card, #fff)" />
          {/* Power base */}
          <rect x="14" y="46" width="36" height="4" rx="2" fill={color} />
        </svg>
      )

    case 'fan':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grille outer ring */}
          <circle cx="32" cy="26" r="16" stroke={color} strokeWidth="2.5" />
          {/* Grille inner concentric ring */}
          <circle cx="32" cy="26" r="10" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Center hub */}
          <circle cx="32" cy="26" r="3.5" fill={color} />
          {/* Blades */}
          <path d="M32 23C32 17 37 17 37 23H32Z" fill={color} />
          <path d="M34 28C39 30 37 35 32 33L34 28Z" fill={color} />
          <path d="M29 27C25 24 23 29 27 30L29 27Z" fill={color} />
          {/* Neck / stand */}
          <rect x="30" y="42" width="4" height="7" fill={color} />
          {/* Base */}
          <path d="M22 53C22 50 26 49 32 49C38 49 42 50 42 53H22Z" fill={color} />
          {/* Power wire */}
          <path d="M42 52C46 52 48 55 52 53" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      )

    case 'bucket':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Handle arc */}
          <path d="M22 15C22 9 42 9 42 15" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Top rim */}
          <rect x="13" y="15" width="38" height="4" rx="2" fill={color} />
          {/* Bucket body trapezoid */}
          <path d="M14 19L18 52H46L50 19H14Z" fill={color} />
          {/* Horizontal ridges */}
          <line x1="16" y1="30" x2="48" y2="30" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          <line x1="17" y1="41" x2="47" y2="41" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          {/* Bottom */}
          <rect x="18" y="52" width="28" height="3" rx="1.5" fill={color} />
        </svg>
      )

    case 'ceramics':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bowl body */}
          <path d="M12 32C12 46 20 54 32 54C44 54 52 46 52 32H12Z" fill={color} />
          {/* Bowl rim */}
          <rect x="10" y="29" width="44" height="5" rx="2.5" fill={color} />
          {/* Inner bowl highlight */}
          <path d="M18 32C18 43 24 50 32 50C40 50 46 43 46 32H18Z" fill="var(--bg-card, #fff)" opacity="0.2" />
          {/* Decorative band */}
          <path d="M14 34C20 38 44 38 50 34" stroke="var(--bg-card, #fff)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Small foot ring */}
          <rect x="26" y="54" width="12" height="3" rx="1.5" fill={color} />
          {/* Glaze pattern dots */}
          <circle cx="24" cy="43" r="2" fill="var(--bg-card, #fff)" opacity="0.5" />
          <circle cx="32" cy="47" r="2" fill="var(--bg-card, #fff)" opacity="0.5" />
          <circle cx="40" cy="43" r="2" fill="var(--bg-card, #fff)" opacity="0.5" />
        </svg>
      )

    case 'mixer':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Jar Lid */}
          <rect x="24" y="9" width="16" height="3" rx="1" fill={color} />
          {/* Jar Body */}
          <path d="M22 13H42L39 31H25L22 13Z" fill={color} />
          {/* Measurement stripes */}
          <line x1="28" y1="18" x2="33" y2="18" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          <line x1="28" y1="22" x2="33" y2="22" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          {/* Jar Handle */}
          <path d="M41 16H46V26H39" stroke={color} strokeWidth="3" strokeLinecap="round" />
          {/* Motor Base */}
          <path d="M23 33H41L45 54H19L23 33Z" fill={color} />
          {/* Rotary control dial */}
          <circle cx="32" cy="43" r="5" fill="var(--bg-card, #fff)" />
          <circle cx="32" cy="43" r="2.5" fill={color} />
        </svg>
      )

    case 'bottles':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cap */}
          <rect x="26" y="8" width="12" height="7" rx="2" fill={color} />
          {/* Neck */}
          <rect x="29" y="15" width="6" height="6" rx="1" fill={color} />
          {/* Shoulder curve */}
          <path d="M22 21C22 21 25 23 32 23C39 23 42 21 42 21L46 50H18L22 21Z" fill={color} />
          {/* Body stripe highlight */}
          <rect x="20" y="33" width="24" height="3" rx="1" fill="var(--bg-card, #fff)" opacity="0.35" />
          {/* Base */}
          <rect x="17" y="50" width="30" height="6" rx="2" fill={color} />
          {/* Lid highlight */}
          <rect x="28" y="9" width="8" height="2" rx="1" fill="var(--bg-card, #fff)" opacity="0.4" />
        </svg>
      )

    case 'lunch-box':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Handle on top */}
          <path d="M26 14C26 10 38 10 38 14" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Lid */}
          <rect x="12" y="16" width="40" height="10" rx="3" fill={color} />
          {/* Lid clip/latch */}
          <rect x="29" y="14" width="6" height="4" rx="1" fill={color} />
          {/* Divider line */}
          <line x1="12" y1="27" x2="52" y2="27" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          {/* Body */}
          <rect x="12" y="27" width="40" height="22" rx="3" fill={color} />
          {/* Inner compartment line */}
          <line x1="32" y1="29" x2="32" y2="47" stroke="var(--bg-card, #fff)" strokeWidth="1.5" />
          {/* Base */}
          <rect x="14" y="49" width="36" height="5" rx="2" fill={color} />
          {/* Side clasps */}
          <rect x="8" y="29" width="4" height="9" rx="1" fill={color} />
          <rect x="52" y="29" width="4" height="9" rx="1" fill={color} />
        </svg>
      )

    case 'kitchen-rack':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top shelf */}
          <rect x="8" y="13" width="48" height="4" rx="2" fill={color} />
          {/* Middle shelf */}
          <rect x="8" y="29" width="48" height="4" rx="2" fill={color} />
          {/* Bottom shelf */}
          <rect x="8" y="45" width="48" height="4" rx="2" fill={color} />
          {/* Left vertical */}
          <rect x="8" y="13" width="4" height="36" rx="2" fill={color} />
          {/* Right vertical */}
          <rect x="52" y="13" width="4" height="36" rx="2" fill={color} />
          {/* Items on top shelf */}
          <circle cx="22" cy="26" r="3.5" fill="var(--bg-card, #fff)" opacity="0.6" />
          <circle cx="32" cy="26" r="3.5" fill="var(--bg-card, #fff)" opacity="0.6" />
          <circle cx="42" cy="26" r="3.5" fill="var(--bg-card, #fff)" opacity="0.6" />
          {/* Items on middle shelf */}
          <rect x="18" y="41" width="9" height="4" rx="1" fill="var(--bg-card, #fff)" opacity="0.6" />
          <rect x="30" y="41" width="9" height="4" rx="1" fill="var(--bg-card, #fff)" opacity="0.6" />
          <rect x="42" y="41" width="6" height="4" rx="1" fill="var(--bg-card, #fff)" opacity="0.6" />
          {/* Feet */}
          <rect x="8" y="49" width="4" height="7" rx="1" fill={color} />
          <rect x="52" y="49" width="4" height="7" rx="1" fill={color} />
        </svg>
      )

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="3" />
        </svg>
      )
  }
}
