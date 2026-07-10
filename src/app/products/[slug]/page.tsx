import { getWishlistIds } from '@/actions/get-wishlist-ids'
import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { FavoriteButton } from '@/components/common/favorite-button'
import { ProductGallery } from '@/components/product/product-gallery'
import { VariantSelector } from '@/components/product/variant-selector'
import { ProductItem } from '@/components/common/products-item'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { productTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import { auth } from '@/lib/auth'
import { and, eq, ne } from 'drizzle-orm'
import {
  PlusIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { AddCartButton } from '@/components/product/add-cart-button'

interface ProductPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

const ProductPage = async ({ params, searchParams }: ProductPageProps) => {
  const { slug } = await params
  const { cor, tamanho } = await searchParams

  const [product, session, wishlistIds] = await Promise.all([
    db.query.productTable.findFirst({
      where: eq(productTable.slug, slug),
      with: { variants: true, category: true },
    }),
    auth.api.getSession({ headers: await headers() }),
    getWishlistIds(),
  ])

  if (!product) return notFound()
  if (!product.variants.length) return notFound()

  const isFavorited = wishlistIds.includes(product.id)

  // Uma imagem por cor (para galeria e thumbnails)
  const galleryImages = Array.from(
    new Map(product.variants.map(v => [v.color, v])).values()
  ).map(v => ({ color: v.color, imageUrl: v.imageUrl }))

  // Opções de cor para o seletor de variantes
  const colorOptions = galleryImages.map(v => ({
    value: v.color,
    label: v.color,
    imageUrl: v.imageUrl,
  }))

  // Tamanhos únicos ordenados
  const sizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))]

  const dimensions: Parameters<typeof VariantSelector>[0]['dimensions'] = [
    {
      key: 'cor',
      label: 'Cor',
      type: 'swatch' as const,
      options: colorOptions,
    },
  ]

  if (sizes.length > 0) {
    dimensions.push({
      key: 'tamanho',
      label: 'Tamanho',
      type: 'pill' as const,
      options: sizes.map(s => ({ value: s!, label: s! })),
    })
  }

  // Variante ativa: cor + tamanho opcional
  const activeVariant =
    product.variants.find(v => v.color === cor && (!tamanho || v.size === tamanho))
    ?? product.variants.find(v => v.color === cor)
    ?? product.variants[0]

  const installmentPrice = formatCentsToBRL(Math.round(activeVariant.priceInCents / 3))

  // Produtos relacionados: mesma categoria, diferente produto, máx 4
  const related = await db.query.productTable.findMany({
    where: and(
      eq(productTable.categoryId, product.categoryId),
      ne(productTable.id, product.id),
    ),
    with: { variants: true },
    limit: 4,
  })

  return (
    <>
      <Header />

      <PageContainer className="py-10 md:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          className="mb-10 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">
            Início
          </Link>
          <span className="select-none">/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="transition-colors hover:text-foreground"
          >
            {product.category.name}
          </Link>
          <span className="select-none">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Layout: 3/5 galeria · 2/5 info */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Galeria com thumbnails + zoom */}
          <div className="lg:col-span-3">
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-8 lg:col-span-2 lg:pt-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-3xl font-semibold leading-snug md:text-4xl">
                {product.name}
              </h1>
              <FavoriteButton
                productId={product.id}
                initialFavorited={isFavorited}
                showLabel
                className="mt-1.5 flex-shrink-0"
              />
            </div>

            <div>
              <p className="text-2xl font-medium">
                {formatCentsToBRL(activeVariant.priceInCents)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ou 3× de {installmentPrice} sem juros
              </p>
            </div>

            <VariantSelector dimensions={dimensions} />

            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Descrição
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <AddCartButton productVariantId={activeVariant.id} quantity={1} />
              <Button variant="outline" size="lg" className="w-full">
                Comprar agora
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-y border-border py-6 text-center">
              <GuaranteeItem icon={TruckIcon} label="Frete grátis acima de R$299" />
              <GuaranteeItem icon={RotateCcwIcon} label="Troca em até 30 dias" />
              <GuaranteeItem icon={ShieldCheckIcon} label="Compra 100% segura" />
            </div>

            <div>
              <ProductDetail label="Composição">
                Informação de composição será disponibilizada em breve.
              </ProductDetail>
              <ProductDetail label="Cuidados com a peça">
                Informação de cuidados será disponibilizada em breve.
              </ProductDetail>
              <ProductDetail label="Entrega & Trocas">
                Entregamos para todo o Brasil. Prazo de até 10 dias úteis.
                Trocas e devoluções aceitas em até 30 dias após o recebimento.
              </ProductDetail>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-14">
            <h2 className="font-heading mb-8 text-xl font-semibold">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {related.map(p => (
                <ProductItem
                  key={p.id}
                  product={p}
                  isFavorited={wishlistIds.includes(p.id)}
                />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </>
  )
}

function GuaranteeItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.25} />
      <span className="text-[0.6rem] leading-snug text-muted-foreground">{label}</span>
    </div>
  )
}

function ProductDetail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <details className="group border-b border-border py-4 first:border-t first:border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium select-none">
        {label}
        <PlusIcon
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
          strokeWidth={1.5}
        />
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </details>
  )
}

export default ProductPage
