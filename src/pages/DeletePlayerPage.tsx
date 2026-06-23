import { useCallback, useEffect, useState } from 'react'
import { UserMinus, RefreshCw } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { supabase, formatDateTime } from '../lib/supabase'
import type { Player } from '../types/database'

export function DeletePlayerPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setPlayers(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    const { error } = await supabase.from('players').delete().eq('id', deleteTarget.id)

    if (!error) {
      setPlayers((prev) => prev.filter((p) => p.id !== deleteTarget.id))
    }

    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div>
      <Header
        title="Delete Player"
        subtitle="Remove players and cascade-delete their payment history"
      />

      <Card>
        <div className="mb-6 flex justify-end">
          <Button variant="ghost" onClick={fetchPlayers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th className="px-4 py-3 font-semibold text-zinc-400">Player Code</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Name</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Father&apos;s Name</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Registered</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    Loading players...
                  </td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                    No players registered yet.
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr
                    key={player.id}
                    className="border-b border-zinc-800/50 transition-colors hover:bg-emerald-500/5"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-emerald-400">
                      {player.player_code}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-200">{player.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{player.fathers_name}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDateTime(player.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="danger"
                        onClick={() => setDeleteTarget(player)}
                        className="px-3 py-1.5 text-xs"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        Delete Player
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Player Deletion"
        confirmLabel="Delete Player"
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
      >
        Are you sure you want to delete{' '}
        <strong>
          {deleteTarget?.name} ({deleteTarget?.player_code})
        </strong>
        ? All associated payment records will be permanently removed due to cascade deletion.
      </Modal>
    </div>
  )
}
