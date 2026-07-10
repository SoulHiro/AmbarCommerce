'use client'

import { productTable, productVariantTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import Image from 'next/image'
import Link from 'next/link'
import { FavoriteButton } from '@/components/common/favorite-button'

type Product = typeof productTable.$inferSelect & {
  variants: (typeof productVariantTable.$inferSelect)[]
}

interface WishlistItemProps {
  product: Product
  onUnfavorite: () => void
}

export function WishlistItem({ product, onUnfavorite }: WishlistItemProps) {
  const firstVariant = product.variants[0]
  if (!firstVariant) return null

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
      >
        <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={firstVariant.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <p className="truncate text-sm font-medium">{product.name}</p>
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {product.description}
          </p>
        </div>

        <p className="mt-3 text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </Link>

      <FavoriteButton
        productId={product.id}
        initialFavorited={true}
        className="absolute right-2 top-2 z-10 p-1"
        onToggle={(favorited) => {
          if (!favorited) onUnfavorite()
        }}
      />
    </div>
  )
}
