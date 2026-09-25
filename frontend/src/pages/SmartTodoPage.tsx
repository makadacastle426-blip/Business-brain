import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Printer,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { businessTasksSeed, type BusinessTask } from '../data/appData'

const typeIcon = {
  order: ShoppingBag,
  payment: CreditCard,
  inventory: Package,
  customer: Users,
  'follow-up': Users,
  sales: TrendingUp,
} as const

const filters = ['All', 'Orders', 'Payments', 'Inventory', 'Customer', 'Sales'] as const

function matchesFilter(task: BusinessTask, filter: (typeof filters)[number]) {
  if (filter === 'All') return true
  if (filter === 'Orders') return task.type === 'order'
  if (filter === 'Payments') return task.type === 'payment'
  if (filter === 'Inventory') return task.type === 'inventory'
  if (filter === 'Customer') return task.type === 'customer' || task.type === 'follow-up'
  if (filter === 'Sales') return task.type === 'sales'
  return true
}

export function SmartTodoPage() {
  const [items, setItems] = useState(businessTasksSeed)
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [actionNote, setActionNote] = useState('')
  const [completeFlash, setCompleteFlash] = useState('')
  const [slideKey, setSlideKey] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [printStages, setPrintStages] = useState<Record<string, 'ready' | 'printed' | 'sent' | 'skipped'>>({})

  const queue = useMemo(
    () => items.filter((t) => !t.done && matchesFilter(t, filter)),
    [items, filter],
  )
  const resolved = items.filter((t) => t.done)
  const current = queue[0] ?? null
  const upcoming = queue.slice(1)

  useEffect(() => {
    setExiting(false)
    setSlideKey((k) => k + 1)
  }, [filter])

  function runAction(task: BusinessTask) {
    setActionNote(`${task.action} started for ${task.title}`)
    window.setTimeout(() => setActionNote(''), 2200)
  }

  function completeCurrent() {
    if (!current || exiting) return
    setCompleteFlash('✓ Task completed')
    setExiting(true)
    window.setTimeout(() => {
      setItems((prev) => prev.map((t) => (t.id === current.id ? { ...t, done: true } : t)))
      setExiting(false)
      setSlideKey((k) => k + 1)
      setCompleteFlash('')
    }, 320)
  }

  function updatePrintStage(taskId: string, stage: 'printed' | 'sent' | 'skipped') {
    setPrintStages((prev) => ({ ...prev, [taskId]: stage }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">To-Do List</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
          Business actions
        </h1>
        <p className="mt-2 text-sm text-muted">
          Work through tasks one at a time. Completing a task automatically moves to the next.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition duration-150 ${
              filter === f
                ? 'bg-brand text-white shadow-[0_6px_16px_rgb(13_148_136/0.28)]'
                : 'bg-white text-slate-600 ring-1 ring-line hover:bg-surface hover:shadow-sm'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {(actionNote || completeFlash) && (
        <p
          className="bb-success-toast rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-100"
          role="status"
        >
          {completeFlash || actionNote}
        </p>
      )}

      {current ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Task {resolved.filter((t) => matchesFilter(t, filter)).length + 1} of{' '}
            {resolved.filter((t) => matchesFilter(t, filter)).length + queue.length}
          </p>

          <div key={slideKey} className={exiting ? 'todo-card-exit' : 'todo-card-enter'}>
            <TaskCard
              task={current}
              onAction={() => runAction(current)}
              onComplete={completeCurrent}
              printStage={printStages[current.id] ?? 'ready'}
              onPrintStage={(stage) => updatePrintStage(current.id, stage)}
              primary
            />
          </div>

          {upcoming.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Up next</p>
              {upcoming.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAction={() => runAction(task)}
                  onComplete={() => {}}
                  printStage={printStages[task.id] ?? 'ready'}
                  onPrintStage={(stage) => updatePrintStage(task.id, stage)}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bb-card rounded-[1.5rem] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <Sparkles className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 font-display text-xl font-bold text-ink">All tasks completed</p>
          <p className="mt-2 text-sm text-muted">
            You&apos;re all caught up
            {filter !== 'All' ? ` on ${filter.toLowerCase()} tasks` : ''}. Great work.
          </p>
        </div>
      )}

      {resolved.length > 0 && (
        <section className="bb-card p-5">
          <h2 className="font-display text-lg font-bold">Completed ({resolved.length})</h2>
          <ul className="mt-3 space-y-2">
            {resolved.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 text-sm text-muted">
                <span className="inline-flex items-center gap-2 line-through">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                  {t.title}
                </span>
                <span className="text-xs font-semibold uppercase">{t.source}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function TaskCard({
  task,
  onAction,
  onComplete,
  primary,
  compact,
  printStage,
  onPrintStage,
}: {
  task: BusinessTask
  onAction: () => void
  onComplete: () => void
  primary?: boolean
  compact?: boolean
  printStage: 'ready' | 'printed' | 'sent' | 'skipped'
  onPrintStage: (stage: 'printed' | 'sent' | 'skipped') => void
}) {
  const Icon = typeIcon[task.type]

  if (compact) {
    return (
      <article className="bb-card px-4 py-3 opacity-80">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-ink">{task.title}</h3>
            <p className="text-xs text-muted">
              {task.source} · {task.status}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-slate-400">Queued</span>
        </div>
      </article>
    )
  }

  return (
    <article className="bb-card overflow-hidden p-0 shadow-[var(--shadow-soft)]">
      <div className="border-b border-line/70 bg-gradient-to-r from-surface/80 to-white px-5 py-3 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
          {task.type.replace('-', ' ')} needs attention
        </p>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-ink">{task.title}</h2>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
                {task.source}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${
              task.priority === 'high'
                ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
                : task.priority === 'medium'
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                  : 'bg-slate-100 text-slate-600'
            }`}
          >
            {task.priority} priority
          </span>
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          {task.customer && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-muted">Customer</dt>
              <dd className="font-medium text-ink">{task.customer}</dd>
            </div>
          )}
          {!task.customer && task.orderFrom && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-muted">Order from</dt>
              <dd className="font-medium text-ink">{task.orderFrom}</dd>
            </div>
          )}
          {task.product && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-muted">Product</dt>
              <dd className="font-medium text-ink">{task.product}</dd>
            </div>
          )}
          {task.amount && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-muted">Amount</dt>
              <dd className="font-semibold text-ink">{task.amount}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-semibold text-muted">Status</dt>
            <dd className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden />
              {task.workflow === 'print-label' && printStage !== 'ready'
                ? printStage === 'printed' ? 'Label printed' : printStage === 'sent' ? 'Tracking link sent' : 'Tracking link skipped'
                : task.status}
            </dd>
          </div>
          {task.meta && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 font-semibold text-muted">Note</dt>
              <dd className="text-muted">{task.meta}</dd>
            </div>
          )}
        </dl>

        {task.workflow === 'print-label' ? (
          <div className="mt-6 rounded-2xl border border-brand/15 bg-brand/5 p-4" aria-live="polite">
            {printStage === 'ready' ? (
              <>
                <p className="text-sm font-semibold text-ink">Package ready? Print the shipping label to continue.</p>
                <p className="mt-1 text-xs text-muted">Demo flow: printing is simulated; no printer or courier is contacted.</p>
                <button type="button" onClick={() => onPrintStage('printed')} className="bb-btn bb-btn-primary mt-4 px-4 py-2.5">
                  <Printer className="h-4 w-4" aria-hidden /> Wireless Print Label
                </button>
              </>
            ) : printStage === 'printed' ? (
              <>
                <p className="text-sm font-semibold text-ink">Label printed. Would you like to send Shamara her tracking link now?</p>
                <p className="mt-1 text-xs text-muted">This demo simulates the message and tracking update.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => onPrintStage('sent')} className="bb-btn bb-btn-primary px-4 py-2.5">Yes, send</button>
                  <button type="button" onClick={() => onPrintStage('skipped')} className="bb-btn bb-btn-secondary px-4 py-2.5">No, skip</button>
                </div>
              </>
            ) : (
              <>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  {printStage === 'sent' ? 'Tracking link sent to Shamara (demo).' : 'Label printed; tracking link not sent.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {printStage === 'skipped' && <button type="button" onClick={() => onPrintStage('sent')} className="bb-btn bb-btn-secondary px-4 py-2.5">Send link now</button>}
                  {primary && <button type="button" onClick={onComplete} className="bb-btn bb-btn-primary px-4 py-2.5">Complete task</button>}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={onAction} className="bb-btn bb-btn-secondary px-4 py-2.5">{task.action}</button>
            {primary && <button type="button" onClick={onComplete} className="bb-btn bb-btn-primary px-4 py-2.5">Complete</button>}
          </div>
        )}
      </div>
    </article>
  )
}
