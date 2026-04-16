'use client'

import { useState, useEffect } from 'react'
import Paywall from '@/components/paywall'
import BatComputerApp from '@/components/batcomputer-app'

export default function Home() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    // Verifica se tem acesso salvo
    const access = localStorage.getItem('bat-access') === 'true'
    setHasAccess(access)
  }, [])

  const handleAccessGranted = () => {
    setHasAccess(true)
  }

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="min-h-dvh bg-[#010108] flex items-center justify-center">
        <div className="text-[var(--bat-text)] animate-pulse tracking-widest">
          INICIANDO...
        </div>
      </div>
    )
  }

  // Se não tem acesso, mostra paywall
  if (!hasAccess) {
    return <Paywall onAccessGranted={handleAccessGranted} />
  }

  // Se tem acesso, mostra o app
  return <BatComputerApp />
}
