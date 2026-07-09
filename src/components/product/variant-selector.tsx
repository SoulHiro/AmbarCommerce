'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

// Mapeamento de nome de cor → hex (mesmo do filter-sidebar para consistência)
const COLOR_HEX: Record<string, string> = {
  preto:         '#1c1c1a',
  branco:        '#f2f0ed',
  bege:          '#c8b89a',
  cinza:         '#9a9896',
  marinho:       '#1d2d44',
  azul:          '#4a7fa5',
  verde:         '#4a5e3a',
  'verde-oliva': '#6b7340',
  vinho:         '#6e2233',
  vermelho:      '#b83232',
  caramelo:      '#c67c3d',
  rosa:          '#d4899a',
  laranja:       '#d4823d',
  amarelo:       '#c9a227',
  nude:          '#d4b9a0',
}

interface Variant {
  id: string
  color: string
  priceInCents: number
  imageUrl: string
}

interface VariantSelectorProps {
  variants: Variant[]
}

export function VariantSelector({ variants }: VariantSelectorProps) {
  const [selected, setSelected] = useState<Variant>(variants[0])

  const colorLabel = selected.color.charAt(0).toUpperCase() + selected.color.slice(1)

  return (
    <div className="flex flex-col gap-3">
      {/* Label com cor selecionada */}
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Cor —{' '}
        <span className="text-[0.7rem] font-normal normal-case tracking-normal text-foreground">
          {colorLabel}
        </span>
      </p>

      {/* Swatches */}
      <div className="flex flex-wrap gap-3">
        {variants.map(variant => {
          const hex       = COLOR_HEX[variant.color.toLowerCase()] ?? '#888'
          const isSelected = variant.id === selected.id
          const label     = variant.color.charAt(0).toUpperCase() + variant.color.slice(1)

          return (
            <button
              key={variant.id}
              onClick={() => setSelected(variant)}
              title={label}
              aria-label={label}
              aria-pressed={isSelected}
              className={cn(
                'h-5 w-5 cursor-pointer rounded-full ring-offset-background transition-all',
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'ring-1 ring-border hover:ring-2 hover:ring-foreground/30',
              )}
              style={{ backgroundColor: hex }}
            />
          )
        })}
      </div>

      {/*
        TODO (funcionalidade — seu turno):
        - Ao clicar num swatch, propague `selected` para o componente pai
          para atualizar a imagem exibida e o preço.
        - Sugestão: receba `onVariantChange?: (variant: Variant) => void` como prop
          e chame-a dentro do onClick acima, junto ao setSelected(variant).
      */}
    </div>
  )
}
