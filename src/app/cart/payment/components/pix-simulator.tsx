'use client'

import { useState, useEffect } from 'react'
import { CopyIcon, CheckIcon } from 'lucide-react'

const PIX_KEY = 'pagamento@ambar.com.br'
const MOCK_CODE = '00020126360014BR.GOV.BCB.PIX0114pagamento@ambar.com.br5204000053039865802BR5913Ambar Fashion6009Sao Paulo62070503***6304ABCD'

interface PixSimulatorProps {
  totalInCents: number
}

export function PixSimulator({ totalInCents }: PixSimulatorProps) {
  const [copied, setCopied] = useState(false)
  const [seconds, setSeconds] = useState(15 * 60)

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const expired = seconds === 0

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium">Escaneie o QR Code ou copie o código</p>
        <p className="text-xs text-muted-foreground">
          Chave PIX: <span className="font-medium text-foreground">{PIX_KEY}</span>
        </p>
      </div>

      {/* Mock QR Code */}
      <div className={`relative border border-border p-4 ${expired ? 'opacity-40' : ''}`}>
        <svg width="180" height="180" viewBox="0 0 180 180" className="block">
          {/* Finder patterns */}
          <rect x="10" y="10" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="6"/>
          <rect x="20" y="20" width="30" height="30" fill="currentColor"/>
          <rect x="120" y="10" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="6"/>
          <rect x="130" y="20" width="30" height="30" fill="currentColor"/>
          <rect x="10" y="120" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="6"/>
          <rect x="20" y="130" width="30" height="30" fill="currentColor"/>
          {/* Data modules (mock pattern) */}
          {[70,76,82,88,94,100,106,112].map((x, i) =>
            [10,18,26,34,42,50,58,66,74,82,90,98,106,114,122,130,138,146,154,162].map((y, j) =>
              (i + j) % 3 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="currentColor" opacity="0.8"/> : null
            )
          )}
          {[10,18,26,34,42,50,58,66].map((y, j) =>
            [70,78,86,94,102,110,118,126,134,142,150,158,166].map((x, i) =>
              (i + j) % 2 !== 0 ? <rect key={`d${x}-${y}`} x={x} y={y} width="5" height="5" fill="currentColor" opacity="0.9"/> : null
            )
          )}
        </svg>
        {expired && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="text-xs font-medium text-destructive">Expirado</span>
          </div>
        )}
      </div>

      {/* Countdown */}
      {!expired && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Expira em</span>
          <span className="font-mono font-medium text-foreground">
            {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={expired}
        className="flex w-full items-center justify-center gap-2 border border-border py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5 text-primary" /> : <CopyIcon className="h-3.5 w-3.5" />}
        {copied ? 'Copiado!' : 'Copiar código PIX'}
      </button>

      <div className="w-full border border-border bg-muted/40 px-4 py-3">
        <p className="text-center text-[0.65rem] text-muted-foreground">
          Ambiente de demonstração. Nenhuma cobrança real será efetuada.
        </p>
      </div>
    </div>
  )
}
