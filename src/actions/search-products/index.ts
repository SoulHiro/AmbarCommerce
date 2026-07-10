'use server'

import { db } from '@/db'
import { productTable } from '@/db/schema'
import { ilike, or } from 'drizzle-orm'

export type SearchResult = {
  id: string
  name: string
  slug: string
  categoryName: string
  imageUrl: string
  priceInCents: number
}

export const searchProducts = async (query: string): Promise<SearchResult[]> => {
  const q = query.trim()
  if (!q) return []

  const results = await db.query.productTable.findMany({
    where: or(
      ilike(productTable.name, `%${q}%`),
      ilike(productTable.description, `%${q}%`),
    ),
    with: {
      variants: { limit: 1 },
      category: true,
    },
    limit: 6,
  })

  return results.map(p => ({
    id:           p.id,
    name:         p.name,
    slug:         p.slug,
    categoryName: p.category.name,
    imageUrl:     p.variants[0]?.imageUrl ?? '',
    priceInCents: p.variants[0]?.priceInCents ?? 0,
  }))
}
