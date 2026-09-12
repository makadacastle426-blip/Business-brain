import {
  CheckSquare,
  CreditCard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BrandLogo } from './BrandLogo'
import { useAuth } from '../context/AuthContext'
import { useConnections } from '../context/ConnectionsContext'
import { navItems, planLimits, type NavItem } from '../data/appData'

const SIDEBAR_KEY = 'business-brain-sidebar-open'

const iconMap: Record<NavItem['icon'], LucideIcon> = {
  chat: MessageSquare,
  todo: CheckSquare,
  team: Users,
  subscription: CreditCard,
  settings: Settings,
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {navItems.map((item) => {
        const Icon = iconMap[item.icon]
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-150',
                isActive
                  ? 'bg-brand text-white shadow-[0_8px_20px_rgb(13_148_136/0.25)]'
                  : 'text-slate-600 hover:bg-white hover:text-ink hover:shadow-sm',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

function readSidebarOpen(): boolean {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY)
    if (raw === null) return true
    return raw === '1'
  } catch {
    return true
  }
}

export function AppLayout() {
  const { user, logout, plan } = useAuth()
  const { resetOnboarding } = useConnections()
  const navigate = useNavigate()
  const [desktopOpen, setDesktopOpen] = useState(() => readSidebarOpen())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, desktopOpen ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [desktopOpen])

  function handleLogout() {
    logout()
    resetOnboarding()
    navigate('/login', { replace: true })
  }

  function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <>
        <div className="mb-6 px-2">
          <BrandLogo size="md" className="max-w-[180px]" />
          <p className="mt-2 text-xs font-semibold tracking-wide text-muted">
            Your AI Business Team
          </p>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <NavLinks onNavigate={onNavigate} />
        </div>
        <div className="mt-4 border-t border-line/80 pt-4">
          <div className="mb-3 rounded-2xl bg-white px-3 py-3 shadow-sm ring-1 ring-line">
            <p className="truncate text-sm font-bold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.business}</p>
            <p className="mt-1.5 inline-flex rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
              {planLimits[plan].label} plan
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-ink hover:shadow-sm"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={[
            'hidden shrink-0 flex-col overflow-hidden border-r border-line bg-surface transition-[width,padding] duration-200 ease-out lg:flex',
            desktopOpen ? 'w-72 px-4 py-5' : 'w-0 border-r-0 px-0 py-0',
          ].join(' ')}
          aria-hidden={!desktopOpen}
        >
          {desktopOpen && <SidebarBody />}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line/80 bg-surface/90 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex rounded-xl p-2 text-ink ring-1 ring-line transition hover:bg-white hover:shadow-sm"
                aria-label={desktopOpen || mobileOpen ? 'Close sidebar' : 'Open sidebar'}
                onClick={() => {
                  if (window.matchMedia('(min-width: 1024px)').matches) {
                    setDesktopOpen((o) => !o)
                  } else {
                    setMobileOpen(true)
                  }
                }}
              >
                {desktopOpen ? (
                  <PanelLeftClose className="hidden h-5 w-5 lg:block" />
                ) : (
                  <PanelLeftOpen className="hidden h-5 w-5 lg:block" />
                )}
                <Menu className="h-5 w-5 lg:hidden" />
              </button>
              {!desktopOpen && (
                <div className="hidden lg:block">
                  <BrandLogo size="sm" className="max-w-[120px]" />
                </div>
              )}
              <div className="lg:hidden">
                <BrandLogo size="sm" className="max-w-[120px]" />
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-sm font-semibold text-ink">Business Brain</p>
                <p className="text-xs text-muted">
                  {user?.business ?? 'Lacebybritney'} · Your AI Business Team
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                {user?.name}
              </span>
            </div>
          </header>

          <main className="bb-page-enter mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Close navigation overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-surface p-4 shadow-2xl">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                className="rounded-xl p-2 ring-1 ring-line transition hover:bg-white"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
