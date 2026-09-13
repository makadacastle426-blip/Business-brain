import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PlatformId } from '../data/appData'

type ConnectionRecord = {
  connected: boolean
  accountLabel?: string
  connectedAt?: string
}

type ConnectionsState = Record<PlatformId, ConnectionRecord>

type ConnectionsContextValue = {
  connections: ConnectionsState
  onboardingComplete: boolean
  isConnected: (id: PlatformId) => boolean
  connectPlatform: (id: PlatformId, accountLabel?: string) => void
  disconnectPlatform: (id: PlatformId) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const ConnectionsContext = createContext<ConnectionsContextValue | null>(null)

const CONNECTIONS_KEY = 'business-brain-connections'
/**
 * Session gate after Connections “Continue”.
 * Cleared on every login and logout so Connections always appears after login.
 */
export const ONBOARDING_KEY = 'business-brain-onboarding'

export function readOnboardingComplete(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1'
  } catch {
    return false
  }
}

const defaultConnections = (): ConnectionsState => ({
  tiktok: { connected: false },
  instagram: { connected: false },
  shopify: { connected: false },
  amazon: { connected: false },
  whatsapp: { connected: false },
  stripe: { connected: false },
  gmail: { connected: false },
})

function readConnections(): ConnectionsState {
  try {
    const raw = localStorage.getItem(CONNECTIONS_KEY)
    if (!raw) return defaultConnections()
    const parsed = JSON.parse(raw) as Partial<ConnectionsState>
    return { ...defaultConnections(), ...parsed }
  } catch {
    return defaultConnections()
  }
}

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<ConnectionsState>(() => readConnections())
  const [onboardingComplete, setOnboardingComplete] = useState(() => readOnboardingComplete())

  const persist = useCallback((next: ConnectionsState) => {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(next))
    setConnections(next)
  }, [])

  const value = useMemo<ConnectionsContextValue>(
    () => ({
      connections,
      onboardingComplete,
      isConnected(id) {
        return Boolean(connections[id]?.connected)
      },
      connectPlatform(id, accountLabel) {
        const next = {
          ...connections,
          [id]: {
            connected: true,
            accountLabel,
            connectedAt: new Date().toISOString(),
          },
        }
        persist(next)
      },
      disconnectPlatform(id) {
        const next = {
          ...connections,
          [id]: { connected: false },
        }
        persist(next)
      },
      completeOnboarding() {
        localStorage.setItem(ONBOARDING_KEY, '1')
        setOnboardingComplete(true)
      },
      resetOnboarding() {
        localStorage.removeItem(ONBOARDING_KEY)
        setOnboardingComplete(false)
      },
    }),
    [connections, onboardingComplete, persist],
  )

  return (
    <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>
  )
}

export function useConnections() {
  const ctx = useContext(ConnectionsContext)
  if (!ctx) throw new Error('useConnections must be used within ConnectionsProvider')
  return ctx
}
