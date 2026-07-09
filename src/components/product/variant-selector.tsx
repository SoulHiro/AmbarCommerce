'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

export interface VariantOption {
  value: string
  label: string
  imageUrl?: string
}

export interface VariantDimension {
  key: string
  label: string
  type: 'swatch' | 'pill'
  options: VariantOption[]
}

interface VariantSelectorProps {
  dimensions: VariantDimension[]
}

export function VariantSelector({ dimensions }: VariantSelectorProps) {
  const { slug }     = useParams<{ slug: string }>()
  const searchParams = useSearchParams()

  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    return `/products/${slug}?${params.toString()}`
  }

  return (
    <div className="flex flex-col gap-6">
      {dimensions.map(dim => {
        const activeValue  = searchParams.get(dim.key) ?? dim.options[0]?.value
        const activeOption = dim.options.find(o => o.value === activeValue) ?? dim.options[0]

        return (
          <div key={dim.key} className="flex flex-col gap-3">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {dim.label}
              {dim.type === 'swatch' && activeOption && (
                <>
                  {' —'}{' '}
                  <span className="text-[0.7rem] font-normal normal-case tracking-normal text-foreground">
                    {activeOption.label}
                  </span>
                </>
              )}
            </p>

            <div className="flex flex-wrap gap-3">
              {dim.options.map(option => {
                const isActive = activeValue === option.value

                if (dim.type === 'swatch') {
                  return (
                    <Link
                      key={option.value}
                      href={buildHref(dim.key, option.value)}
                      scroll={false}
                      className={cn(
                        'relative h-10 w-10 cursor-pointer overflow-hidden ring-offset-background transition-all',
                        isActive
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'ring-1 ring-border hover:ring-2 hover:ring-foreground/30',
                      )}
                    >
                      {option.imageUrl && (
                        <Image
                          fill
                          src={option.imageUrl}
                          alt={option.label}
                          className="object-cover object-center"
                        />
                      )}
                    </Link>
                  )
                }

                return (
                  <Link
                    key={option.value}
                    href={buildHref(dim.key, option.value)}
                    scroll={false}
                    className={cn(
                      'cursor-pointer border px-3 py-1.5 text-xs transition-colors',
                      isActive
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
                    )}
                  >
                    {option.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
