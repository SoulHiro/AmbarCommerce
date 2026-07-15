import { db, orderTable } from '@/db'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SuccessAnimation } from './components/success-animation'

interface SuccessPageProps {
  searchParams: Promise<{ orderId?: string }>
}

const SuccessPage = async ({ searchParams }: SuccessPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/auth/sign-in')

  const { orderId } = await searchParams
  if (!orderId) redirect('/')

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: { product: true },
          },
        },
      },
    },
  })

  if (!order || order.userId !== session.user.id) redirect('/')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24">
        <SuccessAnimation order={order} />
      </div>
    </main>
  )
}

export default SuccessPage
