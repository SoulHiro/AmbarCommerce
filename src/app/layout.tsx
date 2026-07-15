import type { Metadata } from 'next'
import { Noto_Sans, Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'
import ReactQueryProvider from '@/providers/react-query'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
})
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Âmbar',
  description: 'Sua loja favorita, na palma da sua mão.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn('font-sans', notoSans.variable, playfairDisplay.variable)}
    >
      <body className="antialiased">
        <NuqsAdapter>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  )
}
