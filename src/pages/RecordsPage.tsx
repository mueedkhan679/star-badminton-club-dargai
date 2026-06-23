import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Trash2, RefreshCw, CreditCard, TrendingDown } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { supabase, formatCurrency, formatDateTime } from '../lib/supabase'
import type { Investment, PaymentWithPlayer } from '../types/database'

type Tab = 'payments' | 'investments'

export function RecordsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('payments')
  const [paymentRecords, setPaymentRecords] = useState<PaymentWithPlayer[]>([])
  const [investmentRecords, setInvestmentRecords] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletePaymentTarget, setDeletePaymentTarget] = useState<PaymentWithPlayer | null>(null)
  const [deleteInvestmentTarget, setDeleteInvestmentTarget] = useState<Investment | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchRecords = useCallback(async () => {
    setLoading(true)

    const [paymentsRes, investmentsRes] = await Promise.all([
      supabase
        .from('payments')
        .select('*, players(player_code, name)')
        .order('created_at', { ascending: false }),
      supabase.from('investments').select('*').order('created_at', { ascending: false }),
    ])

    if (!paymentsRes.error && paymentsRes.data) {
      setPaymentRecords(paymentsRes.data as PaymentWithPlayer[])
    }
    if (!investmentsRes.error && investmentsRes.data) {
      setInvestmentRecords(investmentsRes.data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return paymentRecords
    return paymentRecords.filter(
      (r) =>
        r.players?.name.toLowerCase().includes(q) ||
        r.players?.player_code.toLowerCase().includes(q) ||
        formatCurrency(Number(r.amount)).toLowerCase().includes(q),
    )
  }, [paymentRecords, search])

  const filteredInvestments = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return investmentRecords
    return investmentRecords.filter(
      (r) =>
        r.description.toLowerCase().includes(q) ||
        formatCurrency(Number(r.amount)).toLowerCase().includes(q),
    )
  }, [investmentRecords, search])

  const handleDeletePayment = async () => {
    if (!deletePaymentTarget) return
    setDeleting(true)

    const { error } = await supabase.from('payments').delete().eq('id', deletePaymentTarget.id)

    if (!error) {
      setPaymentRecords((prev) => prev.filter((r) => r.id !== deletePaymentTarget.id))
    }

    setDeleting(false)
    setDeletePaymentTarget(null)
  }

  const handleDeleteInvestment = async () => {
    if (!deleteInvestmentTarget) return
    setDeleting(true)

    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', deleteInvestmentTarget.id)

    if (!error) {
      setInvestmentRecords((prev) => prev.filter((r) => r.id !== deleteInvestmentTarget.id))
    }

    setDeleting(false)
    setDeleteInvestmentTarget(null)
  }

  const tabs: { id: Tab; label: string; icon: typeof CreditCard; count: number }[] = [
    { id: 'payments', label: 'Payment Records', icon: CreditCard, count: paymentRecords.length },
    {
      id: 'investments',
      label: 'Investment Records',
      icon: TrendingDown,
      count: investmentRecords.length,
    },
  ]

  return (
    <div>
      <Header
        title="Transaction Records"
        subtitle="Payment and investment history with full audit trail"
      />

      <Card>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id)
                  setSearch('')
                }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeTab === 'payments'
                    ? 'Search by name, code, or amount...'
                    : 'Search by description or amount...'
                }
                className="pl-10"
              />
            </div>
            <Button variant="ghost" onClick={fetchRecords} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          {activeTab === 'payments' ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60">
                  <th className="px-4 py-3 font-semibold text-zinc-400">Player Code</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Player Name</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Amount</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Date & Time</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                      Loading records...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-emerald-500/5"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-emerald-400">
                        {record.players?.player_code ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {record.players?.name ?? 'Unknown'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-100">
                        {formatCurrency(Number(record.amount))}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {formatDateTime(record.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="danger"
                          onClick={() => setDeletePaymentTarget(record)}
                          className="px-3 py-1.5 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60">
                  <th className="px-4 py-3 font-semibold text-zinc-400">Description</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Amount</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Date & Time</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                      Loading records...
                    </td>
                  </tr>
                ) : filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                      No investment records found. Add investments from the Dashboard.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-cyan-500/5"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {record.description || '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-amber-400">
                        {formatCurrency(Number(record.amount))}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {formatDateTime(record.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="danger"
                          onClick={() => setDeleteInvestmentTarget(record)}
                          className="px-3 py-1.5 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Investment
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <p className="mt-4 text-xs text-zinc-600">
          {activeTab === 'payments'
            ? `Showing ${filteredPayments.length} of ${paymentRecords.length} payment records`
            : `Showing ${filteredInvestments.length} of ${investmentRecords.length} investment records`}
        </p>
      </Card>

      <Modal
        open={!!deletePaymentTarget}
        onClose={() => setDeletePaymentTarget(null)}
        title="Delete Payment Record"
        confirmLabel="Delete Record"
        onConfirm={handleDeletePayment}
        loading={deleting}
        variant="danger"
      >
        Are you sure you want to permanently delete the payment of{' '}
        <strong className="text-zinc-200">
          {deletePaymentTarget ? formatCurrency(Number(deletePaymentTarget.amount)) : ''}
        </strong>{' '}
        for{' '}
        <strong className="text-zinc-200">
          {deletePaymentTarget?.players?.name ?? 'this player'}
        </strong>
        ? This action cannot be undone.
      </Modal>

      <Modal
        open={!!deleteInvestmentTarget}
        onClose={() => setDeleteInvestmentTarget(null)}
        title="Delete Investment Record"
        confirmLabel="Delete Investment"
        onConfirm={handleDeleteInvestment}
        loading={deleting}
        variant="danger"
      >
        Are you sure you want to permanently delete the investment{' '}
        <strong className="text-zinc-200">
          {deleteInvestmentTarget ? formatCurrency(Number(deleteInvestmentTarget.amount)) : ''}
        </strong>{' '}
        ({deleteInvestmentTarget?.description ?? 'no description'})? This action cannot be undone.
      </Modal>
    </div>
  )
}
