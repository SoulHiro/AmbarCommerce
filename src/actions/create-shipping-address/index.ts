'use server'

import { db, shippingAddressTable } from '@/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { createShippingAddressSchema, type CreateShippingAddressInput } from './schema'

export const createShippingAddress = async (input: CreateShippingAddressInput) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  const data = createShippingAddressSchema.parse(input)

  const [address] = await db
    .insert(shippingAddressTable)
    .values({ ...data, userId: session.user.id })
    .returning({ id: shippingAddressTable.id })

  return address
}
