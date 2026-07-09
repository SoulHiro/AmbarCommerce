'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { addProductToCart } from '@/actions/add-cart-product'
import { Loader2 } from 'lucide-react'

interface AddCartButtonProps {
  productVariantId: string
  quantity: number
}

export const AddCartButton = ({
  productVariantId,
  quantity,
}: AddCartButtonProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['addProductToCart', productVariantId, quantity],
    mutationFn: () => addProductToCart({ productVariantId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
  return (
    <Button
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar ao carrinho
    </Button>
  )
}
