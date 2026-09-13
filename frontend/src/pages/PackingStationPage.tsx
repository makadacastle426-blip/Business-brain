import { useState } from 'react'
import { Boxes, Check, Package, Printer, ShoppingBag } from 'lucide-react'
import { packingOrders } from '../data/appData'

export function PackingStationPage() {
  const [selected, setSelected] = useState(packingOrders[0]?.id ?? '')
  const [checked, setChecked] = useState<Record<string, boolean>>({
    label: false,
    insert: false,
    seal: false,
    weigh: false,
  })

  const order = packingOrders.find((o) => o.id === selected) ?? packingOrders[0]
  const progress = Object.values(checked).filter(Boolean).length

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Packing Station</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">Fulfill with confidence</h1>
        <p className="mt-2 text-sm text-muted">
          Ops agent Kai guides checklist completion for each order.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="bb-card p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-brand" aria-hidden />
            <h2 className="font-display text-lg font-bold">Queue</h2>
          </div>
          <ul className="space-y-2">
            {packingOrders.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(o.id)
                    setChecked({ label: false, insert: false, seal: false, weigh: false })
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                    selected === o.id ? 'bg-brand text-white' : 'bg-surface hover:ring-1 hover:ring-line'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-bold">#{o.id} · {o.customer}</span>
                    <span className={`block text-xs ${selected === o.id ? 'text-blue-100' : 'text-muted'}`}>
                      {o.items} items · {o.status}
                    </span>
                  </span>
                  <span className={`text-xs font-semibold ${selected === o.id ? 'text-blue-100' : 'text-muted'}`}>
                    {o.sla}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bb-card p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">Order #{order.id}</h2>
              <p className="text-sm text-muted">{order.customer} · {order.items} line items</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm font-bold ring-1 ring-line"
            >
              <Printer className="h-4 w-4" aria-hidden />
              Print label
            </button>
          </div>

          <div className="mb-4 rounded-xl bg-surface px-3 py-3 text-sm">
            <div className="mb-2 flex items-center justify-between font-semibold">
              <span className="inline-flex items-center gap-2">
                <Package className="h-4 w-4 text-brand" aria-hidden />
                Packing checklist
              </span>
              <span>{progress}/4</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white ring-1 ring-line">
              <div
                className="h-full bg-brand transition-all"
                style={{ width: `${(progress / 4) * 100}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2">
            {(
              [
                ['label', 'Print & attach shipping label'],
                ['insert', 'Add packing insert / thank-you card'],
                ['seal', 'Seal carton securely'],
                ['weigh', 'Weigh package and confirm carrier'],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setChecked((c) => ({ ...c, [key]: !c[key] }))}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ring-1 ring-line hover:bg-surface"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md ${
                      checked[key] ? 'bg-brand text-white' : 'bg-white ring-1 ring-line'
                    }`}
                  >
                    {checked[key] && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            <Boxes className="h-4 w-4" aria-hidden />
            Ops agent can auto-suggest carton size from SKU mix.
          </div>
        </div>
      </div>
    </div>
  )
}
