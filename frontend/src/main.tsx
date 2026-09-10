import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ConnectionsProvider } from './context/ConnectionsContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ConnectionsProvider>
          <App />
        </ConnectionsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
