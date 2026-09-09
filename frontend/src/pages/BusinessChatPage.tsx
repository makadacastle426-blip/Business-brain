import { useMemo, useState, type FormEvent } from 'react'
import {
  BarChart3,
  Check,
  ChevronDown,
  Lock,
  Package,
  Send,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { agents, type AgentId } from '../data/appData'

type Message = {
  id: string
  role: 'user' | 'agent'
  agentId?: AgentId
  text: string
  time: string
}

const starter: Message[] = [
  {
    id: 'm1',
    role: 'agent',
    agentId: 'customer',
    text: 'Welcome to Business Chat. Select agents from the Agents menu, then ask about customers, sales, inventory, or operations.',
    time: '9:01 AM',
  },
]

const suggestions = [
  { label: "Analyze today's sales", icon: BarChart3 },
  { label: 'Check low inventory', icon: Package },
  { label: 'Find customer follow-ups', icon: Users },
  { label: "Review today's orders", icon: ShoppingBag },
  { label: 'Give me a business summary', icon: Sparkles },
]

function agentUnlocked(plan: string, agentId: AgentId) {
  const agent = agents.find((a) => a.id === agentId)
  if (!agent) return false
  if (plan === 'free') return agent.freeAccess
  return true
}

export function BusinessChatPage() {
  const { plan } = useAuth()
  const [selected, setSelected] = useState<AgentId[]>(['customer', 'sales'])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [limitMsg, setLimitMsg] = useState('')
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [lockedTitle, setLockedTitle] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(starter)
  const [thinking, setThinking] = useState(false)

  const selectedAgents = useMemo(
    () => agents.filter((a) => selected.includes(a.id)),
    [selected],
  )

  function toggleAgent(id: AgentId) {
    const agent = agents.find((a) => a.id === id)
    if (!agent) return

    if (!agentUnlocked(plan, id)) {
      setLockedTitle(agent.title)
      setUpgradeOpen(true)
      return
    }

    setSelected((prev) => {
      if (prev.includes(id)) {
        setLimitMsg('')
        return prev.filter((x) => x !== id)
      }
      setLimitMsg('')
      return [...prev, id]
    })
  }

  function pushReply(text: string) {
    if (selectedAgents.length === 0) {
      setLimitMsg('Select at least one agent to chat.')
      setPickerOpen(true)
      return
    }

    const lead = selectedAgents[0]
    const teamLabel = selectedAgents.map((a) => a.title).join(', ')
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text, time: now },
    ])
    setThinking(true)
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          agentId: lead.id,
          text: `${lead.title} here (with ${teamLabel}). For “${text}”, I’ll coordinate next steps and surface any related to-dos.`,
          time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        },
      ])
      setThinking(false)
    }, 650)
  }

  function send(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    pushReply(text)
  }

  function useSuggestion(label: string) {
    setInput(label)
    pushReply(label)
  }

  return (
    <div className="flex h-[calc(100vh-5.5rem)] min-h-[32rem] flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[var(--shadow-soft)] ring-1 ring-line">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line/80 bg-gradient-to-r from-white to-surface/60 px-4 py-3.5 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-bold text-ink">Business Chat</h1>
            <span className="hidden rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand sm:inline">
              AI workspace
            </span>
          </div>
          <p className="text-xs text-muted">
            {selectedAgents.length > 0
              ? `${selectedAgents.length} agent${selectedAgents.length === 1 ? '' : 's'} selected`
              : 'No agents selected'}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="bb-btn bb-btn-secondary px-3 py-2"
            aria-expanded={pickerOpen}
            aria-haspopup="dialog"
          >
            Agents
            <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-bold text-brand">
              {selected.length}/{agents.length}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted transition ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {pickerOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20 cursor-default"
                aria-label="Close agent picker"
                onClick={() => setPickerOpen(false)}
              />
              <div
                role="dialog"
                aria-label="Select agents"
                className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl bg-white p-3 shadow-[var(--shadow-lift)] ring-1 ring-line"
              >
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Select agents
                  </p>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-muted transition hover:bg-surface"
                    aria-label="Close"
                    onClick={() => setPickerOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {limitMsg && (
                  <p className="mb-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800" role="status">
                    {limitMsg}
                  </p>
                )}

                {plan === 'free' && (
                  <p className="mb-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted">
                    Free plan includes Customer, Sales, and Inventory agents.{' '}
                    <Link to="/subscription" className="font-semibold text-brand hover:underline">
                      Upgrade
                    </Link>
                  </p>
                )}

                <ul className="max-h-80 space-y-1 overflow-y-auto">
                  {agents.map((agent) => {
                    const unlocked = agentUnlocked(plan, agent.id)
                    const isSelected = selected.includes(agent.id)
                    return (
                      <li key={agent.id}>
                        <button
                          type="button"
                          onClick={() => toggleAgent(agent.id)}
                          className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition duration-150 ${
                            isSelected
                              ? 'bg-brand/10 ring-1 ring-brand/35'
                              : 'hover:bg-surface'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold transition ${
                              isSelected && unlocked
                                ? 'border-brand bg-brand text-white'
                                : 'border-line bg-white text-transparent'
                            }`}
                            aria-hidden
                          >
                            {isSelected && unlocked ? <Check className="h-3.5 w-3.5" /> : '·'}
                          </span>
                          <span
                            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                            style={{ background: agent.accent }}
                          >
                            {agent.title
                              .split(' ')
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join('')}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="block text-sm font-bold text-ink">{agent.title}</span>
                              {!unlocked && (
                                <Lock className="h-3.5 w-3.5 text-muted" aria-label="Locked" />
                              )}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">{agent.description}</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 1 && (
          <div className="mx-auto max-w-xl py-6 text-center">
            <p className="font-display text-2xl font-bold tracking-tight text-ink">
              What can I help you with?
            </p>
            <p className="mt-2 text-sm text-muted">
              Choose agents, then ask anything about your business.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {suggestions.map((s) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => useSuggestion(s.label)}
                    className="bb-card bb-card-interactive flex items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold text-ink">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {messages.map((m) => {
          const agent = agents.find((a) => a.id === m.agentId)
          const isUser = m.role === 'user'
          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[70%] ${
                  isUser
                    ? 'rounded-br-md bg-brand text-white shadow-[0_8px_20px_rgb(13_148_136/0.25)]'
                    : 'rounded-bl-md bg-surface text-ink ring-1 ring-line'
                }`}
              >
                {!isUser && agent && (
                  <p className="mb-1 text-xs font-bold" style={{ color: agent.accent }}>
                    {agent.title}
                  </p>
                )}
                <p>{m.text}</p>
                <p className={`mt-2 text-[11px] ${isUser ? 'text-teal-100' : 'text-muted'}`}>
                  {m.time}
                </p>
              </div>
            </div>
          )
        })}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-surface px-4 py-3 ring-1 ring-line">
              <span className="ai-typing" aria-label="Agent thinking">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="border-t border-line/80 bg-white p-4 sm:p-5">
        {limitMsg && !pickerOpen && (
          <p className="mb-2 text-xs font-semibold text-amber-700" role="status">
            {limitMsg}
          </p>
        )}
        <div className="flex items-end gap-2 rounded-2xl bg-surface p-2 ring-1 ring-line transition focus-within:ring-2 focus-within:ring-brand/40">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            placeholder="Message your AI business agents…"
            className="max-h-32 min-h-[2.75rem] w-full resize-y bg-transparent px-2 py-2 text-sm outline-none"
            aria-label="Message"
          />
          <button
            type="submit"
            className="bb-btn bb-btn-primary shrink-0 px-4 py-2.5"
          >
            <Send className="h-4 w-4" aria-hidden />
            Send
          </button>
        </div>
      </form>

      {upgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-lg font-bold text-ink">Upgrade required</h2>
            <p className="mt-2 text-sm text-muted">
              <span className="font-semibold text-ink">{lockedTitle}</span> is available on Pro and
              Pro Plus. Free includes Customer, Sales, and Inventory agents only.
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
                className="bb-btn bb-btn-primary flex-1 px-4 py-2.5"
                onClick={() => setUpgradeOpen(false)}
              >
                View plans
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
