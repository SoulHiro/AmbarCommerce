import { getCart } from '@/actions/get-cart'

type CartItem = Awaited<ReturnType<typeof getCart>>['items'][number]

export type CartProductGroup = {
  product: CartItem['productVariant']['product']
  variants: CartItem[]
}

/**
 * Groups cart items by product so the same product with different
 * colors/sizes appears as one block instead of separate rows.
 */
export function groupCartItemsByProduct(items: CartItem[]): CartProductGroup[] {
  const map = items.reduce<Record<string, CartProductGroup>>((acc, item) => {
    const pid = item.productVariant.product.id
    if (!acc[pid]) acc[pid] = { product: item.productVariant.product, variants: [] }
    acc[pid].variants.push(item)
    return acc
  }, {})

  return Object.values(map)
}

/**
 * Calculates the total price in cents for all items in the cart.
 */
export function calcCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
    0,
  )
}

/**
 * Returns the total number of individual units in the cart.
 */
export function calcCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
