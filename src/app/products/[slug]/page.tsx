import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { FavoriteButton } from '@/components/common/favorite-button'
import { VariantSelector } from '@/components/product/variant-selector'
import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { productTable } from '@/db/schema'
import { formatCentsToBRL } from '@/helpers/money'
import { eq } from 'drizzle-orm'
import { PlusIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params

  const product = await db.query.productTable.findFirst({
    where: eq(productTable.slug, slug),
    with: {
      variants: true,
      category: true,
    },
  })

  if (!product) return notFound()
  if (!product.variants.length) return notFound()

  const firstVariant     = product.variants[0]
  const installmentPrice = formatCentsToBRL(Math.round(firstVariant.priceInCents / 3))

  return (
    <>
      <Header />

      <PageContainer className="py-10 md:py-16">

        {/* Breadcrumb */}
        <nav
          aria-label="Navegação estrutural"
          className="mb-10 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-foreground">Início</Link>
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

        {/* Layout: 3/5 imagem · 2/5 info */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-16">

          {/* Imagem */}
          <div className="lg:col-span-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={firstVariant.imageUrl}
                alt={product.name}
                fill
                priority
                quality={90}
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <FavoriteButton className="right-4 top-4 bg-white/80 p-2 backdrop-blur-sm" />
            </div>
          </div>

          {/* Informações */}
          <div className="flex flex-col gap-8 lg:col-span-2 lg:pt-2">

            <h1 className="font-heading text-3xl font-semibold leading-snug md:text-4xl">
              {product.name}
            </h1>

            <div>
              <p className="text-2xl font-medium">
                {formatCentsToBRL(firstVariant.priceInCents)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                ou 3× de {installmentPrice} sem juros
              </p>
            </div>

            <VariantSelector variants={product.variants} />

            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Descrição
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full">
                Adicionar ao carrinho
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Comprar agora
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-y border-border py-6 text-center">
              <GuaranteeItem icon={TruckIcon}       label="Frete grátis acima de R$299" />
              <GuaranteeItem icon={RotateCcwIcon}   label="Troca em até 30 dias"        />
              <GuaranteeItem icon={ShieldCheckIcon} label="Compra 100% segura"          />
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

function GuaranteeItem({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.25} />
      <span className="text-[0.6rem] leading-snug text-muted-foreground">{label}</span>
    </div>
  )
}

function ProductDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border py-4 first:border-t first:border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium select-none">
        {label}
        <PlusIcon
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
          strokeWidth={1.5}
        />
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    </details>
  )
}

export default ProductPage
