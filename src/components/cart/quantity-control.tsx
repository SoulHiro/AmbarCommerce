'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityControlProps {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  isPending?: boolean
  className?: string
}

export function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
  isPending = false,
  className,
}: QuantityControlProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={onDecrease}
        disabled={isPending || quantity <= 1}
        aria-label="Diminuir quantidade"
        className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <MinusIcon className="h-3 w-3" strokeWidth={1.5} />
      </button>

      <span className="w-5 text-center text-sm tabular-nums">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={isPending}
        aria-label="Aumentar quantidade"
        className="flex h-6 w-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <PlusIcon className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  )
}
