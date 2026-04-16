'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type AppType = 'home' | 'batia' | 'radar' | 'calculator' | 'notes' | 'calendar' | 'batcycle' | 'scanner' | 'files' | 'settings'

interface Note {
  id: number
  title: string
  content: string
  date: string
}

interface CalendarEvent {
  id: number
  title: string
  date: string
  time: string
}

export default function BatComputerApp() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [currentApp, setCurrentApp] = useState<AppType>('home')
  const [batteryLevel, setBatteryLevel] = useState(87)
  const [isOnline, setIsOnline] = useState(true)
  
  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrevious, setCalcPrevious] = useState('')
  const [calcOperation, setCalcOperation] = useState('')
  
  // Notes state
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Missão Gotham', content: 'Patrulhar distrito leste às 23h', date: '2024-01-15' }
  ])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  
  // Calendar state
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'Patrulha Noturna', date: '2024-01-20', time: '22:00' }
  ])
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventTime, setNewEventTime] = useState('')
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bat', text: string}[]>([
    { role: 'bat', text: 'Bem-vindo ao BatComputer, Mestre Bruce. Como posso ajudá-lo?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Scanner state
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  
  // Batcycle game state
  const [gameScore, setGameScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [playerPos, setPlayerPos] = useState(50)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
      setCurrentDate(now.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }))
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    createStars()
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const createStars = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.8,
        opacity: 0.3 + Math.random() * 0.7
      })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        ctx.fillStyle = `rgba(0, 255, 206, ${star.opacity * (0.5 + Math.random() * 0.5)})`
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

  // Calculator functions
  const calcHandleNumber = (num: string) => {
    setCalcDisplay(prev => prev === '0' ? num : prev + num)
  }
  
  const calcHandleOperation = (op: string) => {
    setCalcPrevious(calcDisplay)
    setCalcOperation(op)
    setCalcDisplay('0')
  }
  
  const calcHandleEqual = () => {
    const prev = parseFloat(calcPrevious)
    const current = parseFloat(calcDisplay)
    let result = 0
    switch (calcOperation) {
      case '+': result = prev + current; break
      case '-': result = prev - current; break
      case '*': result = prev * current; break
      case '/': result = prev / current; break
    }
    setCalcDisplay(result.toString())
    setCalcOperation('')
    setCalcPrevious('')
  }
  
  const calcClear = () => {
    setCalcDisplay('0')
    setCalcPrevious('')
    setCalcOperation('')
  }

  // Chat AI responses
  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setChatInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      const responses: Record<string, string> = {
        'olá': 'Olá, Mestre Bruce. Pronto para proteger Gotham esta noite?',
        'oi': 'Saudações. O BatComputer está totalmente operacional.',
        'gotham': 'Gotham City está sob monitoramento constante. Nenhuma atividade criminal significativa detectada no momento.',
        'coringa': 'ALERTA: O Coringa foi visto pela última vez no Asilo Arkham. Status: Contido.',
        'batman': 'Você é o Batman. O Cavaleiro das Trevas. Protetor de Gotham.',
        'ajuda': 'Posso ajudá-lo com: informações de vilões, status de Gotham, clima, e muito mais. O que deseja saber?',
        'clima': 'Gotham City: Noite nublada, 18°C. Visibilidade reduzida. Condições ideais para patrulha.',
        'hora': `Hora atual: ${currentTime}. Data: ${currentDate}.`,
        'alfred': 'Alfred Pennyworth está na Mansão Wayne. Última comunicação: 30 minutos atrás.',
        'robin': 'Robin está em patrulha no setor sul. Status: Ativo.',
        'batmovel': 'Batmóvel estacionado na Batcaverna. Combustível: 92%. Sistemas: Operacionais.',
      }
      
      const lowerInput = userMessage.toLowerCase()
      let response = 'Entendido, Mestre Bruce. Processando sua solicitação...'
      
      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value
          break
        }
      }
      
      setChatMessages(prev => [...prev, { role: 'bat', text: response }])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }, [chatInput, currentTime, currentDate])

  // Scanner function
  const startScan = () => {
    setIsScanning(true)
    setScanResult(null)
    
    setTimeout(() => {
      const results = [
        'RESULTADO: Nenhuma ameaça detectada na área.',
        'ALERTA: Assinatura térmica detectada a 200m nordeste.',
        'RESULTADO: 3 indivíduos identificados. Nível de ameaça: Baixo.',
        'ANÁLISE: Estrutura do edifício comprometida no 3º andar.',
        'DETECTADO: Frequência de rádio suspeita - 145.7 MHz'
      ]
      setScanResult(results[Math.floor(Math.random() * results.length)])
      setIsScanning(false)
    }, 3000)
  }

  // Save note
  const saveNote = () => {
    if (!noteTitle.trim()) return
    const newNote: Note = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toISOString().split('T')[0]
    }
    setNotes(prev => [...prev, newNote])
    setNoteTitle('')
    setNoteContent('')
    setCurrentNote(null)
  }

  // Add calendar event
  const addEvent = () => {
    if (!newEventTitle.trim() || !newEventDate) return
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime || '00:00'
    }
    setEvents(prev => [...prev, event])
    setNewEventTitle('')
    setNewEventDate('')
    setNewEventTime('')
  }

  // Batcycle game
  const startGame = () => {
    setGameActive(true)
    setGameScore(0)
    setPlayerPos(50)
  }

  const renderApp = () => {
    switch (currentApp) {
      case 'batia':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[rgba(0,255,200,0.2)] text-[var(--bat-text)]' 
                      : 'bg-[rgba(0,100,80,0.3)] text-[#e0fff8]'
                  }`}>
                    {msg.role === 'bat' && <span className="text-[var(--bat-gold)] text-xs block mb-1">BAT-IA</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[rgba(0,100,80,0.3)] p-3 rounded-xl text-[var(--bat-text)]">
                    <span className="animate-pulse">Processando...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-[rgba(0,255,200,0.2)] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none focus:border-[var(--bat-text)]"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-[var(--bat-text)] text-black rounded-lg font-bold text-sm"
              >
                Enviar
              </button>
            </div>
          </div>
        )
      
      case 'calculator':
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="w-full max-w-xs bg-[rgba(0,0,0,0.5)] rounded-xl p-4 border border-[rgba(0,255,200,0.3)]">
              <div className="text-right text-3xl text-[var(--bat-text)] font-mono mb-4 p-2 bg-[rgba(0,255,200,0.1)] rounded">
                {calcDisplay}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '=') calcHandleEqual()
                      else if (['+','-','*','/'].includes(btn)) calcHandleOperation(btn)
                      else calcHandleNumber(btn)
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-all active:scale-95 ${
                      ['+','-','*','/','='].includes(btn) 
                        ? 'bg-[var(--bat-text)] text-black' 
                        : 'bg-[rgba(0,255,200,0.15)] text-[var(--bat-text)]'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
              <button
                onClick={calcClear}
                className="w-full mt-2 p-3 bg-[rgba(255,100,100,0.3)] text-[#ff9999] rounded-lg font-bold"
              >
                LIMPAR
              </button>
            </div>
          </div>
        )
      
      case 'notes':
        return (
          <div className="p-4">
            {!currentNote ? (
              <>
                <div className="mb-4 space-y-2">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Título da nota..."
                    className="w-full bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none"
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Conteúdo..."
                    rows={3}
                    className="w-full bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none resize-none"
                  />
                  <button onClick={saveNote} className="w-full py-2 bg-[var(--bat-text)] text-black rounded-lg font-bold text-sm">
                    Salvar Nota
                  </button>
                </div>
                <div className="space-y-2">
                  {notes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => setCurrentNote(note)}
                      className="p-3 bg-[rgba(0,255,200,0.1)] rounded-lg border border-[rgba(0,255,200,0.2)] cursor-pointer"
                    >
                      <div className="text-[var(--bat-text)] font-bold text-sm">{note.title}</div>
                      <div className="text-[var(--bat-dim)] text-xs mt-1">{note.date}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <button onClick={() => setCurrentNote(null)} className="text-[var(--bat-text)] text-sm">← Voltar</button>
                <h3 className="text-[var(--bat-gold)] font-bold">{currentNote.title}</h3>
                <p className="text-[#e0fff8] text-sm">{currentNote.content}</p>
                <div className="text-[var(--bat-dim)] text-xs">{currentNote.date}</div>
              </div>
            )}
          </div>
        )
      
      case 'calendar':
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Título do evento..."
                className="w-full bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="flex-1 bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none"
                />
                <input
                  type="time"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-24 bg-[rgba(0,255,200,0.1)] border border-[rgba(0,255,200,0.3)] rounded-lg px-3 py-2 text-[var(--bat-text)] text-sm outline-none"
                />
              </div>
              <button onClick={addEvent} className="w-full py-2 bg-[var(--bat-text)] text-black rounded-lg font-bold text-sm">
                Adicionar Evento
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="text-[var(--bat-gold)] font-bold text-sm">Próximos Eventos</h3>
              {events.map(event => (
                <div key={event.id} className="p-3 bg-[rgba(0,255,200,0.1)] rounded-lg border border-[rgba(0,255,200,0.2)]">
                  <div className="text-[var(--bat-text)] font-bold text-sm">{event.title}</div>
                  <div className="text-[var(--bat-dim)] text-xs mt-1">{event.date} às {event.time}</div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'scanner':
        return (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <div className="w-48 h-48 rounded-full border-4 border-[var(--bat-text)] flex items-center justify-center mb-6 relative overflow-hidden">
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,255,200,0.3)] to-transparent animate-pulse" 
                  style={{ animation: 'scanLine 2s linear infinite' }} 
                />
              )}
              <svg viewBox="0 0 64 64" className="w-20 h-20 fill-[var(--bat-text)]">
                <ellipse cx="32" cy="32" rx="12" ry="9" />
                <polygon points="32,20 8,8 14,28" />
                <polygon points="32,20 56,8 50,28" />
              </svg>
            </div>
            <button
              onClick={startScan}
              disabled={isScanning}
              className="px-8 py-3 bg-[var(--bat-text)] text-black rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {isScanning ? 'ESCANEANDO...' : 'INICIAR SCAN'}
            </button>
            {scanResult && (
              <div className="mt-6 p-4 bg-[rgba(0,255,200,0.1)] rounded-lg border border-[rgba(0,255,200,0.3)] max-w-xs">
                <div className="text-[var(--bat-gold)] text-xs mb-1">RESULTADO DO SCAN</div>
                <div className="text-[#e0fff8] text-sm">{scanResult}</div>
              </div>
            )}
          </div>
        )
      
      case 'batcycle':
        return (
          <div className="p-4 flex flex-col items-center">
            <div className="text-[var(--bat-gold)] font-bold mb-2">BATCYCLE RIDER</div>
            <div className="text-[var(--bat-text)] text-sm mb-4">Pontuação: {gameScore}</div>
            <div 
              className="w-full max-w-xs h-64 bg-[rgba(0,0,0,0.5)] rounded-xl border border-[rgba(0,255,200,0.3)] relative overflow-hidden"
              onTouchMove={(e) => {
                if (!gameActive) return
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
                setPlayerPos(Math.max(10, Math.min(90, x)))
              }}
            >
              {gameActive ? (
                <>
                  {/* Road lines */}
                  <div className="absolute inset-0 flex justify-around">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-1 h-full bg-[rgba(255,255,255,0.2)]" style={{ animation: 'roadMove 0.5s linear infinite' }} />
                    ))}
                  </div>
                  {/* Player */}
                  <div 
                    className="absolute bottom-4 w-8 h-12 bg-[var(--bat-text)] rounded transition-all"
                    style={{ left: `${playerPos}%`, transform: 'translateX(-50%)' }}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-[var(--bat-text)] text-black rounded-xl font-bold"
                  >
                    INICIAR JOGO
                  </button>
                </div>
              )}
            </div>
            <div className="text-[var(--bat-dim)] text-xs mt-4">Deslize para mover a Batcycle</div>
          </div>
        )
      
      case 'radar':
        return (
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <div className="relative w-56 h-56">
              <div className="absolute inset-0 rounded-full border-2 border-[rgba(0,255,200,0.3)]" />
              <div className="absolute inset-4 rounded-full border border-[rgba(0,255,200,0.2)]" />
              <div className="absolute inset-8 rounded-full border border-[rgba(0,255,200,0.15)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-[var(--bat-text)] rounded-full" />
              </div>
              <div 
                className="absolute inset-0 origin-center"
                style={{ 
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,255,200,0.4) 30deg, transparent 60deg)',
                  animation: 'radarSweep 3s linear infinite'
                }}
              />
              {/* Blips */}
              <div className="absolute w-2 h-2 bg-[var(--bat-gold)] rounded-full animate-pulse" style={{ top: '30%', left: '60%' }} />
              <div className="absolute w-2 h-2 bg-[#ff6666] rounded-full animate-pulse" style={{ top: '70%', left: '25%' }} />
            </div>
            <div className="mt-6 text-center">
              <div className="text-[var(--bat-text)] text-sm font-bold">RADAR ATIVO</div>
              <div className="text-[var(--bat-dim)] text-xs mt-1">Monitorando raio de 5km</div>
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[var(--bat-gold)] rounded-full" />
                <span className="text-[var(--bat-dim)]">Aliado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-[#ff6666] rounded-full" />
                <span className="text-[var(--bat-dim)]">Ameaça</span>
              </div>
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-[var(--bat-gold)] font-bold">Configurações</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[rgba(0,255,200,0.1)] rounded-lg">
                <span className="text-[#e0fff8] text-sm">Bateria</span>
                <span className="text-[var(--bat-text)] text-sm">{batteryLevel}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[rgba(0,255,200,0.1)] rounded-lg">
                <span className="text-[#e0fff8] text-sm">Status</span>
                <span className={`text-sm ${isOnline ? 'text-[var(--bat-text)]' : 'text-[#ff6666]'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[rgba(0,255,200,0.1)] rounded-lg">
                <span className="text-[#e0fff8] text-sm">Versão</span>
                <span className="text-[var(--bat-text)] text-sm">v4.0 ULTIMATE</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[rgba(0,255,200,0.1)] rounded-lg">
                <span className="text-[#e0fff8] text-sm">Licença</span>
                <span className="text-[var(--bat-gold)] text-sm">ATIVADA</span>
              </div>
            </div>
          </div>
        )
      
      default: // home
        return (
          <div className="flex flex-col items-center justify-center h-full px-5">
            <svg 
              width="100" height="65" viewBox="0 0 64 40" 
              className="fill-[var(--bat-text)] mb-4"
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
            
            <h2 className="text-xl tracking-widest text-[var(--bat-text)] font-black mb-2"
              style={{ fontFamily: 'Arial Black, Impact, sans-serif', animation: 'pulse 2s infinite' }}
            >
              BATCOMPUTER v4.0
            </h2>
            
            <p className="text-sm text-[var(--bat-dim)] tracking-wider text-center max-w-xs mb-4">
              Sistema operacional totalmente ativo. Bem-vindo de volta, Mestre Bruce.
            </p>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-4">
              <div className="p-3 bg-[rgba(0,255,200,0.1)] rounded-lg border border-[rgba(0,255,200,0.2)] text-center">
                <div className="text-[var(--bat-gold)] text-lg font-bold">{batteryLevel}%</div>
                <div className="text-[var(--bat-dim)] text-xs">Bateria</div>
              </div>
              <div className="p-3 bg-[rgba(0,255,200,0.1)] rounded-lg border border-[rgba(0,255,200,0.2)] text-center">
                <div className="text-[var(--bat-text)] text-lg font-bold">{isOnline ? 'ON' : 'OFF'}</div>
                <div className="text-[var(--bat-dim)] text-xs">Status</div>
              </div>
            </div>
          </div>
        )
    }
  }

  const dockItems: { id: AppType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'batia', label: 'BAT-IA', icon: '🤖' },
    { id: 'radar', label: 'Radar', icon: '📡' },
    { id: 'scanner', label: 'Scanner', icon: '🔍' },
    { id: 'calculator', label: 'Calc', icon: '🧮' },
    { id: 'notes', label: 'Notas', icon: '📝' },
    { id: 'calendar', label: 'Agenda', icon: '📅' },
    { id: 'batcycle', label: 'Game', icon: '🎮' },
    { id: 'settings', label: 'Config', icon: '⚙️' },
  ]

  return (
    <div className="h-dvh overflow-hidden flex flex-col select-none bg-[#020210]">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Status Bar */}
      <header className="relative z-10 flex items-center justify-between px-3 py-2 border-b border-[var(--bat-border)]"
        style={{ background: 'linear-gradient(180deg, rgba(0, 10, 30, 0.98) 0%, rgba(2, 2, 16, 0.98) 100%)' }}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 64 64" className="w-6 h-6" style={{ animation: 'logoPulse 3s ease-in-out infinite' }}>
            <ellipse cx="32" cy="32" rx="12" ry="9" fill="#00ffcc" />
            <polygon points="32,20 8,8 14,28" fill="#00ffcc" />
            <polygon points="32,20 56,8 50,28" fill="#00ffcc" />
          </svg>
          <span className="text-[var(--bat-text)] text-xs font-bold tracking-wider">{currentDate}</span>
        </div>
        
        <h1 className="text-xs tracking-widest text-[var(--bat-text)] font-black uppercase">
          {currentApp === 'home' ? 'BatComputer' : dockItems.find(d => d.id === currentApp)?.label}
        </h1>
        
        <div className="flex items-center gap-2">
          <span className="text-[var(--bat-dim)] text-xs">{batteryLevel}%</span>
          <span className="text-[var(--bat-text)] text-xs font-bold">{currentTime}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-5 flex-1 overflow-hidden">
        {renderApp()}
      </main>

      {/* Dock */}
      <nav className="relative z-10 flex justify-center gap-1 py-2 px-2 border-t border-[rgba(0,255,200,0.2)] overflow-x-auto"
        style={{ background: 'linear-gradient(180deg, rgba(3, 3, 14, 0.99) 0%, rgba(2, 2, 10, 0.99) 100%)' }}
      >
        {dockItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentApp(item.id)}
            className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all active:scale-95 min-w-[48px] ${
              currentApp === item.id 
                ? 'bg-[rgba(0,255,200,0.2)] border border-[var(--bat-text)]' 
                : 'border border-transparent'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[8px] text-[var(--bat-dim)] mt-0.5">{item.label}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 5px #00ffcc); }
          50% { filter: drop-shadow(0 0 16px #00ffcc); }
        }
        @keyframes batFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes roadMove {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
