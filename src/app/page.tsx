import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { CategoryGrid, type Category } from '@/components/common/category-grid'
import { EditorialBanner } from '@/components/common/editorial-banner'
import { Footer } from '@/components/common/footer'
import { ProductList } from '@/components/common/products-list'
import { db } from '@/db'
import Image from 'next/image'

const CATEGORIES: Category[] = [
  { name: 'Novidades', image: '/images/banner.webp', href: '/products?category=novidades' },
  { name: 'Outono', image: '/images/banner.webp', href: '/products?category=outono' },
  { name: 'Férias', image: '/images/banner.webp', href: '/products?category=ferias' },
  { name: 'Básicos', image: '/images/banner.webp', href: '/products?category=basicos' },
]

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: { variants: true },
  })

  return (
    <>
      <Header />

      {/* Hero banner */}
      <Image
        src="/images/banner.webp"
        alt="Coleção Âmbar — Outono 2025"
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-full"
        priority
      />

      <PageContainer className="space-y-20 py-16">
        {/* Curadoria principal */}
        <section className="space-y-8">
          <h2 className="font-heading max-w-[260px] text-2xl font-semibold leading-snug">
            As peças que estamos amando esta temporada
          </h2>
          <ProductList products={products} variant="short" seeAllHref="/products" />
        </section>
      </PageContainer>

      {/* Editorial banner — full width, fora do container */}
      <EditorialBanner
        image="/images/banner.webp"
        eyebrow="Outono 2025"
        title="Lã, couro e cognac para os dias que pedem mais"
        href="/products"
        linkLabel="Ver a coleção completa"
      />

      <PageContainer className="space-y-20 py-16">
        {/* Lista Férias */}
        <ProductList
          title="Férias"
          products={products}
          variant="short"
          seeAllHref="/products"
        />

        {/* Categorias em destaque */}
        <CategoryGrid title="Em alta" categories={CATEGORIES} />
      </PageContainer>

      <Footer />
    </>
  )
}
