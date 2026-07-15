'use server'

import { db, shippingAddressTable } from '@/db'
import { auth } from '@/lib/auth'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const deleteShippingAddress = async (addressId: string) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  await db
    .delete(shippingAddressTable)
    .where(
      and(
        eq(shippingAddressTable.id, addressId),
        eq(shippingAddressTable.userId, session.user.id),
      ),
    )
}
