import { useState } from 'react'
import { Plug } from 'lucide-react'
import { integrations as seed } from '../data/appData'

export function IntegrationsPage() {
  const [items, setItems] = useState(seed)

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)),
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Integrations</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Connect your stack</h1>
        <p className="mt-2 text-sm text-muted">
          Let Business Brain pull commerce, payments, and CRM context for agents.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface ring-1 ring-line">
                <Plug className="h-4 w-4 text-brand" aria-hidden />
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                  item.connected
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.connected ? 'Connected' : 'Available'}
              </span>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{item.name}</h2>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.category}</p>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={`mt-4 w-full rounded-xl px-3 py-2.5 text-sm font-bold ${
                item.connected
                  ? 'bg-surface text-ink ring-1 ring-line'
                  : 'bg-brand text-white hover:bg-brand-dark'
              }`}
            >
              {item.connected ? 'Disconnect' : 'Connect'}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
