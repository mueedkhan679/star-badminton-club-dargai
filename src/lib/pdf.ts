import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { PaymentWithPlayer } from '../types/database'
import { formatCurrency, formatDateTime } from './supabase'

const CLUB_NAME = 'Star Badminton Club Dargai'

export function generateFinancialReport(
  records: PaymentWithPlayer[],
  summary: { totalPayments: number; totalInvestments: number; currentBalance: number },
): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const generatedAt = new Date().toLocaleString('en-PK')

  doc.setFillColor(22, 163, 74)
  doc.rect(0, 0, pageWidth, 38, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(CLUB_NAME, pageWidth / 2, 16, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Financial Payment Report', pageWidth / 2, 26, { align: 'center' })
  doc.setFontSize(9)
  doc.text(`Generated: ${generatedAt}`, pageWidth / 2, 33, { align: 'center' })

  doc.setTextColor(30, 41, 59)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Summary', 14, 50)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Total Payments: ${formatCurrency(summary.totalPayments)}`, 14, 58)
  doc.text(`Invested Amount: ${formatCurrency(summary.totalInvestments)}`, 14, 64)
  doc.text(`Current Balance: ${formatCurrency(summary.currentBalance)}`, 14, 70)

  const tableData = records.map((r) => [
    r.players?.player_code ?? '—',
    r.players?.name ?? 'Unknown',
    formatCurrency(Number(r.amount)),
    formatDateTime(r.created_at),
  ])

  autoTable(doc, {
    startY: 78,
    head: [['Player Code', 'Player Name', 'Amount', 'Date & Time']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  })

  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 78

  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(
    `${CLUB_NAME} — Confidential financial report`,
    pageWidth / 2,
    finalY + 12,
    { align: 'center' },
  )

  doc.save(`SBCD-Financial-Report-${new Date().toISOString().slice(0, 10)}.pdf`)
}
