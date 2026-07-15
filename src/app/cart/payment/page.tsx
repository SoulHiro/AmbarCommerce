import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { getCart } from '@/actions/get-cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PaymentSimulator } from './components/payment-simulator'

const VALID_METHODS = ['pix', 'credit_card', 'boleto'] as const
type PaymentMethod = (typeof VALID_METHODS)[number]

interface PaymentPageProps {
  searchParams: Promise<{ method?: string; addressId?: string }>
}

const PaymentPage = async ({ searchParams }: PaymentPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/sign-in')

  const { method, addressId } = await searchParams

  if (!method || !addressId || !VALID_METHODS.includes(method as PaymentMethod)) {
    redirect('/cart/identification')
  }

  const cart = await getCart()
  if (!cart || cart.items.length === 0) redirect('/')

  return (
    <>
      <Header />
      <PageContainer className="py-10 md:py-14">
        <PaymentSimulator
          method={method as PaymentMethod}
          addressId={addressId}
          cart={cart}
        />
      </PageContainer>
    </>
  )
}

export default PaymentPage
