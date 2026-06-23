import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ClubLogo } from '../components/ClubLogo'

export function LoginPage() {
  const { user, loading, signIn, resetPassword } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [successMessage, setSuccessMessage] = useState('')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: authError } = await signIn(email, password)
    if (authError) setError(authError)
    setSubmitting(false)
  }

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setSubmitting(true)
    const { error: resetError } = await resetPassword(email)
    if (resetError) setError(resetError)
    else setSuccessMessage('Password reset link sent! Check your email inbox.')
    setSubmitting(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 bg-grid-pattern bg-grid px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <ClubLogo size="xl" />
          </div>
          <h1 className="font-display text-2xl font-bold text-zinc-100">
            Star Badminton Club Dargai
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {mode === 'login' ? 'Secure club management portal' : 'Recover your account access'}
          </p>
        </div>

        <div className="glass-panel p-8 shadow-glow">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sbcd.com"
                required
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                <Lock className="h-4 w-4" />
                Sign In
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot')
                  setError('')
                }}
                className="w-full text-center text-sm text-cyan-400 transition-colors hover:text-cyan-300"
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sbcd.com"
                required
                autoComplete="email"
              />

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  {successMessage}
                </div>
              )}

              <Button type="submit" loading={submitting} className="w-full">
                <Mail className="h-4 w-4" />
                Send Reset Link
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                  setSuccessMessage('')
                }}
                className="flex w-full items-center justify-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Authorized access only · Digital club management system
        </p>
      </div>
    </div>
  )
}
