import { z } from 'zod'

export const toggleWishlistSchema = z.object({
  productId: z.string().uuid(),
})

export type ToggleWishlistSchema = z.infer<typeof toggleWishlistSchema>
