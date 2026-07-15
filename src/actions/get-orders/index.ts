'use server'

import { db, orderTable } from '@/db'
import { auth } from '@/lib/auth'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const getOrders = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  return db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    orderBy: desc(orderTable.createdAt),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: { product: true },
          },
        },
      },
    },
  })
}
