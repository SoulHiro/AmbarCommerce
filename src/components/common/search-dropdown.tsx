'use client'

import { searchProducts, type SearchResult } from '@/actions/search-products'
import { formatCentsToBRL } from '@/helpers/money'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function SearchDropdown() {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<SearchResult[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen]       = useState(false)
  const [focused, setFocused]   = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router       = useRouter()

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    setFocused(-1)

    if (!value.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    setOpen(true)
    setLoading(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const data = await searchProducts(value)
      setResults(data)
      setLoading(false)
    }, 300)
  }

  const close = () => {
    setOpen(false)
    setQuery('')
    setResults([])
    setFocused(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      close()
      inputRef.current?.blur()
      return
    }
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused(f => Math.min(f + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused(f => Math.max(f - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = focused >= 0 ? results[focused] : results[0]
      if (target) {
        router.push(`/products/${target.slug}`)
        close()
        inputRef.current?.blur()
      }
    }
  }

  const showEmpty = isOpen && !isLoading && query.trim() && results.length === 0

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <label className="group flex cursor-text items-center gap-2.5">
        <SearchIcon
          className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground"
          strokeWidth={1.75}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Buscar na coleção..."
          autoComplete="off"
          className={cn(
            'w-52 bg-transparent pb-px text-sm text-foreground outline-none',
            'border-b border-border transition-colors focus:border-foreground',
            'placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
          )}
        />
      </label>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 border border-border bg-background shadow-xl">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs tracking-wider text-muted-foreground">
                A procurar...
              </span>
            </div>
          )}

          {/* Empty */}
          {showEmpty && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum resultado para{' '}
                <span className="font-medium text-foreground">"{query}"</span>
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <>
              <ul role="listbox">
                {results.map((product, i) => (
                  <li key={product.id} role="option" aria-selected={focused === i}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={close}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 transition-colors',
                        focused === i ? 'bg-accent' : 'hover:bg-accent',
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden bg-muted">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover object-center"
                            sizes="40px"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-none">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {product.categoryName}
                        </p>
                        <p className="mt-1.5 text-xs font-semibold">
                          {formatCentsToBRL(product.priceInCents)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Footer hint */}
              <div className="border-t border-border px-4 py-2.5">
                <p className="text-[0.6rem] text-muted-foreground">
                  ↑↓ navegar · Enter abrir · Esc fechar
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
