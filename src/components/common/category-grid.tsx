import Image from 'next/image'
import Link from 'next/link'

export interface Category {
  name: string
  image: string
  href: string
}

interface CategoryGridProps {
  title?: string
  categories: Category[]
}

export function CategoryGrid({ title, categories }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      {title && (
        <h3 className="font-heading text-center text-lg font-semibold">{title}</h3>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative block aspect-[3/4] overflow-hidden bg-muted"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="text-sm font-medium tracking-wide text-white">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
