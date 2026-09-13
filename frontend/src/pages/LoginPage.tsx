import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { DEMO_USER_EMAIL, useAuth } from '../context/AuthContext'
import { useConnections } from '../context/ConnectionsContext'

export function LoginPage() {
  const { authLoading, isAuthenticated, login, loginWithGoogle, signup } = useAuth()
  const { resetOnboarding, completeOnboarding } = useConnections()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_USER_EMAIL)
  const [password, setPassword] = useState('demo')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  // Already signed in on /login → always send through Connections (never skip to chat).
  if (!authLoading && isAuthenticated && !loading) {
    return <Navigate to="/connections" replace />
  }

  /** Every successful login lands on Business Chat. */
  function redirectAfterLogin() {
    resetOnboarding()
    completeOnboarding()
    navigate('/business-chat', { replace: true })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!email.trim() || !password.trim()) {
      setError('Enter email and password to continue.')
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(email.trim(), password)
      } else {
        await login(email.trim(), password)
      }
      redirectAfterLogin()
    } catch (cause) {
      setError(getAuthErrorMessage(cause, mode))
      setLoading(false)
    }
  }

  async function onGoogle() {
    setError('')
    setInfo('')
    setLoading(true)
    try {
      await loginWithGoogle()
      redirectAfterLogin()
    } catch (cause) {
      setError(getAuthErrorMessage(cause, 'signin', true))
      setLoading(false)
    }
  }

  function getAuthErrorMessage(cause: unknown, authMode: 'signin' | 'signup', google = false) {
    const code = cause instanceof Error && 'code' in cause ? String(cause.code) : ''

    if (code.includes('operation-not-allowed')) {
      return google
        ? 'Google sign-in is not enabled in Firebase Authentication.'
        : 'Email/password sign-in is not enabled in Firebase Authentication.'
    }
    if (code.includes('invalid-credential') || code.includes('user-not-found') || code.includes('wrong-password')) {
      return 'Incorrect email or password.'
    }
    if (code.includes('email-already-in-use')) return 'An account already exists for this email.'
    if (code.includes('invalid-email')) return 'Enter a valid email address.'
    if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
    if (code.includes('popup-closed-by-user')) return 'The Google sign-in window was closed.'
    return authMode === 'signup'
      ? 'Unable to create the account. Check Firebase Authentication settings.'
      : 'Unable to sign in. Check the email, password, and Firebase Authentication settings.'
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfcfe] px-4 py-10">
      <div className="login-ambient" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.06) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />
      <div className="login-form-enter relative z-10 w-full max-w-[420px] rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgb(15_23_42/0.08)] backdrop-blur-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size="hero" className="login-logo-enter max-w-[280px] sm:max-w-[320px]" />
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        <p className="text-center text-sm text-muted">
          {mode === 'signin'
            ? 'Sign in to your Business Brain'
            : 'Start connecting your business platforms'}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-sm font-semibold text-ink">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bb-input mt-2"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="login-password" className="block text-sm font-semibold text-ink">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  className="text-xs font-semibold text-brand transition hover:text-brand-dark"
                  onClick={() =>
                    setInfo('Password reset is not available in this demo environment.')
                  }
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bb-input mt-2"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600" role="status">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bb-btn bb-btn-primary w-full px-4 py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3" aria-hidden>
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs font-semibold tracking-wide text-slate-400">OR</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={onGoogle}
          className="bb-btn bb-btn-secondary w-full px-4 py-3 disabled:opacity-70"
        >
          <GoogleMark />
          Continue with Google
        </button>

        <p className="mt-8 text-center text-sm text-muted">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-semibold text-brand hover:text-brand-dark"
                onClick={() => {
                  setMode('signup')
                  setError('')
                  setInfo('')
                }}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="font-semibold text-brand hover:text-brand-dark"
                onClick={() => {
                  setMode('signin')
                  setError('')
                  setInfo('')
                }}
              >
                Sign In
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-muted">
          Demo environment ·{' '}
          <Link to="/login" className="underline-offset-2 hover:underline">
            No real payment required
          </Link>
        </p>
      </div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#EA4335"
        d="M9 7.2v3.5h4.9c-.2 1.2-1.5 3.5-4.9 3.5-3 0-5.4-2.5-5.4-5.5S6 3.2 9 3.2c1.7 0 2.8.7 3.4 1.3l2.3-2.2C13.5.9 11.4 0 9 0 4.3 0 .4 3.9.4 8.7S4.3 17.4 9 17.4c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H9z"
      />
    </svg>
  )
}
