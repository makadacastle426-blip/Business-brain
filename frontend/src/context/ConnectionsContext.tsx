import {
  createContext,
  useEffect,
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
    const parsed: unknown = JSON.parse(raw)
    const next = defaultConnections()
    if (!parsed || typeof parsed !== 'object') return next
    for (const id of Object.keys(next) as PlatformId[]) {
      const record = (parsed as Record<string, unknown>)[id]
      if (record && typeof record === 'object' && 'connected' in record && record.connected === true) {
        next[id] = {
          connected: true,
          accountLabel: 'accountLabel' in record && typeof record.accountLabel === 'string' ? record.accountLabel : undefined,
          connectedAt: 'connectedAt' in record && typeof record.connectedAt === 'string' ? record.connectedAt : undefined,
        }
      }
    }
    return next
  } catch {
    return defaultConnections()
  }
}

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<ConnectionsState>(() => readConnections())
  const [onboardingComplete, setOnboardingComplete] = useState(() => readOnboardingComplete())

  useEffect(() => {
    try {
      localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections))
    } catch {
      // Keep the demo usable when browser storage is unavailable.
    }
  }, [connections])

  const value = useMemo<ConnectionsContextValue>(
    () => ({
      connections,
      onboardingComplete,
      isConnected(id) {
        return Boolean(connections[id]?.connected)
      },
      connectPlatform(id, accountLabel) {
        setConnections((previous) => ({
          ...previous,
          [id]: {
            connected: true,
            accountLabel,
            connectedAt: new Date().toISOString(),
          },
        }))
      },
      disconnectPlatform(id) {
        setConnections((previous) => ({
          ...previous,
          [id]: { connected: false },
        }))
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
    [connections, onboardingComplete],
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
