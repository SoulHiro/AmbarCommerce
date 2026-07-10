import { productTable, productVariantTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import Image from 'next/image'
import Link from 'next/link'
import { FavoriteButton } from './favorite-button'

type Product = typeof productTable.$inferSelect & {
  variants: (typeof productVariantTable.$inferSelect)[]
}

interface ProductBentoGridProps {
  products: Product[]
}

// Each cell config: col/row span classes and image size hint for Next.js
const LAYOUT = [
  { colSpan: 'col-span-2', rowSpan: 'row-span-2', sizes: '(max-width:768px) 100vw, 50vw' },
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', sizes: '(max-width:768px) 100vw, 25vw' },
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', sizes: '(max-width:768px) 100vw, 25vw' },
  { colSpan: 'col-span-1', rowSpan: 'row-span-1', sizes: '(max-width:768px) 100vw, 25vw' },
  { colSpan: 'col-span-2', rowSpan: 'row-span-1', sizes: '(max-width:768px) 100vw, 50vw' },
]

function BentoCell({ product, sizes }: { product: Product; sizes: string }) {
  const firstVariant = product.variants[0]
  if (!firstVariant) return null

  return (
    <div className="group relative h-full w-full overflow-hidden bg-muted">
      <Link
        href={`/products/${product.slug}`}
        className="block h-full w-full after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
      >
        <Image
          src={firstVariant.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes={sizes}
        />

        {/* Bottom reveal: name + price */}
        <div
          className={[
            'absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-4 py-3',
            'translate-y-full bg-black/55 backdrop-blur-[2px]',
            'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out',
            'group-hover:translate-y-0',
          ].join(' ')}
        >
          <p className="truncate text-sm font-medium text-white">{product.name}</p>
          <p className="text-xs font-semibold text-white/80">
            {formatCentsToBRL(firstVariant.priceInCents)}
          </p>
        </div>
      </Link>

      <FavoriteButton
        productId={product.id}
        initialFavorited={false}
        isAuthenticated={false}
        className="bg-white/70 p-1.5 backdrop-blur-sm"
      />
    </div>
  )
}

export function ProductBentoGrid({ products }: ProductBentoGridProps) {
  const items = products.slice(0, 5)

  return (
    <div
      className="grid grid-cols-3 gap-3 [grid-template-rows:280px_280px_220px]"
    >
      {items.map((product, i) => {
        const { colSpan, rowSpan, sizes } = LAYOUT[i]
        return (
          <div key={product.id} className={`${colSpan} ${rowSpan}`}>
            <BentoCell product={product} sizes={sizes} />
          </div>
        )
      })}
    </div>
  )
}
