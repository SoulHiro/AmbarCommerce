import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { InnerContainer } from './page-container'

interface EditorialBannerProps {
  image: string
  eyebrow?: string
  title: string
  href?: string
  linkLabel?: string
  align?: 'left' | 'right'
  className?: string
  priority?: boolean
}

export function EditorialBanner({
  image,
  eyebrow,
  title,
  href = '/products',
  linkLabel = 'Explorar coleção',
  align = 'left',
  className,
  priority = false,
}: EditorialBannerProps) {
  const isRight = align === 'right'

  return (
    <section className={cn('bg-muted relative min-h-[520px] overflow-hidden', className)}>
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient — cobre a lateral do texto */}
      <div
        className={[
          'absolute inset-0',
          isRight
            ? 'bg-gradient-to-l from-black/65 via-black/30 to-transparent'
            : 'bg-gradient-to-r from-black/65 via-black/30 to-transparent',
        ].join(' ')}
      />

      {/* Camada absoluta full-width → InnerContainer alinha ao grid da página */}
      <div className="absolute inset-0 flex flex-col justify-end pt-10 pb-14">
        <InnerContainer className="w-full">
          <div
            className={isRight ? 'ml-auto max-w-sm text-right' : 'mr-auto max-w-sm text-left'}
          >
            {eyebrow && (
              <span className="text-[0.65rem] font-semibold tracking-widest text-white/70 uppercase">
                {eyebrow}
              </span>
            )}
            <h2 className="font-heading mt-2 text-3xl leading-snug font-semibold text-white md:text-4xl">
              {title}
            </h2>
            {href && (
              <Link
                href={href}
                className="mt-5 inline-block border-b border-white/50 pb-0.5 text-sm text-white/90 transition-colors hover:border-white hover:text-white"
              >
                {linkLabel}
              </Link>
            )}
          </div>
        </InnerContainer>
      </div>
    </section>
  )
}
