import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Copy .env.example to .env and add your credentials.',
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
)

export async function generatePlayerCode(): Promise<string> {
  const year = new Date().getFullYear()
  const prefix = `SBCD-${year}-`

  const { data, error } = await supabase
    .from('players')
    .select('player_code')
    .like('player_code', `${prefix}%`)
    .order('player_code', { ascending: false })
    .limit(1)

  if (error) throw error

  let nextNum = 1
  if (data && data.length > 0) {
    const lastCode = data[0].player_code
    const parts = lastCode.split('-')
    const lastNum = parseInt(parts[parts.length - 1] || '0', 10)
    nextNum = lastNum + 1
  }

  return `${prefix}${String(nextNum).padStart(3, '0')}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateStr))
}
