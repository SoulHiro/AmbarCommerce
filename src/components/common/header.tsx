'use client'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import {
  HeartIcon,
  HistoryIcon,
  MapPinIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Logo } from '../brand/logo'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { InnerContainer } from './page-container'
import { CartSheet } from './cart'
import { MobileSheet } from './mobile-sheet'
import { MegaMenu } from './mega-menu'
import { NAV_CATEGORIES, GENDER_LINKS } from '@/data/navigation'

const PROFILE_MENU = [
  { label: 'Histórico de pedidos', icon: HistoryIcon, href: '/orders' },
  { label: 'Favoritos', icon: HeartIcon, href: '/account/wishlist' },
  { label: 'Endereços', icon: MapPinIcon, href: '/addresses' },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function Header() {
  const { data: session } = authClient.useSession()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const lastCategoryRef = useRef<string | null>(null)
  if (activeCategory !== null) lastCategoryRef.current = activeCategory
  const displayData = NAV_CATEGORIES.find(c => c.label === lastCategoryRef.current)

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-border bg-background"
        onMouseLeave={() => setActiveCategory(null)}
      >
        {/* ── Desktop Line 1: Gender / Logo / Icons ─── */}
        <InnerContainer className="relative hidden h-12 items-center md:flex">
          <nav className="flex items-center gap-6" aria-label="Navegação por gênero">
            {GENDER_LINKS.map(link => (
              <Link key={link.href} href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center">
            <Link href="/" className="pointer-events-auto">
              <Logo iconHeight={34} />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-5">
            {/* Profile popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Perfil"
                  className="flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                  <UserIcon className="h-5 w-5" strokeWidth={1.5} />
                  {session?.user && (
                    <span className="text-sm">
                      {session.user.name?.split(' ')[0]}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                {session?.user ? (
                  <>
                    {/* User header */}
                    <div className="px-5 py-4">
                      {session.user.name && (
                        <p className="text-sm font-semibold leading-none">{session.user.name}</p>
                      )}
                      <p className={session.user.name ? 'mt-1 text-xs text-muted-foreground' : 'text-sm font-semibold leading-none'}>
                        {session.user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="pb-1">
                      {PROFILE_MENU.map(({ label, icon: Icon, href }) => (
                        <Link key={label} href={href}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                          <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                          {label}
                        </Link>
                      ))}
                    </div>

                    {/* Minha conta */}
                    <div className="px-3 pb-3">
                      <Link href="/profile"
                        className="flex items-center justify-center bg-muted py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground">
                        Minha conta
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-3">
                    <Link href="/auth/sign-in"
                      className="flex items-center justify-center bg-muted py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground">
                      Entrar
                    </Link>
                    <Link href="/auth/sign-up"
                      className="mt-2 flex justify-center text-xs text-muted-foreground transition-colors hover:text-foreground">
                      Criar conta
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            <Link href="/account/wishlist" aria-label="Favoritos"
              className="text-muted-foreground transition-colors hover:text-foreground">
              <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            <button aria-label="Carrinho" onClick={() => setCartOpen(true)}
              className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </InnerContainer>

        {/* ── Desktop Line 2: Categories / Search ─── */}
        <InnerContainer className="hidden h-12 items-center justify-between md:flex">
          <nav className="flex items-center gap-8" aria-label="Categorias">
            {NAV_CATEGORIES.map(cat => (
              <button key={cat.label}
                onMouseEnter={() => setActiveCategory(cat.label)}
                className={cn(
                  'relative pb-px text-sm transition-colors',
                  activeCategory === cat.label
                    ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}>
                {cat.label}
              </button>
            ))}
          </nav>

          <label className="group flex cursor-text items-center gap-2.5">
            <SearchIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground"
              strokeWidth={1.75} />
            <input type="search" placeholder="Buscar na coleção..."
              className={cn(
                'w-52 bg-transparent pb-px text-sm text-foreground outline-none',
                'border-b border-border transition-colors focus:border-foreground',
                'placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
              )} />
          </label>
        </InnerContainer>

        {/* ── Mobile ─── */}
        <InnerContainer className="flex h-14 items-center justify-between md:hidden">
          <Link href="/"><Logo iconHeight={26} /></Link>
          <div className="flex items-center gap-3">
            <button aria-label="Carrinho" onClick={() => setCartOpen(true)}
              className="text-muted-foreground transition-colors hover:text-foreground">
              <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <MobileSheet />
          </div>
        </InnerContainer>

        <MegaMenu activeCategory={activeCategory} displayData={displayData} />
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
