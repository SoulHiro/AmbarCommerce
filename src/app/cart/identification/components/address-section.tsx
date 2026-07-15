'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddressCard } from './address-card'
import { AddressForm } from './address-form'
import { getShippingAddresses } from '@/actions/get-shipping-addresses'
import { type CreateShippingAddressInput } from '@/actions/create-shipping-address/schema'
import { useRef } from 'react'

type Address = Awaited<ReturnType<typeof getShippingAddresses>>[number]

interface AddressSectionProps {
  addresses: Address[]
  selected: string | null
  onSelect: (value: string) => void
  onFormReady: (
    getValues: () => CreateShippingAddressInput,
    isValid: () => Promise<boolean>,
  ) => void
}

export function AddressSection({ addresses, selected, onSelect, onFormReady }: AddressSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-base font-semibold tracking-wide">
        Endereço de entrega
      </h2>

      <RadioGroup value={selected ?? ''} onValueChange={onSelect} className="flex flex-col gap-3">
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} selected={selected === address.id} />
        ))}

        {/* Add new card */}
        <label
          htmlFor="add_new"
          className={cn(
            'flex cursor-pointer items-center gap-4 border p-5 transition-all',
            selected === 'add_new'
              ? 'border-primary bg-primary/[0.03]'
              : 'border-border hover:border-foreground/30',
          )}
        >
          <RadioGroupItem value="add_new" id="add_new" className="flex-shrink-0" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <PlusIcon className="h-3.5 w-3.5" strokeWidth={2} />
            Adicionar novo endereço
          </div>
        </label>

        {/* Form expands when add_new is selected */}
        {selected === 'add_new' && (
          <div className="animate-in slide-in-from-top-2 duration-200 border border-border p-6">
            <AddressForm onReady={onFormReady} />
          </div>
        )}
      </RadioGroup>
    </div>
  )
}
