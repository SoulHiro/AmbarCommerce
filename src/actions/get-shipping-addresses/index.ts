'use server'

import { db, shippingAddressTable } from '@/db'
import { auth } from '@/lib/auth'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export const getShippingAddresses = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  return db
    .select()
    .from(shippingAddressTable)
    .where(
      and(
        eq(shippingAddressTable.userId, session.user.id),
        eq(shippingAddressTable.savedForFuture, true),
      ),
    )
    .orderBy(desc(shippingAddressTable.createdAt))
}
