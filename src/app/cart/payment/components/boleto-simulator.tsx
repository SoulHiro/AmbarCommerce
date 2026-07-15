'use client'

import { useState } from 'react'
import { CopyIcon, CheckIcon } from 'lucide-react'

const MOCK_BARCODE = '34191.09008 64013.455044 05442.140004 1 10100000050000'

export function BoletoSimulator() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_BARCODE.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Barcode visual */}
      <div className="flex flex-col items-center gap-4">
        <svg width="280" height="80" viewBox="0 0 280 80" className="block">
          {Array.from({ length: 70 }, (_, i) => (
            <rect
              key={i}
              x={i * 4}
              y={0}
              width={i % 5 === 0 ? 2 : i % 3 === 0 ? 3 : 1}
              height={80}
              fill="currentColor"
              opacity={i % 7 === 0 ? 0.3 : 1}
            />
          ))}
        </svg>

        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          {MOCK_BARCODE}
        </p>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 border border-border p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Beneficiário</span>
          <span className="text-xs font-medium">Âmbar Fashion LTDA</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Vencimento</span>
          <span className="text-xs font-medium">
            {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Instruções</span>
          <span className="text-xs text-muted-foreground">Não receber após o vencimento</span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="flex w-full items-center justify-center gap-2 border border-border py-3 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-accent"
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5 text-primary" /> : <CopyIcon className="h-3.5 w-3.5" />}
        {copied ? 'Copiado!' : 'Copiar linha digitável'}
      </button>

      <div className="border border-border bg-muted/40 px-4 py-3">
        <p className="text-center text-[0.65rem] text-muted-foreground">
          Ambiente de demonstração. Nenhuma cobrança real será efetuada.
        </p>
      </div>
    </div>
  )
}
