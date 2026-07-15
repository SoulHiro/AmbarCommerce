'use client'

import { toggleWishlist } from '@/actions/toggle-wishlist'
import { getWishlistIds } from '@/actions/get-wishlist-ids'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useQuery } from '@tanstack/react-query'

interface FavoriteButtonProps {
  productId:        string
  initialFavorited?: boolean
  showLabel?:        boolean
  className?:        string
  onToggle?:         (favorited: boolean) => void
}

export function FavoriteButton({
  productId,
  initialFavorited,
  showLabel = false,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { data: session } = authClient.useSession()
  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlist-ids'],
    queryFn: () => getWishlistIds(),
    enabled: !!session?.user,
  })

  const [favorited, setFavorited] = useState(
    initialFavorited ?? wishlistIds.includes(productId),
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push('/auth/sign-in')
      return
    }

    const prev = favorited
    setFavorited(f => !f)

    startTransition(async () => {
      try {
        await toggleWishlist({ productId })
        onToggle?.(!prev)
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
        'flex cursor-pointer items-center gap-1.5 transition-colors disabled:cursor-not-allowed',
        favorited ? 'text-primary' : 'text-muted-foreground/60 hover:text-primary',
        className,
      )}
    >
      <HeartIcon
        className="h-4 w-4 flex-shrink-0"
        strokeWidth={1.5}
        fill={favorited ? 'currentColor' : 'none'}
      />
      {showLabel && (
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.14em]">
          {favorited ? 'Salvo' : 'Favoritar'}
        </span>
      )}
    </button>
  )
}
