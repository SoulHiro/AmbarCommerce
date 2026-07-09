import { productTable, productVariantTable } from '@/db/schema'
import Link from 'next/link'
import { ProductItem } from './products-item'

interface ProductsListProps {
  title?: string
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[]
  })[]
  variant?: 'short' | 'long'
  seeAllHref?: string
}

export const ProductList = ({
  title,
  products,
  variant = 'short',
  seeAllHref,
}: ProductsListProps) => {
  const limit = variant === 'short' ? 4 : 8
  const visibleProducts = products.slice(0, limit)

  return (
    <div className="space-y-6">
      {(title || seeAllHref) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="font-heading text-lg font-semibold">{title}</h3>}
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-muted-foreground hover:text-foreground ml-auto text-sm transition-colors"
            >
              Compre agora
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
