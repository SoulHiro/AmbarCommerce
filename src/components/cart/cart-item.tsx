'use client'

import Image from 'next/image'
import { getCart } from '@/actions/get-cart'
import { formatCentsToBRL } from '@/helpers/money'
import { FavoriteButton } from '@/components/common/favorite-button'
import { QuantityControl } from './quantity-control'
import { RemoveItemButton } from './remove-item-button'

type CartItemType = Awaited<ReturnType<typeof getCart>>['items'][number]

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { name: productName, id: productId } = item.productVariant.product

  return (
    <div className="flex gap-4">
      {/* Thumbnail */}
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-muted">
        <Image
          src={item.productVariant.imageUrl}
          alt={`${productName} — ${item.productVariant.color}`}
          fill
          className="object-cover object-center"
          sizes="64px"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.6rem] text-muted-foreground">
              <span className="font-medium uppercase tracking-[0.12em]">Cor</span>
              {'  '}{item.productVariant.color}
            </span>
            {item.productVariant.size && (
              <span className="text-[0.6rem] text-muted-foreground">
                <span className="font-medium uppercase tracking-[0.12em]">Tam</span>
                {'  '}{item.productVariant.size}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <FavoriteButton productId={productId} className="p-1" />
            <RemoveItemButton itemId={item.id} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControl itemId={item.id} quantity={item.quantity} />
          <span className="text-sm font-medium tabular-nums">
            {formatCentsToBRL(item.productVariant.priceInCents * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
