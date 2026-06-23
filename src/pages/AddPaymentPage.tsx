import { useEffect, useState, type FormEvent } from 'react'
import { CreditCard } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, formatCurrency } from '../lib/supabase'
import type { Player } from '../types/database'

export function AddPaymentPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerId, setPlayerId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    supabase
      .from('players')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (!error && data) setPlayers(data)
        setFetching(false)
      })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!playerId || !parsedAmount || parsedAmount <= 0) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.from('payments').insert({
      player_id: playerId,
      amount: parsedAmount,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      const player = players.find((p) => p.id === playerId)
      setMessage({
        type: 'success',
        text: `Payment of ${formatCurrency(parsedAmount)} recorded for ${player?.name ?? 'player'}. Date & time captured automatically.`,
      })
      setAmount('')
    }

    setLoading(false)
  }

  return (
    <div>
      <Header
        title="Add Payment"
        subtitle="Record a payment from an existing club member"
      />

      <Card className="max-w-xl">
        {fetching ? (
          <p className="text-sm text-slate-500">Loading players...</p>
        ) : players.length === 0 ? (
          <p className="text-sm text-amber-400">
            No players found. Please add a player first.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Select Player"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              required
            >
              <option value="">Choose a player...</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.player_code} — {p.name}
                </option>
              ))}
            </Select>

            <Input
              label="Payment Amount (PKR)"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />

            {message && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500/20 bg-red-500/10 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              <CreditCard className="h-4 w-4" />
              Save Payment
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
