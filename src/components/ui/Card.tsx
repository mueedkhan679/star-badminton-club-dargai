import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow }: CardProps) {
  return (
    <div className={`glass-card ${glow ? 'shadow-glow border-emerald-500/20' : ''} ${className}`}>
      {children}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  accent: 'emerald' | 'cyan' | 'amber'
  subtitle?: string
}

const accentStyles = {
  emerald: {
    icon: 'from-emerald-500/25 to-emerald-600/5 text-emerald-400 ring-emerald-500/30',
    value: 'text-emerald-400',
  },
  cyan: {
    icon: 'from-cyan-500/25 to-cyan-600/5 text-cyan-400 ring-cyan-500/30',
    value: 'text-cyan-400',
  },
  amber: {
    icon: 'from-amber-500/25 to-amber-600/5 text-amber-400 ring-amber-500/30',
    value: 'text-amber-400',
  },
}

export function StatCard({ title, value, icon, accent, subtitle }: StatCardProps) {
  const styles = accentStyles[accent]

  return (
    <Card className="animate-slide-up overflow-hidden" glow>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">{title}</p>
          <p className={`mt-2 font-display text-2xl font-bold tracking-tight ${styles.value}`}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}
