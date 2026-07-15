'use client'

import Image from 'next/image'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCentsToBRL } from '@/helpers/money'
import { getOrders } from '@/actions/get-orders'

type Order = Awaited<ReturnType<typeof getOrders>>[number]

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  paid: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
}

const METHOD_LABEL: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

interface OrderCardProps {
  order: Order
  expanded: boolean
  onToggle: () => void
}

export function OrderCard({ order, expanded, onToggle }: OrderCardProps) {
  const orderNumber = order.id.split('-')[0].toUpperCase()
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="border border-border">
      {/* Header row — always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-accent/40"
      >
        <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          <span className="font-mono text-sm font-semibold tracking-wider">#{orderNumber}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
          <span
            className={cn(
              'px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em]',
              STATUS_STYLE[order.status],
            )}
          >
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium tabular-nums">
              {formatCentsToBRL(order.totalInCents)}
            </p>
            <p className="text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} · {METHOD_LABEL[order.paymentMethod]}
            </p>
          </div>
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200',
              expanded && 'rotate-180',
            )}
            strokeWidth={1.5}
          />
        </div>
      </button>

      {/* Mobile price row */}
      <div className="flex items-baseline justify-between border-t border-border/50 px-6 py-2 sm:hidden">
        <span className="text-xs text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'} · {METHOD_LABEL[order.paymentMethod]}
        </span>
        <span className="text-sm font-medium tabular-nums">
          {formatCentsToBRL(order.totalInCents)}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="animate-in slide-in-from-top-1 duration-200 border-t border-border">
          {/* Items */}
          <div className="px-6 py-5">
            <p className="mb-4 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Itens
            </p>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-18 w-14 flex-shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={item.productVariant.imageUrl}
                      alt={item.productVariant.product.name}
                      fill
                      className="object-cover object-center"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {item.productVariant.product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.productVariant.color}
                        {item.productVariant.size ? ` · ${item.productVariant.size}` : ''}
                        {' · '}Qtd. {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-medium tabular-nums">
                      {formatCentsToBRL(item.priceInCents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="border-t border-border/60 px-6 py-5">
            <p className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Entrega
            </p>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium">{order.shippingAddress.recipientName}</p>
              <p className="text-xs text-muted-foreground">
                {order.shippingAddress.street}, {order.shippingAddress.number}
                {order.shippingAddress.complement ? ` — ${order.shippingAddress.complement}` : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.shippingAddress.neighborhood} · {order.shippingAddress.city}/
                {order.shippingAddress.state} · CEP {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
