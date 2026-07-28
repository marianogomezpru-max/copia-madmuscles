import { useEffect, useRef, useState } from 'react'

// Gold foil layer over a canvas; dragging erases it (destination-out) to
// reveal the discount underneath. Auto-reveals fully once enough of the
// card has been scratched, so people don't have to be pixel-perfect.
export default function ScratchCard({ discountLabel, onRevealed }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f5d67e')
    gradient.addColorStop(0.5, '#d4a94a')
    gradient.addColorStop(1, '#f5d67e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('RASPÁ AQUÍ', width / 2, height / 2)
  }, [])

  const checkRevealPct = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    const pixels = ctx.getImageData(0, 0, width, height).data
    let cleared = 0
    for (let i = 3; i < pixels.length; i += 4 * 20) {
      if (pixels[i] === 0) cleared++
    }
    const pct = cleared / (pixels.length / (4 * 20))
    if (pct > 0.35 && !revealed) {
      setRevealed(true)
      onRevealed?.()
    }
  }

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * canvas.width
    const y = ((clientY - rect.top) / rect.height) * canvas.height
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x, y, 26, 0, Math.PI * 2)
    ctx.fill()
  }

  const start = e => {
    drawing.current = true
    const p = e.touches ? e.touches[0] : e
    scratchAt(p.clientX, p.clientY)
  }
  const move = e => {
    if (!drawing.current) return
    const p = e.touches ? e.touches[0] : e
    scratchAt(p.clientX, p.clientY)
    checkRevealPct()
  }
  const end = () => {
    drawing.current = false
    checkRevealPct()
  }

  return (
    <div className="relative w-64 h-64 max-w-full mx-auto rounded-2xl overflow-hidden border-4 border-amber-300 shadow-lg select-none">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900 text-white">
        <p className="text-4xl font-black">{discountLabel}</p>
        <p className="text-xs font-bold uppercase text-brand-300 mt-1">de descuento</p>
      </div>
      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-700 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
    </div>
  )
}
