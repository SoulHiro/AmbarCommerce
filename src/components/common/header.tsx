'use client'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import {
  HeartIcon,
  LogInIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

import { Logo } from '../brand/logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'

// ─── Types ───────────────────────────────────────────────────────────────────
interface NavColumn {
  title: string
  items: string[]
}

interface NavCategory {
  label: string
  columns: NavColumn[]
  spotlight: {
    image: string
    badge: string
    title: string
  }
}

// ─── Navigation data (mock) ──────────────────────────────────────────────────
const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Novidades',
    columns: [
      { title: 'Roupas', items: ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Jaquetas'] },
      { title: 'Calçados', items: ['Sandálias', 'Botas', 'Mocassins', 'Oxford'] },
      { title: 'Acessórios', items: ['Bolsas', 'Cintos', 'Bijuterias', 'Lenços'] },
    ],
    spotlight: {
      image: '/images/banner.webp',
      badge: 'Destaque',
      title: 'Coleção Outono 2025',
    },
  },
  {
    label: 'Férias',
    columns: [
      { title: 'Praia', items: ['Biquínis', 'Saídas de Praia', 'Camisas de Linho'] },
      { title: 'Cidade', items: ['Vestidos Leves', 'Sandálias Planas', 'Óculos de Sol'] },
      { title: 'Malas & Bolsas', items: ['Sacolas', 'Mochilas', 'Nécessaires'] },
    ],
    spotlight: {
      image: '/images/banner.webp',
      badge: 'Destaque',
      title: 'Verão que não acaba',
    },
  },
  {
    label: 'Outono',
    columns: [
      { title: 'Casacos', items: ['Trench Coats', 'Blazers', 'Cardigans', 'Parkas'] },
      { title: 'Malharia', items: ['Suéteres', 'Cachecóis', 'Luvas', 'Gorros'] },
      { title: 'Calçados', items: ['Botas de Cano Alto', 'Chelsea', 'Loafers'] },
    ],
    spotlight: {
      image: '/images/banner.webp',
      badge: 'Destaque',
      title: 'Lã, couro e cognac',
    },
  },
  {
    label: 'Básicos',
    columns: [
      { title: 'Feminino', items: ['Camisetas', 'Regatas', 'Calças Retas', 'Leggings'] },
      { title: 'Masculino', items: ['Polos', 'Camisetas Brancas', 'Chinos'] },
      { title: 'Unissex', items: ['Moletons', 'Jeans', 'Tênis Brancos'] },
    ],
    spotlight: {
      image: '/images/banner.webp',
      badge: 'Destaque',
      title: 'O armário que nunca erra',
    },
  },
  {
    label: 'Sale',
    columns: [
      { title: 'Até 30% off', items: ['Blusas', 'Saias', 'Acessórios'] },
      { title: 'Até 50% off', items: ['Jaquetas', 'Calçados', 'Bolsas'] },
      { title: 'Até 70% off', items: ['Peças únicas', 'Últimas unidades'] },
    ],
    spotlight: {
      image: '/images/banner.webp',
      badge: 'Destaque',
      title: 'Até 70% de desconto',
    },
  },
]

const GENDER_LINKS = ['Mulher', 'Homem', 'Crianças']

// ─── Component ───────────────────────────────────────────────────────────────
export default function Header() {
  const { data: session } = authClient.useSession()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Preserve last active category so content stays visible during fade-out
  const lastCategoryRef = useRef<string | null>(null)
  if (activeCategory !== null) lastCategoryRef.current = activeCategory
  const displayData = NAV_CATEGORIES.find(c => c.label === lastCategoryRef.current)

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background"
      onMouseLeave={() => setActiveCategory(null)}
    >
      {/* ── Desktop: Line 1 — Gender links / Logo / Icons ────────────────── */}
      <div className="relative hidden h-12 items-center px-12 md:flex">
        {/* Left: gender links */}
        <nav className="flex items-center gap-6" aria-label="Navegação por gênero">
          {GENDER_LINKS.map((label) => (
            <Link
              key={label}
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Center: Logo — pinned absolutely so it never shifts with side content */}
        <div className="pointer-events-none absolute inset-x-0 flex justify-center">
          <Link href="/" className="pointer-events-auto">
            <Logo iconHeight={34} />
          </Link>
        </div>

        {/* Right: action icons */}
        <div className="ml-auto flex items-center gap-5">
          <Link
            href="/auth/sign-in"
            aria-label="Entrar na conta"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <UserIcon className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Favoritos"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            aria-label="Carrinho"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Desktop: Line 2 — Categories / Search ───────────────────────── */}
      <div className="hidden h-12 items-center justify-between px-12 md:flex">
        {/* Left: category nav */}
        <nav className="flex items-center gap-8" aria-label="Categorias">
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onMouseEnter={() => setActiveCategory(cat.label)}
              className={cn(
                'relative pb-px text-sm transition-colors',
                activeCategory === cat.label
                  ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Right: search — underline style, editorial */}
        <label className="group flex cursor-text items-center gap-2.5">
          <SearchIcon
            className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground"
            strokeWidth={1.75}
          />
          <input
            type="search"
            placeholder="Buscar na coleção..."
            className={cn(
              'w-52 bg-transparent pb-px text-sm text-foreground outline-none',
              'border-b border-border transition-colors focus:border-foreground',
              'placeholder:text-muted-foreground',
              '[&::-webkit-search-cancel-button]:hidden',
            )}
          />
        </label>
      </div>

      {/* ── Mobile ───────────────────────────────────────────────────────── */}
      <div className="flex h-14 items-center justify-between px-6 md:hidden">
        <Link href="/">
          <Logo iconHeight={26} />
        </Link>
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
            <div className="px-8">
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={session.user.image as string | undefined} />
                    <AvatarFallback>
                      {session.user.name?.split(' ')?.[0]?.[0]}
                      {session.user.name?.split(' ')?.[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{session.user.name}</h3>
                    <span className="block text-xs text-muted-foreground">
                      {session.user.email}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá, faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/auth/sign-in">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Mega menu ────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'absolute left-0 right-0 top-full hidden border-b border-border bg-background shadow-sm md:block',
          'motion-safe:transition-[opacity,transform] motion-safe:duration-[180ms] motion-safe:ease-out',
          activeCategory
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0',
        )}
        aria-hidden={!activeCategory}
      >
        {displayData && (
          <div className="flex gap-0 px-12 py-10">
            {/* Topic columns */}
            <div className="flex flex-1 gap-16">
              {displayData.columns.map((col) => (
                <div key={col.title} className="flex min-w-0 flex-col gap-4">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground">
                    {col.title}
                  </span>
                  <ul className="flex flex-col gap-3">
                    {col.items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          tabIndex={activeCategory ? 0 : -1}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Spotlight product */}
            <div className="flex w-72 flex-shrink-0 flex-col border-l border-border pl-10">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={displayData.spotlight.image}
                  alt={displayData.spotlight.title}
                  fill
                  className="object-cover object-center"
                  sizes="288px"
                />
              </div>
              <span className="mt-3 text-[0.6rem] font-semibold uppercase tracking-widest text-primary">
                {displayData.spotlight.badge}
              </span>
              <h4 className="font-heading mt-1 text-sm font-semibold leading-snug">
                {displayData.spotlight.title}
              </h4>
              <Link
                href="#"
                tabIndex={activeCategory ? 0 : -1}
                className="mt-3 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Compre agora
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
