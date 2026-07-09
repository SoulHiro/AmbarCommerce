'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatCentsToBRL } from '@/helpers/money'
import { groupCartItemsByProduct, calcCartSubtotal, calcCartItemCount } from '@/helpers/cart'
import { getCart } from '@/actions/get-cart'
import { updateCartItem } from '@/actions/update-cart-item'
import { ShoppingBagIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Sheet, SheetContent } from '../ui/sheet'
import { QuantityControl } from '../cart/quantity-control'
import { RemoveItemButton } from '../cart/remove-item-button'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    enabled: open,
  })

  const { mutate: updateQty } = useMutation({
    mutationFn: (vars: { cartItemId: string; quantity: number }) =>
      updateCartItem(vars),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
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
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <span className="font-sans text-[0.65rem] font-semibold tracking-[0.22em] text-foreground uppercase">
            Carrinho
            {hasItems && (
              <span className="ml-2 text-muted-foreground">({itemCount})</span>
            )}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fechar carrinho"
            className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.25">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-xs tracking-wider text-muted-foreground">A carregar...</span>
          </div>
        ) : hasItems ? (
          <>
            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto">
              {groups.map((group, groupIdx) => (
                <div key={group.product.id}>
                  <div className="px-8 pb-5 pt-7">
                    <p className="mb-5 text-xs font-medium leading-none text-foreground">
                      {group.product.name}
                    </p>

                    <div className="flex flex-col gap-5">
                      {group.variants.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          {/* Thumbnail */}
                          <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-muted">
                            <Image
                              src={item.productVariant.imageUrl}
                              alt={`${group.product.name} — ${item.productVariant.color}`}
                              fill
                              className="object-cover object-center"
                              sizes="64px"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex flex-1 flex-col justify-between py-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[0.65rem] capitalize tracking-wide text-muted-foreground">
                                {item.productVariant.color}
                              </span>
                              <RemoveItemButton
                                onRemove={() => {
                                  // TODO: chamar remove action e invalidar
                                  queryClient.invalidateQueries({ queryKey: ['cart'] })
                                }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <QuantityControl
                                quantity={item.quantity}
                                onDecrease={() =>
                                  updateQty({ cartItemId: item.id, quantity: item.quantity - 1 })
                                }
                                onIncrease={() =>
                                  updateQty({ cartItemId: item.id, quantity: item.quantity + 1 })
                                }
                              />
                              <span className="text-sm font-medium tabular-nums">
                                {formatCentsToBRL(item.productVariant.priceInCents * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {groupIdx < groups.length - 1 && (
                    <div className="mx-8 border-t border-border" />
                  )}
                </div>
              ))}
            </div>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="border-t border-border px-8 pb-8 pt-6">
              <div className="mb-6 flex items-baseline justify-between">
                <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Subtotal
                </span>
                <span className="text-base font-medium tabular-nums">
                  {formatCentsToBRL(subtotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={() => onOpenChange(false)}
                className="flex w-full items-center justify-center bg-primary py-3.5 text-[0.7rem] font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
              >
                Finalizar compra
              </Link>

              <p className="mt-3 text-center text-[0.6rem] tracking-wide text-muted-foreground">
                Frete calculado no checkout
              </p>
            </div>
          </>
        ) : (
          /* ── Empty state ─────────────────────────────────────── */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBagIcon className="h-9 w-9 text-muted-foreground/20" strokeWidth={1} />
            <div>
              <p className="text-sm font-medium">Carrinho vazio</p>
              <p className="mt-1 text-xs text-muted-foreground">Adicione peças para começar</p>
            </div>
            <Link
              href="/products"
              onClick={() => onOpenChange(false)}
              className="mt-1 border-b border-border pb-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Ver coleção
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
