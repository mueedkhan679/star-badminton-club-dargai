export interface Player {
  id: string
  player_code: string
  name: string
  fathers_name: string
  address: string
  created_at: string
}

export interface Payment {
  id: string
  player_id: string
  amount: number
  created_at: string
}

export interface PaymentWithPlayer extends Payment {
  players: Pick<Player, 'player_code' | 'name'> | null
}

export interface Investment {
  id: string
  amount: number
  description: string
  created_at: string
}

export interface FinancialSummary {
  total_payments: number
  total_investments: number
  current_balance: number
}

export type NavItem = {
  id: string
  label: string
  path: string
  icon: string
}
