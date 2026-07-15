'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { MapPinIcon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deleteShippingAddress } from '@/actions/delete-shipping-address'
import { getShippingAddresses } from '@/actions/get-shipping-addresses'
import { useRouter } from 'next/navigation'

type Address = Awaited<ReturnType<typeof getShippingAddresses>>[number]

interface AddressesClientProps {
  addresses: Address[]
}

function AddressCard({
  address,
  onDeleted,
}: {
  address: Address
  onDeleted: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)

  const { mutate: remove, isPending } = useMutation({
    mutationFn: () => deleteShippingAddress(address.id),
    onSuccess: () => onDeleted(address.id),
  })

  return (
    <div className="border border-border px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{address.recipientName}</p>
          <p className="text-xs text-muted-foreground">
            {address.street}, {address.number}
            {address.complement ? ` — ${address.complement}` : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            {address.neighborhood} · {address.city}/{address.state} · CEP {address.zipCode}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {address.taxId} · {address.phone}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {confirming ? (
            <>
              <button
                onClick={() => remove()}
                disabled={isPending}
                className={cn(
                  'text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-destructive transition-opacity',
                  isPending && 'opacity-50',
                )}
              >
                {isPending ? 'Removendo…' : 'Confirmar'}
              </button>
              <span className="text-muted-foreground/40">·</span>
              <button
                onClick={() => setConfirming(false)}
                className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-muted-foreground transition-colors hover:text-destructive"
              aria-label="Remover endereço"
            >
              <TrashIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function AddressesClient({ addresses: initial }: AddressesClientProps) {
  const [addresses, setAddresses] = useState(initial)

  const handleDeleted = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id))

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <MapPinIcon className="h-10 w-10 text-muted-foreground/20" strokeWidth={1} />
        <div>
          <p className="text-sm font-medium">Nenhum endereço salvo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Seus endereços aparecem aqui após a primeira compra
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((address) => (
        <AddressCard key={address.id} address={address} onDeleted={handleDeleted} />
      ))}
    </div>
  )
}
