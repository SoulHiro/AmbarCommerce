import z from 'zod'

export const updateCartItemSchema = z.object({
  cartItemId: z.uuid(),
  quantity: z.number().min(1),
})

export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>
