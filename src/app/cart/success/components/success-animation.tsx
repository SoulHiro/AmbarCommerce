'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatCentsToBRL } from '@/helpers/money'
import { getOrders } from '@/actions/get-orders'

type Order = Awaited<ReturnType<typeof getOrders>>[number]

const METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

interface SuccessAnimationProps {
  order: Order
}

export function SuccessAnimation({ order }: SuccessAnimationProps) {
  const orderNumber = order.id.split('-')[0].toUpperCase()

  return (
    <>
      <style>{`
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes border-pulse {
          0%, 100% { border-color: oklch(var(--primary) / 0.4); }
          50%       { border-color: oklch(var(--primary) / 1); }
        }
        .anim-check {
          stroke-dasharray: 32;
          stroke-dashoffset: 32;
          animation: draw-check 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards;
        }
        .anim-check-ring {
          animation: border-pulse 1.2s ease-in-out 3;
        }
        .anim-1 {
          opacity: 0;
          animation: fade-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both;
        }
        .anim-2 {
          opacity: 0;
          animation: fade-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }
        .anim-3 {
          opacity: 0;
          animation: fade-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
        }
        .anim-4 {
          opacity: 0;
          animation: fade-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.95s both;
        }
        .anim-5 {
          opacity: 0;
          animation: fade-slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-check, .anim-check-ring,
          .anim-1, .anim-2, .anim-3, .anim-4, .anim-5 {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Checkmark */}
      <div className="mb-10 flex justify-center">
        <div className="anim-check-ring flex h-16 w-16 items-center justify-center border-2 border-primary">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
            <polyline
              points="4,12 9,17 20,6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-check text-primary"
            />
          </svg>
        </div>
      </div>

      {/* Label + number */}
      <div className="anim-1 mb-2 text-center">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-primary">
          Pedido confirmado
        </p>
      </div>
      <div className="anim-2 mb-8 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-wide">
          #{orderNumber}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Obrigado pela sua compra. Você receberá um e-mail com os detalhes.
        </p>
      </div>

      {/* Items */}
      <div className="anim-3 mb-6 flex flex-col gap-4 border-t border-border pt-7">
        {order.items.map((item, i) => (
          <div
            key={item.id}
            className="flex gap-4"
            style={{
              opacity: 0,
              animation: `fade-slide-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.85 + i * 0.07}s both`,
            }}
          >
            <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-muted">
              <Image
                src={item.productVariant.imageUrl}
                alt={item.productVariant.product.name}
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between py-0.5">
              <div>
                <p className="text-sm font-medium">{item.productVariant.product.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.productVariant.color}
                  {item.productVariant.size ? ` · ${item.productVariant.size}` : ''}
                  {' · '}Qtd. {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums">
                {formatCentsToBRL(item.priceInCents * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="anim-4 mb-8 flex flex-col gap-3 border-t border-border pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-sm font-medium tabular-nums">
            {formatCentsToBRL(order.totalInCents)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Pagamento</span>
          <span className="text-xs font-medium">{METHOD_LABELS[order.paymentMethod]}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Entrega</span>
          <span className="text-xs font-medium">
            {order.shippingAddress.city}/{order.shippingAddress.state}
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="anim-5 flex flex-col gap-3">
        <Link
          href="/orders"
          className="flex w-full items-center justify-center bg-primary py-4 text-[0.7rem] font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
        >
          Ver meu pedido
        </Link>
        <Link
          href="/products"
          className="flex w-full items-center justify-center border border-border py-4 text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-accent"
        >
          Continuar comprando
        </Link>
      </div>
    </>
  )
}
