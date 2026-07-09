import Header from '@/components/common/header'
import { ProductList } from '@/components/common/products-list'
import { db } from '@/db'
import Image from 'next/image'

export default async function Home() {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  })

  return (
    <>
      <Header />
      <div className="px-0">
        <Image
          src="/images/banner.webp"
          alt="banner"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>
      <ProductList title="Produtos" products={products} />
    </>
  )
}
