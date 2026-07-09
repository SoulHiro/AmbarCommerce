'use client'

import { ShoppingBagIcon } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <ShoppingBagIcon className="h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
          <div>
            <p className="text-sm font-medium">Seu carrinho está vazio</p>
            <p className="mt-1 text-xs text-muted-foreground">Adicione peças para começar</p>
          </div>
          <Link
            href="/products"
            onClick={() => onOpenChange(false)}
            className="mt-2 border-b border-border pb-0.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Ver coleção
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
