'use client'

import { useQuery } from '@tanstack/react-query'
import { formatCentsToBRL } from '@/helpers/money'
import {
  groupCartItemsByProduct,
  calcCartSubtotal,
  calcCartItemCount,
} from '@/helpers/cart'
import { getCart } from '@/actions/get-cart'
import { authClient } from '@/lib/auth-client'
import { ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent } from '../ui/sheet'
import { CartItem } from '../cart/cart-item'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { data: session } = authClient.useSession()
  const isAuthenticated = !!session?.user

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    enabled: open && isAuthenticated,
  })

  const items = cart?.items ?? []
  const hasItems = items.length > 0
  const groups = groupCartItemsByProduct(items)
  const subtotal = calcCartSubtotal(items)
  const itemCount = calcCartItemCount(items)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col gap-0 p-0 sm:max-w-md"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="border-border flex items-center justify-between border-b px-8 py-5">
          <span className="text-foreground font-sans text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
            Carrinho
            {hasItems && (
              <span className="text-muted-foreground ml-2">({itemCount})</span>
            )}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fechar carrinho"
            className="text-muted-foreground hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        {!isAuthenticated ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBagIcon
              className="text-muted-foreground/20 h-9 w-9"
              strokeWidth={1}
            />
            <div>
              <p className="text-sm font-medium">Entre para ver seu carrinho</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Salve suas peças favoritas e finalize a compra
              </p>
            </div>
            <Link
              href="/auth/sign-in"
              onClick={() => onOpenChange(false)}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground mt-1 border-b pb-0.5 text-xs transition-colors"
            >
              Entrar na conta
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-muted-foreground text-xs tracking-wider">
              A carregar...
            </span>
          </div>
        ) : hasItems ? (
          <>
            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto">
              {groups.map((group, groupIdx) => (
                <div key={group.product.id}>
                  <div className="px-8 pt-7 pb-5">
                    <p className="text-foreground mb-5 text-xs leading-none font-medium">
                      {group.product.name}
                    </p>

                    <div className="flex flex-col gap-5">
                      {group.variants.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>

                  {groupIdx < groups.length - 1 && (
                    <div className="border-border mx-8 border-t" />
                  )}
                </div>
              ))}
            </div>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="border-border border-t px-8 pt-6 pb-8">
              <div className="mb-6 flex items-baseline justify-between">
                <span className="text-muted-foreground text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
                  Subtotal
                </span>
                <span className="text-base font-medium tabular-nums">
                  {formatCentsToBRL(subtotal)}
                </span>
              </div>

              <Link
                href="/cart/identification"
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground flex w-full items-center justify-center py-3.5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-90"
              >
                Finalizar compra
              </Link>

              <p className="text-muted-foreground mt-3 text-center text-[0.6rem] tracking-wide">
                Frete calculado no checkout
              </p>
            </div>
          </>
        ) : (
          /* ── Empty state ─────────────────────────────────────── */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBagIcon
              className="text-muted-foreground/20 h-9 w-9"
              strokeWidth={1}
            />
            <div>
              <p className="text-sm font-medium">Carrinho vazio</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Adicione peças para começar
              </p>
            </div>
            <Link
              href="/products"
              onClick={() => onOpenChange(false)}
              className="border-border text-muted-foreground hover:border-foreground hover:text-foreground mt-1 border-b pb-0.5 text-xs transition-colors"
            >
              Ver coleção
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
