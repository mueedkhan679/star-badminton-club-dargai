import { useCallback, useEffect, useState } from 'react'
import { Wallet, TrendingDown, PiggyBank, RefreshCw, PlusCircle } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { StatCard } from '../components/ui/Card'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { supabase, formatCurrency } from '../lib/supabase'

export function DashboardPage() {
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalInvestments, setTotalInvestments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [investModalOpen, setInvestModalOpen] = useState(false)
  const [investAmount, setInvestAmount] = useState('')
  const [investDescription, setInvestDescription] = useState('')
  const [investSubmitting, setInvestSubmitting] = useState(false)
  const [investMessage, setInvestMessage] = useState('')

  const currentBalance = totalPayments - totalInvestments

  const fetchStats = useCallback(async () => {
    setLoading(true)
    const [paymentsRes, investmentsRes] = await Promise.all([
      supabase.from('payments').select('amount'),
      supabase.from('investments').select('amount'),
    ])

    setTotalPayments(paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0)
    setTotalInvestments(investmentsRes.data?.reduce((sum, i) => sum + Number(i.amount), 0) ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(investAmount)
    if (!amount || amount <= 0 || !investDescription.trim()) return

    setInvestSubmitting(true)
    setInvestMessage('')

    const { error } = await supabase.from('investments').insert({
      amount,
      description: investDescription.trim(),
    })

    if (error) {
      setInvestMessage(error.message)
    } else {
      setInvestAmount('')
      setInvestDescription('')
      setInvestMessage('Investment recorded successfully.')
      fetchStats()
      setTimeout(() => {
        setInvestModalOpen(false)
        setInvestMessage('')
      }, 1200)
    }

    setInvestSubmitting(false)
  }

  const openInvestModal = () => {
    setInvestAmount('')
    setInvestDescription('')
    setInvestMessage('')
    setInvestModalOpen(true)
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time financial overview for your club" />

      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <Button variant="cyan" onClick={openInvestModal}>
          <PlusCircle className="h-4 w-4" />
          Add Investment
        </Button>
        <Button variant="ghost" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Payment"
          value={loading ? '...' : formatCurrency(totalPayments)}
          icon={<Wallet className="h-6 w-6" />}
          accent="emerald"
          subtitle="Sum of all player payments"
        />
        <StatCard
          title="Invested Payment"
          value={loading ? '...' : formatCurrency(totalInvestments)}
          icon={<TrendingDown className="h-6 w-6" />}
          accent="amber"
          subtitle="Total funds utilized"
        />
        <StatCard
          title="Current Balance"
          value={loading ? '...' : formatCurrency(currentBalance)}
          icon={<PiggyBank className="h-6 w-6" />}
          accent="cyan"
          subtitle="Total Payment − Invested Payment"
        />
      </div>

      <Card className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-zinc-100">Quick Actions</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Log club expenses and investments to keep your balance accurate.
            </p>
          </div>
          <Button onClick={openInvestModal}>
            <PlusCircle className="h-4 w-4" />
            Record Investment
          </Button>
        </div>
      </Card>

      <Modal
        open={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        title="Add Investment"
        hideActions
      >
        <form onSubmit={handleAddInvestment} className="space-y-4">
          <Input
            label="Description"
            value={investDescription}
            onChange={(e) => setInvestDescription(e.target.value)}
            placeholder="Court equipment, shuttlecocks, maintenance..."
            required
          />
          <Input
            label="Amount (PKR)"
            type="number"
            min="1"
            step="1"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            placeholder="5000"
            required
          />

          {investMessage && (
            <p
              className={`text-sm ${investMessage.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {investMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setInvestModalOpen(false)}
              disabled={investSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={investSubmitting}>
              Save Investment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
