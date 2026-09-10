import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { useAuth } from './context/AuthContext'
import { useConnections } from './context/ConnectionsContext'
import { BusinessChatPage } from './pages/BusinessChatPage'
import { ConnectionsPage } from './pages/ConnectionsPage'
import { LoginPage } from './pages/LoginPage'
import { SettingsPage } from './pages/SettingsPage'
import { SmartTodoPage } from './pages/SmartTodoPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { TeamMembersPage } from './pages/TeamMembersPage'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

/** Main app only after user presses Continue on Connections (this session). */
function AppGate() {
  const { onboardingComplete } = useConnections()
  if (!onboardingComplete) return <Navigate to="/connections" replace />
  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route element={<AppGate />}>
          <Route element={<AppLayout />}>
            <Route path="/business-chat" element={<BusinessChatPage />} />
            <Route path="/todo" element={<SmartTodoPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/team" element={<TeamMembersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat" element={<Navigate to="/business-chat" replace />} />
            <Route path="/dashboard" element={<Navigate to="/business-chat" replace />} />
            <Route path="/agents" element={<Navigate to="/business-chat" replace />} />
            <Route path="/integrations" element={<Navigate to="/settings" replace />} />
            <Route path="/packing" element={<Navigate to="/todo" replace />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  const { onboardingComplete } = useConnections()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  // Authenticated users always hit Connections until they Continue this session.
  if (!onboardingComplete) return <Navigate to="/connections" replace />
  return <Navigate to="/business-chat" replace />
}
