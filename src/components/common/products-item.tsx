import { productTable, productVariantTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import Image from 'next/image'
import Link from 'next/link'
import { FavoriteButton } from './favorite-button'

interface ProductsItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[]
  }
  isFavorited?:    boolean
  isAuthenticated?: boolean
}

export const ProductItem = ({
  product,
  isFavorited = false,
  isAuthenticated = false,
}: ProductsItemProps) => {
  const firstVariant = product.variants[0]

  if (!firstVariant) return null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col"
    >
      <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={firstVariant.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <FavoriteButton
          productId={product.id}
          initialFavorited={isFavorited}
          isAuthenticated={isAuthenticated}
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
  )
}
