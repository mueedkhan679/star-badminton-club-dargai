import { useCallback, useEffect, useState } from 'react'
import { FileDown, Download, FileText } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/Card'
import { supabase, formatCurrency } from '../lib/supabase'
import { generateFinancialReport } from '../lib/pdf'
import type { PaymentWithPlayer } from '../types/database'

export function DownloadReportPage() {
  const [records, setRecords] = useState<PaymentWithPlayer[]>([])
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalInvestments, setTotalInvestments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const [paymentsRes, investmentsRes, recordsRes] = await Promise.all([
      supabase.from('payments').select('amount'),
      supabase.from('investments').select('amount'),
      supabase
        .from('payments')
        .select('*, players(player_code, name)')
        .order('created_at', { ascending: false }),
    ])

    setTotalPayments(paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0)
    setTotalInvestments(investmentsRes.data?.reduce((sum, i) => sum + Number(i.amount), 0) ?? 0)
    if (recordsRes.data) setRecords(recordsRes.data as PaymentWithPlayer[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDownload = () => {
    setGenerating(true)
    generateFinancialReport(records, {
      totalPayments,
      totalInvestments,
      currentBalance: totalPayments - totalInvestments,
    })
    setGenerating(false)
  }

  return (
    <div>
      <Header
        title="Download Report"
        subtitle="Export a professional PDF of all financial records"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          title="Total Records"
          value={loading ? '...' : String(records.length)}
          icon={<FileText className="h-6 w-6" />}
          accent="emerald"
        />
        <StatCard
          title="Total Payments"
          value={loading ? '...' : formatCurrency(totalPayments)}
          icon={<Download className="h-6 w-6" />}
          accent="cyan"
        />
        <StatCard
          title="Current Balance"
          value={loading ? '...' : formatCurrency(totalPayments - totalInvestments)}
          icon={<FileDown className="h-6 w-6" />}
          accent="amber"
        />
      </div>

      <Card className="mt-8 max-w-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-glow">
            <FileDown className="h-7 w-7 text-zinc-950" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold text-zinc-100">
              Financial Payment Report
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Generates a professionally formatted PDF featuring the Star Badminton Club Dargai
              branding, financial summary, and complete payment transaction log.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-400">
              <li>• Club header with generation timestamp</li>
              <li>• Total payments, investments, and balance summary</li>
              <li>• Full payment records table with player details</li>
            </ul>
            <Button
              onClick={handleDownload}
              loading={generating}
              disabled={loading || records.length === 0}
              className="mt-6"
            >
              <FileDown className="h-4 w-4" />
              Download PDF Report
            </Button>
            {!loading && records.length === 0 && (
              <p className="mt-3 text-xs text-amber-400">No payment records available to export.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
