import { useEffect, useState, type FormEvent } from 'react'
import { UserPlus, Hash } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { supabase, generatePlayerCode } from '../lib/supabase'

export function AddPlayerPage() {
  const [name, setName] = useState('')
  const [fathersName, setFathersName] = useState('')
  const [address, setAddress] = useState('')
  const [previewCode, setPreviewCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadPreviewCode = async () => {
    try {
      const code = await generatePlayerCode()
      setPreviewCode(code)
    } catch {
      setPreviewCode('SBCD-YYYY-XXX')
    }
  }

  useEffect(() => {
    loadPreviewCode()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const playerCode = await generatePlayerCode()

      const { error } = await supabase.from('players').insert({
        player_code: playerCode,
        name: name.trim(),
        fathers_name: fathersName.trim(),
        address: address.trim(),
      })

      if (error) throw error

      setMessage({
        type: 'success',
        text: `Player registered successfully with code ${playerCode}`,
      })
      setName('')
      setFathersName('')
      setAddress('')
      setPreviewCode(await generatePlayerCode())
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to add player',
      })
    }

    setLoading(false)
  }

  return (
    <div>
      <Header
        title="Add Player"
        subtitle="Register a new club member with an auto-generated player code"
      />

      <Card className="max-w-xl">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <Hash className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-xs font-medium text-emerald-400/80">Next Player Code</p>
            <p className="font-mono text-sm font-bold text-zinc-100">
              {previewCode || 'Loading...'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Father's Name"
            value={fathersName}
            onChange={(e) => setFathersName(e.target.value)}
            placeholder="Enter father's name"
            required
          />
          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter residential address"
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
            <UserPlus className="h-4 w-4" />
            Register Player
          </Button>
        </form>
      </Card>
    </div>
  )
}
