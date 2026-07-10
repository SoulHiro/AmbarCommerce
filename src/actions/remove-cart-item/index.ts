'use server'

import { auth } from '@/lib/auth'
import { db, cartItemTable } from '@/db'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { removeCartItemSchema, RemoveCartItemSchema } from './schema'

export const removeCartItem = async (data: RemoveCartItemSchema) => {
  removeCartItemSchema.parse(data)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  const cartItem = await db.query.cartItemTable.findFirst({
    where: eq(cartItemTable.id, data.cartItemId),
    with: { cart: true },
  })

  if (!cartItem) throw new Error('Cart item not found')
  if (cartItem.cart.userId !== session.user.id) throw new Error('Unauthorized')

  await db.delete(cartItemTable).where(eq(cartItemTable.id, data.cartItemId))
}
