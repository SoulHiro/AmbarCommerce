'use client'

import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { NAV_CATEGORIES, GENDER_LINKS } from '@/data/navigation'

export function MobileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-8">
          {NAV_CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href="#"
              className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat.label}
            </Link>
          ))}
          <div className="my-3 border-t border-border" />
          {GENDER_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
