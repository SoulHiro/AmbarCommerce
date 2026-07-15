import { z } from 'zod'

export const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.enum(['pix', 'credit_card', 'boleto']),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
