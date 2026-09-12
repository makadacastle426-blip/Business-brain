import {
  AlertTriangle,
  CheckSquare,
  Clock,
  MessageSquare,
  Package,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { useAuth } from '../context/AuthContext'
import { agents, packingOrders, todosSeed } from '../data/appData'

const stats = [
  { label: 'Open chats', value: '12', icon: MessageSquare, hint: '3 need reply' },
  {
    label: 'Active to-dos',
    value: String(todosSeed.filter((t) => !t.done).length),
    icon: CheckSquare,
    hint: '2 due today',
  },
  { label: 'Packing queue', value: String(packingOrders.length), icon: Package, hint: '1 SLA risk' },
  { label: 'Team online', value: '2', icon: Users, hint: '1 invite pending' },
]

function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name || 'Rahma'
  const business = user?.business || 'Lacebybritney'

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
        <div
          className="relative px-6 py-8 sm:px-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(255,255,255,0.9) 45%, rgba(14,165,233,0.08))',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Dashboard</p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
                {greetingForNow()}, {firstName}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Your AI Business Team is ready for{' '}
                <span className="font-semibold text-ink">{business}</span>. Chat, agents, packing,
                and ops live in one workspace.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/business-chat"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
                >
                  <MessageSquare className="h-4 w-4" /> Open Business Chat
                </Link>
                <Link
                  to="/todo"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink ring-1 ring-line hover:bg-surface"
                >
                  View To-Do List
                </Link>
              </div>
            </div>
            <BrandLogo size="lg" className="mx-auto max-w-[200px] sm:mx-0" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bb-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted">{stat.label}</p>
                <Icon className="h-4 w-4 text-brand" aria-hidden />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-ink">{stat.value}</p>
              <p className="mt-1 text-xs text-muted">{stat.hint}</p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bb-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Agent pulse</h2>
            <TrendingUp className="h-4 w-4 text-brand" aria-hidden />
          </div>
          <ul className="space-y-3">
            {agents.slice(0, 4).map((agent) => (
              <li
                key={agent.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-bold text-ink">
                    {agent.title}
                  </p>
                  <p className="text-xs text-muted">{agent.specialty}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
                    agent.status === 'online'
                      ? 'bg-emerald-50 text-emerald-700'
                      : agent.status === 'busy'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {agent.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bb-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Needs attention</h2>
            <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />
          </div>
          <ul className="space-y-3">
            <li className="flex gap-3 rounded-xl bg-amber-50/70 px-3 py-3 ring-1 ring-amber-100">
              <Clock className="mt-0.5 h-4 w-4 text-amber-600" aria-hidden />
              <div>
                <p className="text-sm font-bold text-ink">Order #4821 packing SLA</p>
                <p className="text-xs text-muted">
                  2 hours remaining · Ops agent Kai can assist {business}
                </p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-surface px-3 py-3">
              <MessageSquare className="mt-0.5 h-4 w-4 text-brand" aria-hidden />
              <div>
                <p className="text-sm font-bold text-ink">Customer reply draft ready</p>
                <p className="text-xs text-muted">Support agent Rae prepared a response in chat</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl bg-surface px-3 py-3">
              <CheckSquare className="mt-0.5 h-4 w-4 text-brand" aria-hidden />
              <div>
                <p className="text-sm font-bold text-ink">3 smart to-dos due soon</p>
                <p className="text-xs text-muted">Prioritized from chat and packing activity</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
