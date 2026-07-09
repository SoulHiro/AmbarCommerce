'use client'

import { HeartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  className?: string
}

export function FavoriteButton({ className }: FavoriteButtonProps) {
  return (
    <button
      aria-label="Adicionar aos favoritos"
      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
      className={cn(
        'absolute right-2 top-2 bg-white/90 p-1.5 text-muted-foreground',
        'transition-colors hover:text-primary',
        className,
      )}
    >
      <HeartIcon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  )
}
