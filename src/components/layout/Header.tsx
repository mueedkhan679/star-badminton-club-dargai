interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500/80">
          Star Badminton Club Dargai
        </p>
        <h1 className="bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
      </div>
    </header>
  )
}
