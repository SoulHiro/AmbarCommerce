'use client'

import { COLOR_HEX } from '@/data/colors'
import { cn } from '@/lib/utils'
import { SlidersHorizontalIcon, StarIcon, XIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

const SORT_OPTIONS = [
  { value: 'relevancia',    label: 'Relevância'    },
  { value: 'menor-preco',   label: 'Menor preço'   },
  { value: 'maior-preco',   label: 'Maior preço'   },
  { value: 'mais-recentes', label: 'Mais recentes' },
]

// ─── Sidebar principal ────────────────────────────────────────────────────────

interface FilterSidebarProps {
  availableColors: string[]
  className?: string
}

export function FilterSidebar({ availableColors, className }: FilterSidebarProps) {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const ordenar       = searchParams.get('ordenar')    ?? 'relevancia'
  const coresAtivas   = searchParams.get('cores')?.split(',').filter(Boolean) ?? []
  const avaliacaoAtiva = searchParams.get('avaliacao') ?? ''

  const [precoMin, setPrecoMin] = useState(searchParams.get('preco-min') ?? '')
  const [precoMax, setPrecoMax] = useState(searchParams.get('preco-max') ?? '')

  const hasActiveFilters =
    coresAtivas.length > 0 || precoMin || precoMax || avaliacaoAtiva || ordenar !== 'relevancia'

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === '') params.delete(key)
      else params.set(key, value)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const toggleColor = useCallback(
    (color: string) => {
      const current = searchParams.get('cores')?.split(',').filter(Boolean) ?? []
      const next    = current.includes(color)
        ? current.filter(c => c !== color)
        : [...current, color]
      updateParam('cores', next.length > 0 ? next.join(',') : null)
    },
    [searchParams, updateParam],
  )

  const applyPrice = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (precoMin) params.set('preco-min', precoMin)
    else params.delete('preco-min')
    if (precoMax) params.set('preco-max', precoMax)
    else params.delete('preco-max')
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams, precoMin, precoMax])

  const clearAll = useCallback(() => {
    router.push('?', { scroll: false })
    setPrecoMin('')
    setPrecoMax('')
  }, [router])

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Limpar filtros */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="mb-5 flex cursor-pointer items-center gap-1.5 self-start text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          <XIcon className="h-3 w-3" strokeWidth={1.5} />
          Limpar filtros
        </button>
      )}

      {/* Ordenar */}
      <FilterSection label="Ordenar">
        <div className="flex flex-col gap-2.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateParam('ordenar', opt.value === 'relevancia' ? null : opt.value)}
              className={cn(
                'cursor-pointer text-left text-sm transition-colors',
                ordenar === opt.value
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Preço */}
      <FilterSection label="Preço">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <PriceInput label="De" value={precoMin} onChange={setPrecoMin} placeholder="0" />
            <PriceInput label="Até" value={precoMax} onChange={setPrecoMax} placeholder="—" />
          </div>
          <button
            onClick={applyPrice}
            className="cursor-pointer self-start border-b border-border pb-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Aplicar
          </button>
        </div>
      </FilterSection>

      {/* Cores */}
      {availableColors.length > 0 && (
        <FilterSection label="Cor">
          <div className="flex flex-wrap gap-3">
            {availableColors.map(color => {
              const hex        = COLOR_HEX[color] ?? '#888'
              const isSelected = coresAtivas.includes(color)
              const label      = color.charAt(0).toUpperCase() + color.slice(1)
              return (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  title={label}
                  aria-label={label}
                  aria-pressed={isSelected}
                  className={cn(
                    'h-[18px] w-[18px] cursor-pointer rounded-full ring-offset-background transition-all',
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'ring-1 ring-border hover:ring-2 hover:ring-foreground/40',
                  )}
                  style={{ backgroundColor: hex }}
                />
              )
            })}
          </div>
        </FilterSection>
      )}

      {/* Avaliação */}
      <FilterSection label="Avaliação">
        <div className="flex flex-col gap-3">
          {[4, 3, 2].map(stars => {
            const isActive = avaliacaoAtiva === String(stars)
            return (
              <button
                key={stars}
                onClick={() => updateParam('avaliacao', isActive ? null : String(stars))}
                className={cn(
                  'flex cursor-pointer items-center gap-2 transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Stars count={stars} active={isActive} />
                <span className="text-xs">ou mais</span>
              </button>
            )
          })}
        </div>
      </FilterSection>
    </div>
  )
}

// ─── Drawer mobile ────────────────────────────────────────────────────────────

export function MobileFilterDrawer({ availableColors }: { availableColors: string[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden">
          <SlidersHorizontalIcon className="h-4 w-4" strokeWidth={1.5} />
          Filtrar
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold uppercase tracking-widest">
            Filtros
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-10">
          <FilterSidebar availableColors={availableColors} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Subcomponentes internos ──────────────────────────────────────────────────

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-6 first:border-t-0 first:pt-0">
      <p className="mb-4 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function PriceInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-[0.6rem] text-muted-foreground">{label}</span>
      <div className="flex items-center border-b border-border pb-1 transition-colors focus-within:border-foreground">
        <span className="mr-1 text-xs text-muted-foreground">R$</span>
        <input
          type="number"
          min="0"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
    </label>
  )
}

function Stars({ count, active }: { count: number; active: boolean }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          strokeWidth={1.25}
          className={cn(
            'h-3.5 w-3.5',
            i < count
              ? active
                ? 'fill-primary stroke-primary'
                : 'fill-muted-foreground stroke-muted-foreground'
              : 'stroke-border',
          )}
        />
      ))}
    </div>
  )
}
