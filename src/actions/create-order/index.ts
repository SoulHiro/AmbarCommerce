'use server'

import { cartItemTable, cartTable, db, orderItemTable, orderTable } from '@/db'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { createOrderSchema, type CreateOrderInput } from './schema'

export const createOrder = async (input: CreateOrderInput) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  const { addressId, paymentMethod } = createOrderSchema.parse(input)

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      items: {
        with: { productVariant: true },
      },
    },
  })

  if (!cart || cart.items.length === 0) throw new Error('Cart is empty')

  const totalInCents = cart.items.reduce(
    (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
    0,
  )

  const [order] = await db
    .insert(orderTable)
    .values({
      userId: session.user.id,
      shippingAddressId: addressId,
      paymentMethod,
      status: 'paid',
      totalInCents,
    })
    .returning({ id: orderTable.id })

  await db.insert(orderItemTable).values(
    cart.items.map((item) => ({
      orderId: order.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      priceInCents: item.productVariant.priceInCents,
    })),
  )

  await db.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id))

  return { orderId: order.id }
}
