'use client'

import { useState, useEffect } from 'react'
import Paywall from '@/components/paywall'
import BatComputerApp from '@/components/batcomputer-app'
import LoginScreen from '@/components/login-screen'

type AuthState = 'loading' | 'login' | 'paywall' | 'app'

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    const devAccess = localStorage.getItem('bat-dev-access') === 'true'
    const paidAccess = localStorage.getItem('bat-access') === 'true'
    
    if (devAccess) {
      setIsDevMode(true)
      setAuthState('app')
    } else if (paidAccess) {
      setAuthState('app')
    } else {
      setAuthState('login')
    }
  }, [])

  const handleDevLogin = () => {
    localStorage.setItem('bat-dev-access', 'true')
    setIsDevMode(true)
    setAuthState('app')
  }

  const handleContinueToPayment = () => {
    setAuthState('paywall')
  }

  const handlePaymentComplete = () => {
    localStorage.setItem('bat-access', 'true')
    setAuthState('app')
  }

  const handleLogout = () => {
    localStorage.removeItem('bat-access')
    localStorage.removeItem('bat-dev-access')
    setIsDevMode(false)
    setAuthState('login')
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <div className="text-[var(--bat-text)] animate-pulse tracking-widest text-sm">
          INICIANDO SISTEMA...
        </div>
      </div>
    )
  }

  if (authState === 'login') {
    return (
      <LoginScreen 
        onDevLogin={handleDevLogin} 
        onContinueToPayment={handleContinueToPayment} 
      />
    )
  }

  if (authState === 'paywall') {
    return <Paywall onAccessGranted={handlePaymentComplete} />
  }

  return <BatComputerApp isDevMode={isDevMode} onLogout={handleLogout} />
}
