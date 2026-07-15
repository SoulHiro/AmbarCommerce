'use client'

import { useState } from 'react'

export function CreditCardSimulator() {
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [flipped, setFlipped] = useState(false)

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4)
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Card visual */}
      <div className="relative mx-auto h-44 w-72 select-none" style={{ perspective: '1000px' }}>
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col justify-between bg-foreground p-6"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-start justify-between">
              <div className="h-6 w-10 rounded-sm bg-primary/60" />
              <span className="font-heading text-xs font-semibold tracking-widest text-background/60 uppercase">
                Âmbar
              </span>
            </div>
            <div>
              <p className="font-mono text-base tracking-[0.2em] text-background">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-wider text-background/50">Titular</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-background">
                    {cardName || 'SEU NOME'}
                  </p>
                </div>
                <div>
                  <p className="text-[0.55rem] uppercase tracking-wider text-background/50">Validade</p>
                  <p className="text-xs font-medium text-background">{expiry || 'MM/AA'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col bg-foreground"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="mt-6 h-10 bg-background/20" />
            <div className="mt-4 mr-6 flex items-center justify-end gap-3">
              <div className="h-8 flex-1 bg-background/10" />
              <div className="flex h-8 w-14 items-center justify-center bg-background/90">
                <span className="font-mono text-sm text-foreground">{cvv || '•••'}</span>
              </div>
            </div>
            <p className="mt-2 text-right pr-6 text-[0.55rem] text-background/40">CVV</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Número do cartão
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="border-b border-input bg-transparent pb-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nome no cartão
          </label>
          <input
            type="text"
            placeholder="Como está impresso no cartão"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            className="border-b border-input bg-transparent pb-2 text-sm uppercase outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Validade
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="border-b border-input bg-transparent pb-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              CVV
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="•••"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
              className="border-b border-input bg-transparent pb-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
            />
          </div>
        </div>
      </div>

      <div className="rounded-none border border-border bg-muted/40 px-4 py-3">
        <p className="text-center text-[0.65rem] text-muted-foreground">
          Ambiente de testes. Nenhum dado é processado ou cobrado.
        </p>
      </div>
    </div>
  )
}
