import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage:   number
  totalPages:    number
  searchParams:  Record<string, string | undefined>
}

function buildHref(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][],
  )
  if (page === 1) params.delete('page')
  else params.set('page', String(page))
  const qs = params.toString()
  return qs ? `?${qs}` : '?'
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  // Build page numbers with ellipsis: always show 1, last, and ±2 around current
  const pages: (number | '…')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1" aria-label="Paginação">
      <Link
        href={buildHref(searchParams, currentPage - 1)}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        className={cn(
          'flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground',
          currentPage <= 1 && 'pointer-events-none opacity-30',
        )}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon className="h-4 w-4" strokeWidth={1.5} />
      </Link>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(searchParams, p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-8 w-8 items-center justify-center text-xs transition-colors',
              p === currentPage
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(searchParams, currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        className={cn(
          'flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground',
          currentPage >= totalPages && 'pointer-events-none opacity-30',
        )}
        aria-label="Próxima página"
      >
        <ChevronRightIcon className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </nav>
  )
}
