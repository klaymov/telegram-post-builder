import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Expand Telegram WebApp to full height
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        expand: () => void
        ready: () => void
        themeParams: Record<string, string>
      }
    }
  }
}

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.expand()
  window.Telegram.WebApp.ready()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
