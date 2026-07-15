'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBagIcon } from 'lucide-react'
import { OrderCard } from './order-card'
import { getOrders } from '@/actions/get-orders'

type Order = Awaited<ReturnType<typeof getOrders>>[number]

interface OrdersClientProps {
  orders: Order[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null,
  )

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id))

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingBagIcon className="h-10 w-10 text-muted-foreground/20" strokeWidth={1} />
        <div>
          <p className="text-sm font-medium">Nenhum pedido encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Seus pedidos aparecerão aqui após a primeira compra
          </p>
        </div>
        <Link
          href="/products"
          className="mt-2 border-b border-border pb-0.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          Ver coleção
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          expanded={expandedId === order.id}
          onToggle={() => toggle(order.id)}
        />
      ))}
    </div>
  )
}
