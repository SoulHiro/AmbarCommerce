import { z } from 'zod'

export const createShippingAddressSchema = z.object({
  recipientName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  taxId: z.string().min(11).max(14),
  country: z.string().min(1),
  zipCode: z.string().min(8).max(9),
  state: z.string().min(2),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  savedForFuture: z.boolean(),
})

export type CreateShippingAddressInput = z.infer<typeof createShippingAddressSchema>
