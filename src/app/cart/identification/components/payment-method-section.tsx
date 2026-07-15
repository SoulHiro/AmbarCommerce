'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { QrCodeIcon, CreditCardIcon, FileTextIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaymentMethod = 'pix' | 'credit_card' | 'boleto'

const METHODS = [
  {
    value: 'pix' as PaymentMethod,
    icon: QrCodeIcon,
    label: 'PIX',
    description: 'Aprovação imediata',
  },
  {
    value: 'credit_card' as PaymentMethod,
    icon: CreditCardIcon,
    label: 'Cartão de crédito',
    description: 'Em até 12x sem juros',
  },
  {
    value: 'boleto' as PaymentMethod,
    icon: FileTextIcon,
    label: 'Boleto bancário',
    description: 'Vencimento em 3 dias úteis',
  },
]

interface PaymentMethodSectionProps {
  selected: PaymentMethod | null
  onSelect: (value: PaymentMethod) => void
}

export function PaymentMethodSection({ selected, onSelect }: PaymentMethodSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-base font-semibold tracking-wide">
        Método de pagamento
      </h2>

      <div className="border border-border bg-muted/40 px-4 py-3">
        <p className="text-[0.65rem] text-muted-foreground">
          Ambiente de demonstração. Nenhuma cobrança real será efetuada.
        </p>
      </div>

      <RadioGroup
        value={selected ?? ''}
        onValueChange={(v) => onSelect(v as PaymentMethod)}
        className="flex flex-col gap-3"
      >
        {METHODS.map((method) => (
          <label
            key={method.value}
            htmlFor={method.value}
            className={cn(
              'flex cursor-pointer items-center gap-4 border p-5 transition-all',
              selected === method.value
                ? 'border-primary bg-primary/[0.03]'
                : 'border-border hover:border-foreground/30',
            )}
          >
            <RadioGroupItem value={method.value} id={method.value} className="flex-shrink-0" />
            <method.icon
              className={cn(
                'h-4 w-4 flex-shrink-0 transition-colors',
                selected === method.value ? 'text-primary' : 'text-muted-foreground',
              )}
              strokeWidth={1.5}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium leading-none">{method.label}</span>
              <span className="text-xs text-muted-foreground">{method.description}</span>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
