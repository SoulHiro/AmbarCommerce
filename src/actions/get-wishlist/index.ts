'use server'

import { auth } from '@/lib/auth'
import { db } from '@/db'
import { wishlistTable } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

export const getWishlist = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const rows = await db.query.wishlistTable.findMany({
    where: eq(wishlistTable.userId, session.user.id),
    with: {
      product: {
        with: { variants: true },
      },
    },
    orderBy: [desc(wishlistTable.createdAt)],
  })

  return rows.map(r => r.product)
}
