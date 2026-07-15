'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutStepper } from '@/app/cart/_components/checkout-stepper'
import { CheckoutOrderSummary } from '@/app/cart/_components/checkout-order-summary'
import { PixSimulator } from './pix-simulator'
import { CreditCardSimulator } from './credit-card-simulator'
import { BoletoSimulator } from './boleto-simulator'
import { createOrder } from '@/actions/create-order'
import { getCart } from '@/actions/get-cart'

type PaymentMethod = 'pix' | 'credit_card' | 'boleto'
type Cart = Awaited<ReturnType<typeof getCart>>

const METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de crédito',
  boleto: 'Boleto bancário',
}

interface PaymentSimulatorProps {
  method: PaymentMethod
  addressId: string
  cart: Cart
}

export function PaymentSimulator({ method, addressId, cart }: PaymentSimulatorProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.productVariant.priceInCents * item.quantity,
    0,
  )

  const handleConfirm = async () => {
    setError(null)
    setIsPending(true)
    try {
      const { orderId } = await createOrder({ addressId, paymentMethod: method })
      router.push(`/cart/success?orderId=${orderId}`)
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.')
      setIsPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
      {/* Left column */}
      <div className="flex flex-col gap-10 lg:col-span-2">
        <CheckoutStepper currentStep={3} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-base font-semibold tracking-wide">
              {METHOD_LABELS[method]}
            </h2>
            <p className="text-xs text-muted-foreground">
              Confirme o pagamento para finalizar seu pedido
            </p>
          </div>

          <div className="animate-in slide-in-from-top-2 duration-200">
            {method === 'pix' && <PixSimulator totalInCents={subtotal} />}
            {method === 'credit_card' && <CreditCardSimulator />}
            {method === 'boleto' && <BoletoSimulator />}
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="flex w-full items-center justify-center bg-primary py-4 text-[0.7rem] font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Processando...' : 'Confirmar pagamento'}
        </button>
      </div>

      {/* Right column */}
      <div className="order-first lg:order-last lg:col-span-1">
        <CheckoutOrderSummary cart={cart} />
      </div>
    </div>
  )
}
