'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeCartItem } from '@/actions/remove-cart-item'
import { updateCartItem } from '@/actions/update-cart-item'
import { getCart } from '@/actions/get-cart'

type Cart = Awaited<ReturnType<typeof getCart>>

export function useCartMutations() {
  const queryClient = useQueryClient()

  const { mutate: updateQty } = useMutation({
    mutationFn: (vars: { cartItemId: string; quantity: number }) =>
      updateCartItem(vars),
    onMutate: async ({ cartItemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previous = queryClient.getQueryData<Cart>(['cart'])
      queryClient.setQueryData<Cart>(['cart'], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item,
          ),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['cart'], context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: (cartItemId: string) => removeCartItem({ cartItemId }),
    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previous = queryClient.getQueryData<Cart>(['cart'])
      queryClient.setQueryData<Cart>(['cart'], (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.filter((item) => item.id !== cartItemId),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['cart'], context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  return { updateQty, removeItem, isRemoving }
}
