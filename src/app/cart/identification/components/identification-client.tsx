'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CheckoutStepper } from '@/app/cart/_components/checkout-stepper'
import { CheckoutOrderSummary } from '@/app/cart/_components/checkout-order-summary'
import { AddressSection } from './address-section'
import { PaymentMethodSection } from './payment-method-section'
import { createShippingAddress } from '@/actions/create-shipping-address'
import { getCart } from '@/actions/get-cart'
import { getShippingAddresses } from '@/actions/get-shipping-addresses'
import { type CreateShippingAddressInput } from '@/actions/create-shipping-address/schema'

type Cart = Awaited<ReturnType<typeof getCart>>
type Address = Awaited<ReturnType<typeof getShippingAddresses>>[number]
type PaymentMethod = 'pix' | 'credit_card' | 'boleto'

interface IdentificationClientProps {
  cart: Cart
  addresses: Address[]
}

export function IdentificationClient({ cart, addresses }: IdentificationClientProps) {
  const router = useRouter()
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    addresses.length > 0 ? addresses[0].id : 'add_new',
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formGetValues = useRef<(() => CreateShippingAddressInput) | null>(null)
  const formIsValid = useRef<(() => Promise<boolean>) | null>(null)

  const handleFormReady = useCallback(
    (getValues: () => CreateShippingAddressInput, isValid: () => Promise<boolean>) => {
      formGetValues.current = getValues
      formIsValid.current = isValid
    },
    [],
  )

  const handleContinue = async () => {
    setError(null)

    if (!selectedAddress) {
      setError('Selecione ou cadastre um endereço de entrega.')
      return
    }
    if (!paymentMethod) {
      setError('Selecione um método de pagamento.')
      return
    }

    setIsPending(true)
    try {
      let addressId = selectedAddress

      if (selectedAddress === 'add_new') {
        if (!formIsValid.current || !formGetValues.current) return
        const valid = await formIsValid.current()
        if (!valid) {
          setIsPending(false)
          return
        }
        const values = formGetValues.current()
        const result = await createShippingAddress(values)
        addressId = result.id
      }

      router.push(`/cart/payment?method=${paymentMethod}&addressId=${addressId}`)
    } catch {
      setError('Algo deu errado. Tente novamente.')
      setIsPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
      {/* Left column */}
      <div className="flex flex-col gap-10 lg:col-span-2">
        <CheckoutStepper currentStep={2} />

        <AddressSection
          addresses={addresses}
          selected={selectedAddress}
          onSelect={setSelectedAddress}
          onFormReady={handleFormReady}
        />

        <div className="border-t border-border" />

        <PaymentMethodSection selected={paymentMethod} onSelect={setPaymentMethod} />

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={isPending}
          className="flex w-full items-center justify-center bg-primary py-4 text-[0.7rem] font-semibold tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Aguarde...' : 'Continuar com pagamento'}
        </button>
      </div>

      {/* Right column — order summary */}
      <div className="order-first lg:order-last lg:col-span-1">
        <CheckoutOrderSummary cart={cart} />
      </div>
    </div>
  )
}
