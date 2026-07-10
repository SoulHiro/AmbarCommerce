'use server'

import { auth } from '@/lib/auth'
import { db, wishlistTable } from '@/db'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const getWishlistIds = async (): Promise<string[]> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const rows = await db.query.wishlistTable.findMany({
    where: eq(wishlistTable.userId, session.user.id),
    columns: { productId: true },
  })

  return rows.map(r => r.productId)
}
