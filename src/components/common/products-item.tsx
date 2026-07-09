import { productTable, productVariantTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import Image from 'next/image'
import Link from 'next/link'

interface ProductsItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[]
  }
}

export const ProductItem = ({ product }: ProductsItemProps) => {
  const firstVariant = product.variants[0]

  return (
    <Link href={`/products/${product.id}`} className="flex flex-col gap-4">
      <Image
        src={firstVariant.imageUrl}
        alt={product.name}
        width={100}
        height={100}
      />
      <div className="flex flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs font-medium">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold">
          R$ {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  )
}
