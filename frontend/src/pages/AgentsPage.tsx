import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { agents } from '../data/appData'

export function AgentsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">AI Agents</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Seven specialists. One team.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Business Brain’s AI Business Team covers sales, marketing, finance, ops, support, people, and strategy.
          </p>
        </div>
        <BrandLogo size="md" className="max-w-[140px]" />
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold text-white"
                style={{ background: agent.accent }}
              >
                {agent.title.slice(0, 1)}
              </span>
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
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">{agent.title}</h2>
            <p className="text-sm font-semibold text-brand">{agent.specialty}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{agent.description}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {agent.specialty}
            </p>
            <Link
              to="/business-chat"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-surface px-3 py-2.5 text-sm font-bold text-ink ring-1 ring-line hover:bg-brand hover:text-white hover:ring-brand"
            >
              <MessageSquare className="h-4 w-4" aria-hidden />
              Chat with {agent.title}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
