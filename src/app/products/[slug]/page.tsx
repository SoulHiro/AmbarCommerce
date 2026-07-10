import { getWishlistIds } from '@/actions/get-wishlist-ids'
import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { FavoriteButton } from '@/components/common/favorite-button'
import { VariantSelector } from '@/components/product/variant-selector'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { productTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import {
  PlusIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react'
import Image from 'next/image'
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

  const isAuthenticated = !!session?.user
  const isFavorited = wishlistIds.includes(product.id)


  // Cor: deduplica variantes para mostrar cada cor uma única vez
  const colorOptions = Array.from(
    new Map(product.variants.map(v => [v.color, v])).values()
  ).map(v => ({ value: v.color, label: v.color, imageUrl: v.imageUrl }))

  // Tamanho: valores únicos ordenados, apenas se o produto tiver sizes
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

  // Variante ativa: cor (pelo nome) + tamanho opcional
  const activeVariant =
    product.variants.find(v => v.color === cor && (!tamanho || v.size === tamanho))
    ?? product.variants.find(v => v.color === cor)
    ?? product.variants[0]

  const installmentPrice = formatCentsToBRL(
    Math.round(activeVariant.priceInCents / 3)
  )

  return (
    <>
      <Header />

      <PageContainer className="py-10 md:py-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          className="text-muted-foreground mb-10 flex items-center gap-2 text-xs"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Início
          </Link>
          <span className="select-none">/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="select-none">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Layout: 3/5 imagem · 2/5 info */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">
          {/* Imagem */}
          <div className="lg:col-span-3">
            <div className="bg-muted relative aspect-[3/4] overflow-hidden">
              <Image
                src={activeVariant.imageUrl}
                alt={product.name}
                fill
                priority
                quality={90}
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <FavoriteButton
                productId={product.id}
                initialFavorited={isFavorited}
                isAuthenticated={isAuthenticated}
                className="top-4 right-4 bg-white/80 p-2 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-8 lg:col-span-2 lg:pt-2">
            <h1 className="font-heading text-3xl leading-snug font-semibold md:text-4xl">
              {product.name}
            </h1>

            <div>
              <p className="text-2xl font-medium">
                {formatCentsToBRL(activeVariant.priceInCents)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                ou 3× de {installmentPrice} sem juros
              </p>
            </div>

            <VariantSelector dimensions={dimensions} />

            <div>
              <p className="text-muted-foreground text-[0.6rem] font-semibold tracking-[0.18em] uppercase">
                Descrição
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <AddCartButton productVariantId={activeVariant.id} quantity={1} />
              <Button variant="outline" size="lg" className="w-full">
                Comprar agora
              </Button>
            </div>

            <div className="border-border grid grid-cols-3 gap-2 border-y py-6 text-center">
              <GuaranteeItem
                icon={TruckIcon}
                label="Frete grátis acima de R$299"
              />
              <GuaranteeItem
                icon={RotateCcwIcon}
                label="Troca em até 30 dias"
              />
              <GuaranteeItem
                icon={ShieldCheckIcon}
                label="Compra 100% segura"
              />
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
      <Icon className="text-muted-foreground h-4 w-4" strokeWidth={1.25} />
      <span className="text-muted-foreground text-[0.6rem] leading-snug">
        {label}
      </span>
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
    <details className="group border-border first:border-border border-b py-4 first:border-t">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium select-none">
        {label}
        <PlusIcon
          className="text-muted-foreground h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 group-open:rotate-45"
          strokeWidth={1.5}
        />
      </summary>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {children}
      </p>
    </details>
  )
}

export default ProductPage
