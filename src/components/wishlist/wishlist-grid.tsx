'use client'

import { productTable, productVariantTable } from '@/db/schema'
import { HeartIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { WishlistItem } from './wishlist-item'

type Product = typeof productTable.$inferSelect & {
  variants: (typeof productVariantTable.$inferSelect)[]
}

interface WishlistGridProps {
  initialProducts: Product[]
}

export function WishlistGrid({ initialProducts }: WishlistGridProps) {
  const [products, setProducts] = useState(initialProducts)

  const handleUnfavorite = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <HeartIcon
          className="mb-6 h-10 w-10 text-muted-foreground/20"
          strokeWidth={1}
        />
        <p className="font-heading text-lg font-semibold">Nenhuma peça salva</p>
        <p className="mt-2 max-w-[26ch] text-sm text-muted-foreground">
          Explore a coleção e salve as peças que mais gostar.
        </p>
        <Link
          href="/products"
          className="mt-6 border-b border-border pb-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          Ver coleção
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map(product => (
        <WishlistItem
          key={product.id}
          product={product}
          onUnfavorite={() => handleUnfavorite(product.id)}
        />
      ))}
    </div>
  )
}
