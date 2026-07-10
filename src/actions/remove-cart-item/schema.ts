import { z } from 'zod'

export const removeCartItemSchema = z.object({
  cartItemId: z.string().uuid(),
})

export type RemoveCartItemSchema = z.infer<typeof removeCartItemSchema>
