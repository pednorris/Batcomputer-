'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Checkout = dynamic(() => import('./checkout'), { 
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="text-[var(--bat-text)] animate-pulse">Carregando pagamento...</div>
    </div>
  )
})

interface PaywallProps {
  onAccessGranted: () => void
}

export default function Paywall({ onAccessGranted }: PaywallProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Verifica se já tem acesso salvo
    const hasAccess = localStorage.getItem('bat-access') === 'true'
    if (hasAccess) {
      onAccessGranted()
    }
  }, [onAccessGranted])

  const handlePaymentComplete = () => {
    setIsProcessing(true)
    // Salva acesso no localStorage
    localStorage.setItem('bat-access', 'true')
    
    setTimeout(() => {
      onAccessGranted()
    }, 1500)
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-center gap-6 p-5">
        <svg width="80" height="52" viewBox="0 0 64 40" className="fill-[var(--bat-text)] animate-pulse" style={{ filter: 'drop-shadow(0 0 14px #00ffcc)' }}>
          <ellipse cx="32" cy="22" rx="10" ry="8" />
          <polygon points="32,14 6,2 12,22" />
          <polygon points="32,14 58,2 52,22" />
          <polygon points="6,2 0,10 12,14" />
          <polygon points="58,2 64,10 52,14" />
          <polygon points="18,22 12,32 22,26" />
          <polygon points="46,22 52,32 42,26" />
        </svg>
        <div className="text-[var(--bat-text)] text-xl font-bold tracking-widest animate-pulse">
          PAGAMENTO CONFIRMADO!
        </div>
        <div className="text-[var(--bat-gold)] text-sm tracking-wider">
          Liberando acesso ao BatComputer...
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-start p-5 pt-8 overflow-y-auto">
        <div className="text-[var(--bat-gold)] text-xl font-bold mb-4 tracking-widest" style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '0 0 14px rgba(255,204,0,0.5)' }}>
          PAGAMENTO SEGURO
        </div>
        
        <div className="text-white text-2xl font-black mb-4" style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '0 0 14px rgba(255,204,0,0.4)' }}>
          R$ 5,00
        </div>

        <div className="w-full max-w-md mb-4">
          <Checkout 
            productId="batcomputer-ultimate" 
            onComplete={handlePaymentComplete}
          />
        </div>

        <button
          onClick={() => setShowCheckout(false)}
          className="mt-4 text-[#005544] text-sm underline cursor-pointer"
        >
          ← Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999999] flex flex-col items-center justify-start pt-12 px-5 overflow-y-auto gap-4">
      <div 
        className="text-[var(--bat-gold)] text-2xl font-bold mb-2 tracking-widest text-center"
        style={{ fontFamily: 'Arial Black, sans-serif', textShadow: '0 0 20px rgba(255,204,0,0.5)' }}
      >
        BATCOMPUTER ULTIMATE
      </div>
      
      <svg width="80" height="52" viewBox="0 0 64 40" className="fill-[var(--bat-text)]" style={{ filter: 'drop-shadow(0 0 14px #00ffcc)' }}>
        <ellipse cx="32" cy="22" rx="10" ry="8" />
        <polygon points="32,14 6,2 12,22" />
        <polygon points="32,14 58,2 52,22" />
        <polygon points="6,2 0,10 12,14" />
        <polygon points="58,2 64,10 52,14" />
        <polygon points="18,22 12,32 22,26" />
        <polygon points="46,22 52,32 42,26" />
      </svg>
      
      <ul className="text-left text-[#e0fff8] text-sm mb-4 leading-8 list-none">
        <li>🔐 Códigos Mestres Ativados</li>
        <li>🛰️ Scanner Bio-Tecnológico</li>
        <li>🦇 Bat-IA Claude Online</li>
        <li>🎮 Bat-Cycle Rider Incluído</li>
        <li>🃏 DC Games Desbloqueados</li>
      </ul>

      <button
        onClick={() => setShowCheckout(true)}
        className="w-full max-w-xs py-4 px-6 bg-gradient-to-r from-[#00ffcc] to-[#00cc99] text-black border-none rounded-xl font-black text-base tracking-widest cursor-pointer transition-transform active:scale-95"
        style={{ fontFamily: 'Arial Black, sans-serif', boxShadow: '0 0 30px rgba(0, 255, 200, 0.4)' }}
      >
        LIBERAR ACESSO — R$ 5,00
      </button>

      <div className="text-xs text-[#006655] mt-4 text-center max-w-xs">
        Pagamento 100% seguro via Stripe. 
        Cartão de crédito, débito ou Pix.
      </div>
    </div>
  )
}
