import { getWishlist } from '@/actions/get-wishlist'
import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { WishlistGrid } from '@/components/wishlist/wishlist-grid'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Favoritos — Âmbar',
}

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/sign-in')

  const products = await getWishlist()
  const count = products.length

  return (
    <>
      <Header />

      <PageContainer className="py-12">
        <div className="mb-10 flex items-baseline justify-between">
          <h1 className="font-heading text-2xl font-semibold">Favoritos</h1>
          {count > 0 && (
            <span className="text-xs text-muted-foreground">
              {count} {count === 1 ? 'peça' : 'peças'}
            </span>
          )}
        </div>

        <WishlistGrid initialProducts={products} />
      </PageContainer>
    </>
  )
}
