import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { PlatformLogo } from '../components/PlatformLogo'
import { useAuth } from '../context/AuthContext'
import { useConnections } from '../context/ConnectionsContext'
import { platforms, type PlatformId } from '../data/appData'

import { ConnectionModal } from '../components/ConnectionModal'

export function ConnectionsPage() {
  const { isAuthenticated } = useAuth()
  const { connections, isConnected, connectPlatform, completeOnboarding } = useConnections()
  const navigate = useNavigate()
  const [modalId, setModalId] = useState<PlatformId | null>(null)
  const [busyId, setBusyId] = useState<PlatformId | null>(null)
  const [toast, setToast] = useState('')

  const connectedCount = platforms.filter((platform) => isConnected(platform.id)).length

  if (!isAuthenticated) return <Navigate to="/login" replace />

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  function openConnect(id: PlatformId) {
    if (isConnected(id)) return
    if (['tiktok', 'instagram', 'whatsapp', 'amazon'].includes(id)) {
      setModalId(id)
      return
    }
    void simulateConnect(id)
  }

  async function simulateConnect(id: PlatformId, accountLabel?: string) {
    setBusyId(id)
    await new Promise((r) => window.setTimeout(r, 1100))
    connectPlatform(id, accountLabel)
    setBusyId(null)
    showToast(`${platforms.find((p) => p.id === id)?.name ?? 'App'} connected`)
  }

  function goToApp() {
    completeOnboarding()
    navigate('/business-chat', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" className="max-w-[140px]" />
            <div className="hidden sm:block">
              <p className="text-xs font-bold tracking-[0.16em] text-brand">ONBOARDING</p>
              <p className="text-sm text-muted">Connect your business platforms</p>
            </div>
          </div>
          <p role="status" className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-muted ring-1 ring-line">
            {connectedCount} of {platforms.length} connected
          </p>
        </header>

        <div className="bb-page-enter mt-10 max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Connect your apps
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            Link the platforms you already use. You can connect as many as you want — or skip and
            continue to Business Brain anytime.
          </p>
        </div>

        <div className="bb-page-enter mt-8 space-y-4">
          {platforms.map((platform) => {
            const connected = isConnected(platform.id)
            const busy = busyId === platform.id
            const accountLabel = connections[platform.id]?.accountLabel

            return (
              <article
                key={platform.id}
                className={`bb-card bb-card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 ${
                  connected ? 'border-emerald-200/80 bg-gradient-to-r from-white to-emerald-50/40' : ''
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <PlatformLogo id={platform.id} className="h-12 w-12 shadow-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold text-ink">{platform.name}</h2>
                      {connected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
                          <Check className="h-3 w-3" aria-hidden />
                          Connected
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
                      {platform.category}
                    </p>
                    <p className="mt-1 text-sm text-muted">{platform.description}</p>
                    {connected && accountLabel && (
                      <p className="mt-1 truncate text-xs font-semibold text-emerald-700">
                        {accountLabel}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={connected || busyId !== null}
                  onClick={() => openConnect(platform.id)}
                  className={`bb-btn w-full shrink-0 px-5 py-2.5 sm:w-36 ${
                    connected
                      ? 'cursor-default bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                      : 'bb-btn-primary disabled:opacity-70'
                  }`}
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Connecting…
                    </>
                  ) : connected ? (
                    <><Check className="h-4 w-4" aria-hidden />Connected</>
                  ) : (
                    'Connect'
                  )}
                </button>
              </article>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            You don&apos;t need to connect every platform to get started.
          </p>
          <button
            type="button"
            onClick={goToApp}
            className="bb-btn bb-btn-ink px-5 py-3.5"
          >
            Continue to Business Brain
          </button>
        </div>
      </div>

      {toast && (
        <div
          className="bb-success-toast fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-xl"
          role="status"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
            <Check className="h-3.5 w-3.5" aria-hidden />
          </span>
          {toast}
        </div>
      )}

      {modalId && (
        <ConnectionModal id={modalId} onClose={() => setModalId(null)}
          onConnected={() => showToast(`${platforms.find((p) => p.id === modalId)?.name} connected`)} />
      )}
    </div>
  )
}
