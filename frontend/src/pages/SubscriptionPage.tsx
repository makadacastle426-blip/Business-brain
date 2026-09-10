import { useState } from 'react'
import { Check, CreditCard, Eye, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { invoices, type PlanId } from '../data/appData'

type BillingCycle = 'monthly' | 'yearly'

const plans: {
  id: PlanId
  name: string
  tagline: string
  monthly: string
  yearly: string
  features: string[]
  recommended?: boolean
}[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Basic business AI',
    monthly: '$0',
    yearly: '$0',
    features: [
      '3 basic agents',
      'Customer Agent',
      'Sales Agent',
      'Inventory Agent',
      'Basic reports',
      'Basic alerts',
      'Limited memory',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Full AI business team',
    monthly: '$29.99',
    yearly: '$299.99',
    recommended: true,
    features: [
      'All seven agents',
      'Agents working together',
      'Customer follow-ups',
      'Sales/inventory alerts',
      'Forecasting + analytics',
      'Marketing assistance',
      'More connections',
      'Up to 5 team members',
      'Long-term business memory',
      'Automated reports',
      'Automated tasks',
    ],
  },
  {
    id: 'pro-plus',
    name: 'Pro Plus',
    tagline: 'Advanced automation + business intelligence',
    monthly: '$49.99',
    yearly: '$399.99',
    features: [
      'Everything in Pro',
      'Advanced agent teamwork',
      'Custom automation/workflows',
      'Advanced forecasting',
      'Business Health Score',
      'Multiple businesses',
      'Expanded team members',
      'Priority AI',
      'Higher usage limits',
    ],
  },
]

const comparisonRows = [
  { feature: 'AI agents', free: '3 basic', pro: 'All 7', plus: 'All 7 + priority' },
  { feature: 'Agent teamwork', free: '—', pro: 'Yes', plus: 'Advanced' },
  { feature: 'Team members', free: 'Owner only', pro: 'Up to 5', plus: 'Expanded' },
  { feature: 'Connections', free: 'Limited', pro: 'More connections', plus: 'Multiple businesses' },
  { feature: 'Reports & alerts', free: 'Basic', pro: 'Automated', plus: 'Advanced + Health Score' },
  { feature: 'Memory', free: 'Limited', pro: 'Long-term', plus: 'Long-term + workflows' },
]

export function SubscriptionPage() {
  const { plan, setPlan } = useAuth()
  const [cycle, setCycle] = useState<BillingCycle>('monthly')
  const [invoiceView, setInvoiceView] = useState<(typeof invoices)[number] | null>(null)
  const [note, setNote] = useState('')

  function switchPlan(next: PlanId) {
    setPlan(next)
    setNote(`Switched to ${plans.find((p) => p.id === next)?.name ?? next} (prototype).`)
    window.setTimeout(() => setNote(''), 2500)
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Subscription</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">Plans & billing</h1>
        <p className="mt-2 text-sm text-muted">
          Choose Free for basics, Pro for a full AI team, or Pro Plus for advanced automation.
        </p>
      </header>

      <div className="inline-flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-line">
        <button
          type="button"
          onClick={() => setCycle('monthly')}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            cycle === 'monthly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-surface'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setCycle('yearly')}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            cycle === 'yearly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-surface'
          }`}
        >
          Yearly
        </button>
      </div>

      {note && (
        <p className="bb-success-toast rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100" role="status">
          {note}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        {plans.map((p) => {
          const price = cycle === 'monthly' ? p.monthly : p.yearly
          const period = cycle === 'monthly' ? '/month' : '/year'
          const current = plan === p.id
          return (
            <article
              key={p.id}
              className={`relative flex flex-col rounded-[1.5rem] p-5 transition duration-200 ${
                p.recommended
                  ? 'bg-navy text-white shadow-[var(--shadow-lift)] ring-1 ring-navy lg:-translate-y-1'
                  : p.id === 'pro-plus'
                    ? 'bb-card bg-gradient-to-b from-white to-indigo-50/40'
                    : 'bb-card bb-card-interactive'
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-3 left-5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase text-white shadow-sm">
                  Recommended
                </span>
              )}
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-xl font-bold">{p.name}</h2>
                {current && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                      p.recommended ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    Current
                  </span>
                )}
              </div>
              <p className={`mt-1 text-sm ${p.recommended ? 'text-slate-300' : 'text-muted'}`}>
                {p.tagline}
              </p>
              <p className="mt-4 font-display text-3xl font-bold tracking-tight">
                {price}
                <span className={`text-sm font-semibold ${p.recommended ? 'text-slate-300' : 'text-muted'}`}>
                  {p.id === 'free' ? '' : period}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-medium">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${p.recommended ? 'text-teal-300' : 'text-brand'}`}
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => switchPlan(p.id)}
                className={`bb-btn mt-5 w-full px-4 py-2.5 ${
                  current
                    ? p.recommended
                      ? 'bg-white/15 text-white'
                      : 'bb-btn-secondary'
                    : p.recommended
                      ? 'bb-btn-primary'
                      : 'bb-btn-primary'
                }`}
              >
                {current ? 'Current plan' : p.id === 'free' ? 'Downgrade to Free' : `Choose ${p.name}`}
              </button>
            </article>
          )
        })}
      </div>

      <section className="bb-card overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">Plan comparison</h2>
          <p className="mt-1 text-sm text-muted">
            Free = basic AI · Pro = full AI team · Pro Plus = advanced automation
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface text-xs font-bold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Feature</th>
                <th className="px-5 py-3">Free</th>
                <th className="px-5 py-3">Pro</th>
                <th className="px-5 py-3">Pro Plus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="transition hover:bg-surface/60">
                  <td className="px-5 py-3 font-semibold text-ink">{row.feature}</td>
                  <td className="px-5 py-3 text-muted">{row.free}</td>
                  <td className="px-5 py-3 font-medium text-ink">{row.pro}</td>
                  <td className="px-5 py-3 text-muted">{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bb-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand" aria-hidden />
          <h2 className="font-display text-lg font-bold">Billing & invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs font-bold uppercase tracking-wide text-muted">
              <tr>
                <th className="py-3 pr-4">Invoice</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Plan</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-surface/50">
                  <td className="py-3 pr-4 font-semibold text-ink">{inv.id}</td>
                  <td className="py-3 pr-4 text-muted">{inv.date}</td>
                  <td className="py-3 pr-4">{inv.plan}</td>
                  <td className="py-3 pr-4 font-semibold">{inv.amount}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setInvoiceView(inv)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-brand transition hover:bg-brand/5"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">Prototype invoice data — no real payment processing.</p>
      </section>

      {invoiceView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[var(--shadow-lift)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand">Invoice</p>
                <h2 className="mt-1 font-display text-xl font-bold">{invoiceView.id}</h2>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 transition hover:bg-surface"
                aria-label="Close invoice"
                onClick={() => setInvoiceView(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Date</dt>
                <dd className="font-semibold">{invoiceView.date}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Plan</dt>
                <dd className="font-semibold">{invoiceView.plan}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Amount</dt>
                <dd className="font-semibold">{invoiceView.amount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Status</dt>
                <dd className="font-semibold text-emerald-700">{invoiceView.status}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Business</dt>
                <dd className="font-semibold">Lacebybritney</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setInvoiceView(null)}
              className="bb-btn bb-btn-primary mt-5 w-full px-4 py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
