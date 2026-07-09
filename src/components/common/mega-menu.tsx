'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { InnerContainer } from './page-container'
import { type NavCategory } from '@/data/navigation'

interface MegaMenuProps {
  activeCategory: string | null
  displayData: NavCategory | undefined
}

export function MegaMenu({ activeCategory, displayData }: MegaMenuProps) {
  return (
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
        <InnerContainer className="flex py-10">
          <div className="flex flex-1 gap-16">
            {displayData.columns.map(col => (
              <div key={col.title} className="flex min-w-0 flex-col gap-4">
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground">
                  {col.title}
                </span>
                <ul className="flex flex-col gap-3">
                  {col.items.map(item => (
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
        </InnerContainer>
      )}
    </div>
  )
}
