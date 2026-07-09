'use client'

import { ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { useQuery } from '@tanstack/react-query'
import { getCart } from '@/actions/get-cart'
import { formatCentsToBRL } from '@/helpers/money'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { data: cart, isLoading: cartIsLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
  })

  const hasItems = (cart?.items?.length ?? 0) > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>

        {hasItems ? (
          <div className="flex flex-1 flex-col">
            {cartIsLoading && <div>Carregando...</div>}
            {cart?.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.productVariant.imageUrl}
                    alt={item.productVariant.product.name}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                  <div className="text-sm font-medium">
                    {item.productVariant.product.name}
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">
                  {item.quantity} x{' '}
                  {formatCentsToBRL(item.productVariant.priceInCents)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBagIcon
              className="text-muted-foreground/30 h-10 w-10"
              strokeWidth={1}
            />
            <div>
              <p className="text-sm font-medium">Seu carrinho está vazio</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Adicione peças para começar
              </p>
            </div>
            <Link
              href="/products"
              onClick={() => onOpenChange(false)}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground mt-2 border-b pb-0.5 text-sm transition-colors"
            >
              Ver coleção
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
