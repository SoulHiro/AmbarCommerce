'use client'

import { toggleWishlist } from '@/actions/toggle-wishlist'
import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface FavoriteButtonProps {
  productId:       string
  initialFavorited: boolean
  isAuthenticated: boolean
  className?:      string
}

export function FavoriteButton({
  productId,
  initialFavorited,
  isAuthenticated,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push('/auth/sign-in')
      return
    }

    const prev = favorited
    setFavorited(f => !f)

    startTransition(async () => {
      try {
        await toggleWishlist({ productId })
      } catch {
        setFavorited(prev)
      }
    })
  }

  return (
    <button
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'absolute right-2 top-2 cursor-pointer bg-white/90 p-1.5 transition-colors disabled:cursor-not-allowed',
        favorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
        className,
      )}
    >
      <HeartIcon
        className="h-4 w-4"
        strokeWidth={1.5}
        fill={favorited ? 'currentColor' : 'none'}
      />
    </button>
  )
}
