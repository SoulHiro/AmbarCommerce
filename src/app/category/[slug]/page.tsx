import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { ProductItem } from '@/components/common/products-item'
import { Pagination } from '@/components/common/pagination'
import {
  FilterSidebar,
  MobileFilterDrawer,
} from '@/components/category/filter-sidebar'
import { getWishlistIds } from '@/actions/get-wishlist-ids'
import { categoryTable, db, productTable } from '@/db'
import { formatCentsToBRL } from '@/helpers/money'
import { paginate } from '@/helpers/pagination'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params:       Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const { slug }  = await params
  const filters   = await searchParams
  const page      = Number(filters.page ?? '1')

  const [session, wishlistIds] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getWishlistIds(),
  ])
  const isAuthenticated = !!session?.user

  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  })

  if (!category) return notFound()

  // Carrega todos os produtos da categoria com variantes
  let products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: { variants: true },
  })

  // Extrai cores disponíveis ANTES de filtrar (para sempre mostrar todas as opções)
  const availableColors = [
    ...new Set(products.flatMap(p => p.variants.map(v => v.color))),
  ].sort()

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const coresParam   = filters.cores?.split(',').filter(Boolean) ?? []
  const precoMinBRL  = filters['preco-min'] ? Number(filters['preco-min']) : 0
  const precoMaxBRL  = filters['preco-max'] ? Number(filters['preco-max']) : Infinity
  const precoMinCts  = precoMinBRL * 100
  const precoMaxCts  = precoMaxBRL < Infinity ? precoMaxBRL * 100 : Infinity
  const ordenar      = filters.ordenar ?? 'relevancia'

  if (coresParam.length > 0) {
    products = products.filter(p =>
      p.variants.some(v => coresParam.includes(v.color)),
    )
  }

  if (precoMinBRL > 0 || precoMaxBRL < Infinity) {
    products = products.filter(p =>
      p.variants.some(
        v => v.priceInCents >= precoMinCts && v.priceInCents <= precoMaxCts,
      ),
    )
  }

  if (ordenar === 'menor-preco') {
    products = [...products].sort(
      (a, b) =>
        Math.min(...a.variants.map(v => v.priceInCents)) -
        Math.min(...b.variants.map(v => v.priceInCents)),
    )
  } else if (ordenar === 'maior-preco') {
    products = [...products].sort(
      (a, b) =>
        Math.min(...b.variants.map(v => v.priceInCents)) -
        Math.min(...a.variants.map(v => v.priceInCents)),
    )
  } else if (ordenar === 'mais-recentes') {
    products = [...products].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  // ── Paginação ────────────────────────────────────────────────────────────
  const { items: pagedProducts, currentPage, totalPages } = paginate(products, page)

  // ── Chips de filtros ativos (para exibir acima do grid) ───────────────────
  const activeChips: { label: string; removeKey: string; removeValue?: string }[] = []

  if (ordenar !== 'relevancia') {
    const label = { 'menor-preco': 'Menor preço', 'maior-preco': 'Maior preço', 'mais-recentes': 'Mais recentes' }[ordenar] ?? ordenar
    activeChips.push({ label, removeKey: 'ordenar' })
  }
  if (precoMinBRL > 0 || precoMaxBRL < Infinity) {
    const from = precoMinBRL > 0 ? formatCentsToBRL(precoMinCts) : null
    const to   = precoMaxBRL < Infinity ? formatCentsToBRL(precoMaxCts) : null
    const label = [from && `a partir de ${from}`, to && `até ${to}`].filter(Boolean).join(' ')
    activeChips.push({ label: `Preço: ${label}`, removeKey: '__preco' })
  }
  coresParam.forEach(cor => {
    activeChips.push({ label: cor.charAt(0).toUpperCase() + cor.slice(1), removeKey: 'cores', removeValue: cor })
  })

  return (
    <>
      <Header />

      <PageContainer className="py-12">
        <div className="flex gap-12">

          {/* ── Sidebar desktop ─────────────────────────────────────────── */}
          <aside className="hidden w-52 shrink-0 lg:block">
            {/* top-24 = 96px = 2 × h-12 do header */}
            <div className="sticky top-24">
              <FilterSidebar availableColors={availableColors} />
            </div>
          </aside>

          {/* ── Área principal ──────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">

            {/* Cabeçalho da página */}
            <div className="mb-8 flex items-end justify-between gap-4">
              <h1 className="font-heading text-2xl font-semibold">{category.name}</h1>
              <div className="flex items-center gap-4 pb-0.5">
                <MobileFilterDrawer availableColors={availableColors} />
                <span className="text-xs text-muted-foreground">
                  {products.length} {products.length === 1 ? 'peça' : 'peças'}
                </span>
              </div>
            </div>

            {/* Chips de filtros ativos */}
            {activeChips.length > 0 && (
              <ActiveChips chips={activeChips} currentFilters={filters} />
            )}

            {/* Grid de produtos */}
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                  {pagedProducts.map(product => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      isFavorited={wishlistIds.includes(product.id)}
                    />
                  ))}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} searchParams={filters} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-sm font-medium">Nenhuma peça encontrada</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Tente ajustar ou remover algum filtro
                </p>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </>
  )
}

// ─── Chips de filtros ativos (server component) ───────────────────────────────

function ActiveChips({
  chips,
  currentFilters,
}: {
  chips: { label: string; removeKey: string; removeValue?: string }[]
  currentFilters: Record<string, string | undefined>
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map(chip => {
        // Monta a URL sem este filtro específico
        const params = new URLSearchParams(
          Object.entries(currentFilters).filter(([, v]) => v !== undefined) as [string, string][],
        )

        if (chip.removeKey === '__preco') {
          params.delete('preco-min')
          params.delete('preco-max')
        } else if (chip.removeKey === 'cores' && chip.removeValue) {
          const remaining = (params.get('cores') ?? '')
            .split(',')
            .filter(c => c && c !== chip.removeValue)
          if (remaining.length > 0) params.set('cores', remaining.join(','))
          else params.delete('cores')
        } else {
          params.delete(chip.removeKey)
        }

        const href = `?${params.toString()}`

        return (
          <a
            key={chip.label}
            href={href}
            className="flex items-center gap-1.5 border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            {chip.label}
            <XIcon className="h-3 w-3 flex-shrink-0" />
          </a>
        )
      })}
    </div>
  )
}

// Import XIcon for the chips
import { XIcon } from 'lucide-react'

export default CategoryPage
