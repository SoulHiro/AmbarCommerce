import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { getCart } from '@/actions/get-cart'
import { getShippingAddresses } from '@/actions/get-shipping-addresses'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { IdentificationClient } from './components/identification-client'

const IdentificationPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/sign-in')

  const [cart, addresses] = await Promise.all([
    getCart(),
    getShippingAddresses(),
  ])

  if (!cart || cart.items.length === 0) redirect('/')

  return (
    <>
      <Header />
      <PageContainer className="py-10 md:py-14">
        <IdentificationClient cart={cart} addresses={addresses} />
      </PageContainer>
    </>
  )
}

export default IdentificationPage
