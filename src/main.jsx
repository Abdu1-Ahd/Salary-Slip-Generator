import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import './index.css'
import App from './App.jsx'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root'))

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.toString().includes('Clerk')) {
    root.render(
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-lg w-full text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-600 mb-2">Clerk Initialization Error</h1>
          <p className="text-slate-600">The application failed to load Clerk Authentication. Please verify your <code className="bg-slate-100 px-1 rounded text-slate-800">VITE_CLERK_PUBLISHABLE_KEY</code> in <code className="bg-slate-100 px-1 rounded text-slate-800">.env.local</code> is valid.</p>
        </div>
      </div>
    )
  }
});

root.render(
  <StrictMode>
    <ErrorBoundary>
      {PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      ) : (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-lg p-6 max-w-lg w-full text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600 mb-2">Missing Configuration</h1>
            <p className="text-slate-600">Please configure <code className="bg-slate-100 px-1 rounded text-slate-800">VITE_CLERK_PUBLISHABLE_KEY</code> in your <code className="bg-slate-100 px-1 rounded text-slate-800">.env.local</code> file to use this application.</p>
          </div>
        </div>
      )}
    </ErrorBoundary>
  </StrictMode>,
)
