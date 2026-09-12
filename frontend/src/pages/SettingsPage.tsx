import { ConnectionModal } from '../components/ConnectionModal'
import { useState } from 'react'
import { Bell, Check, Loader2, Plug, Settings } from 'lucide-react'
import { PlatformLogo } from '../components/PlatformLogo'
import { useAuth } from '../context/AuthContext'
import { useConnections } from '../context/ConnectionsContext'
import { platforms, type PlatformId } from '../data/appData'

export function SettingsPage() {
  const { user } = useAuth()
  const { connections, isConnected, connectPlatform, disconnectPlatform } = useConnections()
  const [name, setName] = useState(user?.name ?? 'Rahma')
  const [notifyChat, setNotifyChat] = useState(true)
  const [notifyAlerts, setNotifyAlerts] = useState(true)
  const [saved, setSaved] = useState(false)
  const [busyId, setBusyId] = useState<PlatformId | null>(null)
  const [modalId, setModalId] = useState<PlatformId | null>(null)
  const [manageNote, setManageNote] = useState('')

  function save() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  async function handleConnect(id: PlatformId) {
    if (['tiktok', 'instagram', 'whatsapp', 'amazon'].includes(id)) {
      setModalId(id)
      return
    }
    setBusyId(id)
    await new Promise((r) => window.setTimeout(r, 900))
    connectPlatform(id)
    setBusyId(null)
  }

  async function handleDisconnect(id: PlatformId) {
    setBusyId(id)
    await new Promise((r) => window.setTimeout(r, 500))
    disconnectPlatform(id)
    setBusyId(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {modalId && <ConnectionModal id={modalId} onClose={() => setModalId(null)} />}
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Settings</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
          Workspace preferences
        </h1>
      </header>

      <section className="bb-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-display text-lg font-bold">Profile</h2>
        </div>
        <label className="block text-sm font-semibold">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bb-input mt-1.5"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Email
          <input
            value={user?.email ?? ''}
            readOnly
            className="bb-input mt-1.5 bg-slate-50 text-muted"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Connected business
          <input
            value={user?.business ?? 'Lacebybritney'}
            readOnly
            className="bb-input mt-1.5 bg-slate-50 text-muted"
          />
        </label>
      </section>

      <section className="bb-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <Plug className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-display text-lg font-bold">Connected Apps</h2>
        </div>
        <p className="mb-4 text-sm text-muted">
          Manage platform connections here. Integrations are not listed in the main sidebar.
        </p>
        {manageNote && (
          <p className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600" role="status">
            {manageNote}
          </p>
        )}
        <ul className="space-y-3">
          {platforms.map((platform) => {
            const connected = isConnected(platform.id)
            const busy = busyId === platform.id
            const accountLabel = connections[platform.id]?.accountLabel
            return (
              <li
                key={platform.id}
                className="bb-card bb-card-interactive flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <PlatformLogo id={platform.id} className="h-10 w-10" />
                  <div>
                    <p className="text-sm font-bold text-ink">{platform.name}</p>
                    <p className="text-xs text-muted">{platform.category}</p>
                    {connected ? (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <Check className="h-3 w-3" aria-hidden />
                        Connected{accountLabel ? ` · ${accountLabel}` : ''}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs font-semibold text-slate-500">Not Connected</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {connected ? (
                    <>
                      <button
                        type="button"
                        className="bb-btn bb-btn-secondary px-3 py-2 text-xs"
                        onClick={() => {
                          setManageNote(`Manage ${platform.name} (prototype — settings sync mocked).`)
                          window.setTimeout(() => setManageNote(''), 2500)
                        }}
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => handleDisconnect(platform.id)}
                        className="bb-btn px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-70"
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Disconnect'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => handleConnect(platform.id)}
                      className="bb-btn bb-btn-primary px-3 py-2 text-xs disabled:opacity-70"
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Connect
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="bb-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-display text-lg font-bold">Notifications</h2>
        </div>
        <Toggle label="Business Chat mentions" checked={notifyChat} onChange={setNotifyChat} />
        <Toggle label="Order & inventory alerts" checked={notifyAlerts} onChange={setNotifyAlerts} />
      </section>

      <button type="button" onClick={save} className="bb-btn bb-btn-primary px-4 py-3">
        {saved ? 'Saved' : 'Save settings'}
      </button>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-surface px-3 py-3">
      <span className="text-sm font-semibold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-brand' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}
