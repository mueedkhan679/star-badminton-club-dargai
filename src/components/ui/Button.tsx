import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyan'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary:
    'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0',
  cyan:
    'bg-gradient-to-r from-cyan-600 to-cyan-500 text-zinc-950 shadow-lg shadow-cyan-600/25 hover:from-cyan-500 hover:to-cyan-400 hover:shadow-cyan-500/40 hover:-translate-y-0.5 disabled:opacity-50',
  secondary:
    'border border-zinc-700/80 bg-zinc-800/60 text-zinc-200 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-zinc-800 hover:text-white',
  danger:
    'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20 hover:from-red-500 hover:to-red-400 hover:-translate-y-0.5 disabled:opacity-50',
  ghost:
    'border border-transparent text-zinc-400 hover:border-zinc-700/60 hover:bg-zinc-800/50 hover:text-zinc-200',
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
