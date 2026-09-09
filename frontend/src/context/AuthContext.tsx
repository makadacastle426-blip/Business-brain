import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { PlanId } from '../data/appData'

export const DEMO_USER_NAME = 'Rahma'
export const DEMO_USER_EMAIL = 'rahma@businessbrain.app'
export const DEMO_BUSINESS = 'Lacebybritney'

type User = {
  name: string
  email: string
  role: string
  business: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  plan: PlanId
  setPlan: (plan: PlanId) => void
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'business-brain-auth'
const PLAN_KEY = 'business-brain-plan'

function toDemoUser(email?: string): User {
  return {
    name: DEMO_USER_NAME,
    email: email?.trim() || DEMO_USER_EMAIL,
    role: 'Owner',
    business: DEMO_BUSINESS,
  }
}

function normalizeStoredUser(raw: unknown): User | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Partial<User>
  const name = typeof data.name === 'string' ? data.name : ''
  const email = typeof data.email === 'string' ? data.email : DEMO_USER_EMAIL

  if (/jordan/i.test(name) || /jordan/i.test(email)) {
    return toDemoUser(DEMO_USER_EMAIL)
  }

  return {
    name: name || DEMO_USER_NAME,
    email,
    role: typeof data.role === 'string' ? data.role : 'Owner',
    business: typeof data.business === 'string' ? data.business : DEMO_BUSINESS,
  }
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = normalizeStoredUser(JSON.parse(raw) as unknown)
    if (parsed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
    }
    return parsed
  } catch {
    return null
  }
}

function readStoredPlan(): PlanId {
  try {
    const raw = localStorage.getItem(PLAN_KEY)
    if (raw === 'pro' || raw === 'pro-plus' || raw === 'free') return raw
  } catch {
    /* ignore */
  }
  return 'free'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())
  const [plan, setPlanState] = useState<PlanId>(() => readStoredPlan())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      plan,
      setPlan(next) {
        localStorage.setItem(PLAN_KEY, next)
        setPlanState(next)
      },
      async login(email: string, _password: string) {
        await new Promise((resolve) => window.setTimeout(resolve, 650))
        const next = toDemoUser(email)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setUser(next)
        return true
      },
      async loginWithGoogle() {
        await new Promise((resolve) => window.setTimeout(resolve, 700))
        const next = toDemoUser(DEMO_USER_EMAIL)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setUser(next)
        return true
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY)
        // Clear session Connections gate so the next login always shows /connections.
        localStorage.removeItem('business-brain-onboarding')
        setUser(null)
      },
    }),
    [user, plan],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
