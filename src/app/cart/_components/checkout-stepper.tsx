import { ShoppingBagIcon, MapPinIcon, CreditCardIcon, CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Sacola', icon: ShoppingBagIcon },
  { label: 'Informações', icon: MapPinIcon },
  { label: 'Pagamento', icon: CreditCardIcon },
]

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <nav aria-label="Etapas do checkout">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const stepNumber = idx + 1
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <li key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center transition-colors',
                    isCompleted && 'bg-primary text-primary-foreground',
                    isActive && 'border border-primary text-primary',
                    !isCompleted && !isActive && 'border border-border text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <step.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[0.6rem] font-medium uppercase tracking-[0.12em]',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mb-5 h-px flex-1 mx-3 transition-colors',
                    isCompleted ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
