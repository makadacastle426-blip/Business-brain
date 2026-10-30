import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import type { PlanId } from '../data/appData'
import { firebaseAuth, firebaseDb } from '../firebase'

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
  authLoading: boolean
  plan: PlanId
  setPlan: (plan: PlanId) => void
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'business-brain-auth'
const PLAN_KEY = 'business-brain-plan'

function toUser(firebaseUser: FirebaseUser): User {
  return {
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || DEMO_USER_NAME,
    email: firebaseUser.email || DEMO_USER_EMAIL,
    role: 'Owner',
    business: DEMO_BUSINESS,
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

// Profile persistence is optional for authentication and must not block entry.
async function syncUserProfile(firebaseUser: FirebaseUser) {
  try {
    const profile = doc(firebaseDb, 'users', firebaseUser.uid)
    const existing = await getDoc(profile)
    if (!existing.exists()) {
      await setDoc(profile, {
        ...toUser(firebaseUser),
        createdAt: new Date().toISOString(),
      })
    }
  } catch {
    console.warn('Signed in, but the user profile could not be synced to Firestore.')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [plan, setPlanState] = useState<PlanId>(() => readStoredPlan())

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      const next = firebaseUser ? toUser(firebaseUser) : null
      setUser(next)
      setAuthLoading(false)
      if (next) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      plan,
      setPlan(next) {
        localStorage.setItem(PLAN_KEY, next)
        setPlanState(next)
      },
      async login(email: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
        void syncUserProfile(userCredential.user)
        return true
      },
      async signup(email: string, password: string) {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
        void syncUserProfile(userCredential.user)
        return true
      },
      async loginWithGoogle() {
        await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
        return true
      },
      logout() {
        void signOut(firebaseAuth)
      },
    }),
    [authLoading, plan, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
