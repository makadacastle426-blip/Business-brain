import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, UserPlus, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { planLimits, teamMembers } from '../data/appData'

export function TeamMembersPage() {
  const { plan } = useAuth()
  const limits = planLimits[plan]
  const [members, setMembers] = useState(() =>
    plan === 'free' ? teamMembers.filter((m) => m.role === 'Owner') : teamMembers,
  )
  const [email, setEmail] = useState('')
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [error, setError] = useState('')

  const canInvite = plan !== 'free'
  const atCap = limits.teamMax !== null && members.length >= limits.teamMax

  function invite() {
    setError('')
    if (!canInvite) {
      setUpgradeOpen(true)
      return
    }
    if (atCap) {
      setError(
        plan === 'pro'
          ? 'Pro allows a maximum of 5 team members. Upgrade to Pro Plus for expanded seats.'
          : 'Team member limit reached.',
      )
      return
    }
    if (!email.trim()) {
      setError('Enter an email to invite.')
      return
    }
    setMembers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: email.split('@')[0],
        role: 'Member',
        email: email.trim(),
        status: 'Invited',
      },
    ])
    setEmail('')
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Team Members</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">Workspace team</h1>
        <p className="mt-2 text-sm text-muted">{limits.teamNote}</p>
      </header>

      <div className="bb-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-ink">{limits.label} plan</p>
            <p className="text-xs text-muted">
              {limits.teamMax === null
                ? `${members.length} members · expanded seats available`
                : `${members.length} / ${limits.teamMax} seats used`}
            </p>
          </div>
          {!canInvite && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-100">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Upgrade to invite
            </span>
          )}
        </div>
      </div>

      <div className="bb-card flex flex-col gap-2 p-3 sm:flex-row">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="teammate@company.com"
          disabled={!canInvite}
          className="bb-input flex-1 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Invite email"
        />
        <button type="button" onClick={invite} className="bb-btn bb-btn-primary px-4 py-3">
          {canInvite ? <UserPlus className="h-4 w-4" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
          Invite
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-100" role="alert">
          {error}{' '}
          {plan === 'pro' && atCap && (
            <Link to="/subscription" className="underline">
              View Pro Plus
            </Link>
          )}
        </p>
      )}

      <div className="bb-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <Users className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-display text-lg font-bold">Workspace members</h2>
        </div>
        <ul className="divide-y divide-line">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-3 px-5 py-4 transition hover:bg-surface/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-bold capitalize text-ink">{m.name}</p>
                  <p className="text-xs text-muted">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-line">
                  {m.role}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                    m.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {upgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-lg font-bold text-ink">Team invites require Pro</h2>
            <p className="mt-2 text-sm text-muted">
              Free includes owner access only. Upgrade to Pro for up to 5 team members, or Pro Plus
              for expanded seats.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setUpgradeOpen(false)}
                className="bb-btn bb-btn-secondary flex-1 px-4 py-2.5"
              >
                Not now
              </button>
              <Link
                to="/subscription"
                onClick={() => setUpgradeOpen(false)}
                className="bb-btn bb-btn-primary flex-1 px-4 py-2.5"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
