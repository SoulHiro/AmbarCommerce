import Image from 'next/image'
import { getCart } from '@/actions/get-cart'
import { formatCentsToBRL } from '@/helpers/money'
import { calcCartSubtotal, groupCartItemsByProduct } from '@/helpers/cart'

type Cart = Awaited<ReturnType<typeof getCart>>

interface CheckoutOrderSummaryProps {
  cart: Cart
}

export function CheckoutOrderSummary({ cart }: CheckoutOrderSummaryProps) {
  const groups = groupCartItemsByProduct(cart.items)
  const subtotal = calcCartSubtotal(cart.items)

  return (
    <div className="sticky top-8 self-start">
      <p className="mb-6 font-sans text-[0.65rem] font-semibold tracking-[0.22em] text-foreground uppercase">
        Seu pedido
      </p>

      <div className="flex flex-col gap-0 divide-y divide-border">
        {groups.map((group) => (
          <div key={group.product.id} className="py-5">
            <p className="mb-4 text-xs font-medium text-foreground">{group.product.name}</p>
            <div className="flex flex-col gap-4">
              {group.variants.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-18 w-14 flex-shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={item.productVariant.imageUrl}
                      alt={`${group.product.name} — ${item.productVariant.color}`}
                      fill
                      className="object-cover object-center"
                      sizes="56px"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-foreground text-[0.55rem] font-semibold text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[0.6rem] text-muted-foreground">
                        <span className="font-medium uppercase tracking-[0.12em]">Cor</span>
                        {'  '}{item.productVariant.color}
                      </span>
                      {item.productVariant.size && (
                        <span className="text-[0.6rem] text-muted-foreground">
                          <span className="font-medium uppercase tracking-[0.12em]">Tam</span>
                          {'  '}{item.productVariant.size}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-medium tabular-nums">
                      {formatCentsToBRL(item.productVariant.priceInCents * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-5 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Subtotal</span>
          <span className="text-xs tabular-nums">{formatCentsToBRL(subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Frete</span>
          <span className="text-xs text-muted-foreground">Calculado no pagamento</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-base font-medium tabular-nums">{formatCentsToBRL(subtotal)}</span>
        </div>
      </div>
    </div>
  )
}
