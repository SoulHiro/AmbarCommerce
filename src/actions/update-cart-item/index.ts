'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db, cartItemTable, cartTable } from '@/db'
import { eq } from 'drizzle-orm'
import { updateCartItemSchema, UpdateCartItemSchema } from './schema'

export const updateCartItem = async (data: UpdateCartItemSchema) => {
  updateCartItemSchema.parse(data)

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  // Verifica que o item pertence ao carrinho do usuário
  const cartItem = await db.query.cartItemTable.findFirst({
    where: eq(cartItemTable.id, data.cartItemId),
    with: { cart: true },
  })

  if (!cartItem) throw new Error('Cart item not found')
  if (cartItem.cart.userId !== session.user.id) throw new Error('Unauthorized')

  await db
    .update(cartItemTable)
    .set({ quantity: data.quantity })
    .where(eq(cartItemTable.id, data.cartItemId))
}
