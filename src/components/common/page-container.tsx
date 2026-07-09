import { cn } from '@/lib/utils'

const CONTAINER = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn(CONTAINER, 'py-8', className)}>
      {children}
    </main>
  )
}

/** Mesmos constraints de largura e padding horizontal do PageContainer, sem padding vertical. */
export function InnerContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn(CONTAINER, className)}>
      {children}
    </div>
  )
}
