'use client'

import { toggleWishlist } from '@/actions/toggle-wishlist'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface FavoriteButtonProps {
  productId:        string
  initialFavorited: boolean
  className?:       string
}

export function FavoriteButton({
  productId,
  initialFavorited,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()
  const { data: session } = authClient.useSession()
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
        'absolute right-2 top-2 z-10 cursor-pointer p-1 transition-colors disabled:cursor-not-allowed',
        favorited ? 'text-primary' : 'text-muted-foreground/60 hover:text-primary',
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
