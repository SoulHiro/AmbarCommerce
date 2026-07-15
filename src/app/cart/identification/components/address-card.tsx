import { RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { getShippingAddresses } from '@/actions/get-shipping-addresses'

type Address = Awaited<ReturnType<typeof getShippingAddresses>>[number]

interface AddressCardProps {
  address: Address
  selected: boolean
}

export function AddressCard({ address, selected }: AddressCardProps) {
  return (
    <label
      htmlFor={address.id}
      className={cn(
        'flex cursor-pointer gap-4 border p-5 transition-all',
        selected ? 'border-primary bg-primary/[0.03]' : 'border-border hover:border-foreground/30',
      )}
    >
      <RadioGroupItem value={address.id} id={address.id} className="mt-0.5 flex-shrink-0" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium leading-none">{address.recipientName}</span>
        <span className="text-xs text-muted-foreground">
          {address.street}, {address.number}
          {address.complement ? ` — ${address.complement}` : ''} · {address.neighborhood}
        </span>
        <span className="text-xs text-muted-foreground">
          {address.city}/{address.state} · CEP {address.zipCode}
        </span>
      </div>
    </label>
  )
}
