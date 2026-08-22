import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './App'
import './index.css'

if (typeof window !== 'undefined') {
  ;(window as any).global = window
}

if (import.meta.env.PROD) {
  console.log = () => {}
  console.warn = () => {}
  // Keep console.error for debugging
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found, cannot render app')
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}