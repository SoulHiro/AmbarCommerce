'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { addProductToCart } from '@/actions/add-cart-product'

interface BuyNowButtonProps {
  productVariantId: string
}

export function BuyNowButton({ productVariantId }: BuyNowButtonProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/cart/identification')
    },
  })

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Comprar agora
    </Button>
  )
}
