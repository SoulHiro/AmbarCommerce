import type { Metadata } from 'next'
import { Noto_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import './globals.css'

const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' })
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Âmbar',
  description: 'Sua loja favorita, na palma da sua mão.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={cn('font-sans', notoSans.variable, playfairDisplay.variable)}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
