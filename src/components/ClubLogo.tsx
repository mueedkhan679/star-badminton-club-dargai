import { useState } from 'react'

/** Replace with your file: public/assets/club-logo.png */
export const CLUB_LOGO_PATH = '/assets/club-logo.png'
const CLUB_LOGO_FALLBACK = '/assets/club-logo.svg'

interface ClubLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

// Hamne sizes ko pehle se kafi bada (increase) kar diya hai
const sizeMap = {
  sm: 'h-12 w-12',       // Pehle se bada
  md: 'h-16 w-16',       // Standard navbar ke liye behtar hai
  lg: 'h-24 w-24',       // Kafi bada aur clear
  xl: 'h-36 w-36',       // Dashboard hero section ke liye
  '2xl': 'h-48 w-48',    // Big profile ya login screen ke liye
}

export function ClubLogo({ size = 'lg', className = '' }: ClubLogoProps) {
  const [src, setSrc] = useState(CLUB_LOGO_PATH)
  const [failed, setFailed] = useState(false)

  const handleError = () => {
    if (src === CLUB_LOGO_PATH) {
      setSrc(CLUB_LOGO_FALLBACK)
    } else {
      setFailed(true)
    }
  }

  // Modern Glassmorphism Placeholder (Agar logo load na ho)
  if (failed) {
    return (
      <div
        className={`${sizeMap[size]} flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent backdrop-blur-md ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 ${className}`}
      >
        <span className="font-display text-2xl font-black text-emerald-400 animate-pulse">★</span>
      </div>
    )
  }

  return (
    <img
      key={src}
      src={src}
      alt="Star Badminton Club Dargai"
      // Style Tabdeeli: Border ring ko clear kiya, corners ko zyada rounded (2xl) kiya, aur hover par premium effect dala
      className={`${sizeMap[size]} rounded-2xl object-contain ring-2 ring-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-500 ease-out hover:scale-110 hover:rotate-2 hover:ring-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] cursor-pointer ${className}`}
      onError={handleError}
    />
  )
}