'use client'

import { useState, useEffect, useRef } from 'react'

export default function BatComputerApp() {
  const [currentTime, setCurrentTime] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Atualiza relógio
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'))
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)

    // Cria estrelas
    createStars()

    return () => clearInterval(interval)
  }, [])

  const createStars = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; size: number; speed: number }[] = []
    
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: 0.5 + Math.random() * 1
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach(star => {
        ctx.fillStyle = `rgba(0, 255, 206, ${0.3 + Math.random() * 0.7})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  return (
    <div className="h-dvh overflow-hidden flex flex-col select-none">
      {/* Canvas de estrelas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-[var(--bat-border)]"
        style={{ 
          background: 'linear-gradient(180deg, rgba(0, 10, 30, 0.98) 0%, rgba(2, 2, 16, 0.98) 100%)',
          boxShadow: '0 2px 20px rgba(0, 255, 200, 0.15)'
        }}
      >
        <svg viewBox="0 0 64 64" className="w-9 h-9" style={{ animation: 'logoPulse 3s ease-in-out infinite' }}>
          <ellipse cx="32" cy="32" rx="12" ry="9" fill="#00ffcc" />
          <polygon points="32,20 8,8 14,28" fill="#00ffcc" />
          <polygon points="32,20 56,8 50,28" fill="#00ffcc" />
          <polygon points="8,8 2,16 14,20" fill="#00ffcc" />
          <polygon points="56,8 62,16 50,20" fill="#00ffcc" />
          <polygon points="20,28 14,38 26,32" fill="#00ffcc" />
          <polygon points="44,28 50,38 38,32" fill="#00ffcc" />
        </svg>
        
        <h1 
          className="text-sm tracking-widest text-[var(--bat-text)] font-black"
          style={{ fontFamily: 'Arial Black, Impact, sans-serif', textShadow: 'var(--glow)' }}
        >
          BATCOMPUTER
        </h1>
        
        <div 
          className="text-xs tracking-wider text-[var(--bat-text)]"
          style={{ fontFamily: 'Arial Black, Impact, sans-serif', textShadow: '0 0 6px var(--bat-text)' }}
        >
          {currentTime}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-5 flex-1 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4 text-center px-5">
          <svg 
            width="90" height="58" viewBox="0 0 64 40" 
            className="fill-[var(--bat-text)]"
            style={{ 
              filter: 'drop-shadow(0 0 14px #00ffcc) drop-shadow(0 0 28px rgba(0, 255, 200, 0.4))',
              animation: 'batFloat 3s ease-in-out infinite'
            }}
          >
            <ellipse cx="32" cy="22" rx="10" ry="8" />
            <polygon points="32,14 6,2 12,22" />
            <polygon points="32,14 58,2 52,22" />
            <polygon points="6,2 0,10 12,14" />
            <polygon points="58,2 64,10 52,14" />
            <polygon points="18,22 12,32 22,26" />
            <polygon points="46,22 52,32 42,26" />
          </svg>
          
          <h2 
            className="text-xl tracking-widest text-[var(--bat-text)] font-black"
            style={{ fontFamily: 'Arial Black, Impact, sans-serif', animation: 'pulse 2s infinite' }}
          >
            BATIA ONLINE
          </h2>
          
          <p className="text-sm text-[var(--bat-dim)] tracking-wider max-w-xs">
            Sistema operacional iniciado. Monitorando Gotham City...
          </p>
          
          <p className="text-[var(--bat-text)] text-xs mt-2 tracking-widest">
            ● BATCOMPUTER v3.0 FINAL
          </p>
          
          <div className="flex gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--bat-text)]" style={{ animation: 'blink 1s 0s infinite' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--bat-text)]" style={{ animation: 'blink 1s 0.3s infinite' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--bat-text)]" style={{ animation: 'blink 1s 0.6s infinite' }} />
          </div>
        </div>
      </main>

      {/* Dock */}
      <nav 
        className="relative z-10 flex justify-center gap-3 py-2 px-4 flex-wrap border-t border-[rgba(0,255,200,0.2)]"
        style={{ background: 'linear-gradient(180deg, rgba(3, 3, 14, 0.99) 0%, rgba(2, 2, 10, 0.99) 100%)' }}
      >
        {['BAT-IA', 'RADAR', 'CALCULAR', 'NOTAS', 'AGENDA'].map((item) => (
          <button
            key={item}
            className="px-4 py-2 text-xs tracking-wider text-[var(--bat-text)] border border-[rgba(0,255,200,0.4)] rounded-lg cursor-pointer transition-all active:scale-95 active:bg-[rgba(0,255,200,0.2)]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 255, 200, 0.08) 0%, rgba(0, 100, 80, 0.05) 100%)',
              textShadow: '0 0 8px var(--bat-text)',
              boxShadow: '0 0 10px rgba(0, 255, 200, 0.05), inset 0 1px 0 rgba(0, 255, 200, 0.1)'
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <style jsx>{`
        @keyframes logoPulse {
          0%, 100% {
            filter: drop-shadow(0 0 5px #00ffcc) drop-shadow(0 0 10px rgba(0, 255, 200, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 16px #00ffcc) drop-shadow(0 0 32px rgba(0, 255, 200, 0.5));
          }
        }
      `}</style>
    </div>
  )
}
