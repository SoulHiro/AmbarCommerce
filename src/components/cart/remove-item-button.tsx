'use client'

import { Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartMutations } from '@/hooks/use-cart-mutations'

interface RemoveItemButtonProps {
  itemId: string
  className?: string
}

export function RemoveItemButton({ itemId, className }: RemoveItemButtonProps) {
  const { removeItem, isRemoving } = useCartMutations()

  return (
    <button
      onClick={() => removeItem(itemId)}
      disabled={isRemoving}
      aria-label="Remover item"
      className={cn(
        'flex h-6 w-6 cursor-pointer items-center justify-center text-muted-foreground/50 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30',
        className,
      )}
    >
      <Trash2Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
    </button>
  )
}
