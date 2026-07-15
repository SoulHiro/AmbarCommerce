import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getOrders } from '@/actions/get-orders'
import Header from '@/components/common/header'
import { PageContainer } from '@/components/common/page-container'
import { OrdersClient } from './components/orders-client'

const OrdersPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/sign-in')

  const orders = await getOrders()

  return (
    <>
      <Header />
      <PageContainer className="py-10 md:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Conta
            </p>
            <h1 className="font-heading mt-1 text-2xl font-semibold tracking-wide">Pedidos</h1>
          </div>
          <OrdersClient orders={orders} />
        </div>
      </PageContainer>
    </>
  )
}

export default OrdersPage
