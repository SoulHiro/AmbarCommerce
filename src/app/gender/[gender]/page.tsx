import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { ProductItem } from '@/components/common/products-item'
import {
  FilterSidebar,
  MobileFilterDrawer,
} from '@/components/category/filter-sidebar'
import { db, productTable } from '@/db'
import { formatCentsToBRL } from '@/helpers/money'
import { eq } from 'drizzle-orm'
import { XIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

const GENDER_LABELS: Record<string, string> = {
  feminino: 'Mulher',
  masculino: 'Homem',
  unissex: 'Todos',
}

const VALID_GENDERS = ['feminino', 'masculino', 'unissex'] as const
type Gender = (typeof VALID_GENDERS)[number]

interface GenderPageProps {
  params:       Promise<{ gender: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

const GenderPage = async ({ params, searchParams }: GenderPageProps) => {
  const { gender } = await params
  const filters    = await searchParams

  if (!VALID_GENDERS.includes(gender as Gender)) return notFound()

  let products = await db.query.productTable.findMany({
    where: eq(productTable.gender, gender as Gender),
    with: { variants: true },
  })

  const availableColors = [
    ...new Set(products.flatMap(p => p.variants.map(v => v.color.toLowerCase()))),
  ].sort()

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const coresParam  = filters.cores?.split(',').filter(Boolean) ?? []
  const precoMinBRL = filters['preco-min'] ? Number(filters['preco-min']) : 0
  const precoMaxBRL = filters['preco-max'] ? Number(filters['preco-max']) : Infinity
  const precoMinCts = precoMinBRL * 100
  const precoMaxCts = precoMaxBRL < Infinity ? precoMaxBRL * 100 : Infinity
  const ordenar     = filters.ordenar ?? 'relevancia'

  if (coresParam.length > 0) {
    products = products.filter(p =>
      p.variants.some(v => coresParam.includes(v.color.toLowerCase())),
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

  // ── Chips de filtros ativos ───────────────────────────────────────────────
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

  const pageTitle = GENDER_LABELS[gender] ?? gender

  return (
    <>
      <Header />

      <PageContainer className="py-12">
        <div className="flex gap-12">

          {/* ── Sidebar desktop ─────────────────────────────────────────── */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterSidebar availableColors={availableColors} />
            </div>
          </aside>

          {/* ── Área principal ──────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">

            <div className="mb-8 flex items-end justify-between gap-4">
              <h1 className="font-heading text-2xl font-semibold">{pageTitle}</h1>
              <div className="flex items-center gap-4 pb-0.5">
                <MobileFilterDrawer availableColors={availableColors} />
                <span className="text-xs text-muted-foreground">
                  {products.length} {products.length === 1 ? 'peça' : 'peças'}
                </span>
              </div>
            </div>

            {activeChips.length > 0 && (
              <ActiveChips chips={activeChips} currentFilters={filters} />
            )}

            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
                {products.map(product => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
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

export default GenderPage
