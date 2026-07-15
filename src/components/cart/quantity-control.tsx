'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartMutations } from '@/hooks/use-cart-mutations'

interface QuantityControlProps {
  itemId: string
  quantity: number
  className?: string
}

export function QuantityControl({ itemId, quantity, className }: QuantityControlProps) {
  const { updateQty } = useCartMutations()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => updateQty({ cartItemId: itemId, quantity: quantity - 1 })}
        disabled={quantity <= 1}
        aria-label="Diminuir quantidade"
        className="flex h-6 w-6 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <MinusIcon className="h-3 w-3" strokeWidth={1.5} />
      </button>

      <span className="w-5 text-center text-sm tabular-nums">{quantity}</span>

      <button
        onClick={() => updateQty({ cartItemId: itemId, quantity: quantity + 1 })}
        aria-label="Aumentar quantidade"
        className="flex h-6 w-6 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
      >
        <PlusIcon className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  )
}
