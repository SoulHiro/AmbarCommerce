import Link from 'next/link'
import { Logo } from '../brand/logo'

const NAV_COLUMNS = [
  {
    heading: 'Ajuda',
    links: [
      { label: 'Como comprar', href: '#' },
      { label: 'Trocas e devoluções', href: '#' },
      { label: 'Rastrear pedido', href: '#' },
      { label: 'Fale conosco', href: '#' },
    ],
  },
  {
    heading: 'A marca',
    links: [
      { label: 'Sobre nós', href: '#' },
      { label: 'Sustentabilidade', href: '#' },
      { label: 'Trabalhe conosco', href: '#' },
    ],
  },
  {
    heading: 'Informações',
    links: [
      { label: 'Formas de pagamento', href: '#' },
      { label: 'Política de privacidade', href: '#' },
      { label: 'Termos de uso', href: '#' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'TikTok', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Top row: Logo + nav columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo iconHeight={30} />
            <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">
              Moda que combina com você, curada com cuidado e entregue com elegância.
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-foreground">
                {col.heading}
              </span>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: Social + copyright */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Âmbar. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
