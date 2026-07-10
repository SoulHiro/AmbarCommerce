'use server'

import { auth } from '@/lib/auth'
import { db, wishlistTable } from '@/db'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { toggleWishlistSchema, ToggleWishlistSchema } from './schema'

export const toggleWishlist = async (data: ToggleWishlistSchema) => {
  toggleWishlistSchema.parse(data)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  const existing = await db.query.wishlistTable.findFirst({
    where: and(
      eq(wishlistTable.userId, session.user.id),
      eq(wishlistTable.productId, data.productId),
    ),
  })

  if (existing) {
    await db.delete(wishlistTable).where(eq(wishlistTable.id, existing.id))
    return { favorited: false }
  }

  await db.insert(wishlistTable).values({
    userId: session.user.id,
    productId: data.productId,
  })
  return { favorited: true }
}
