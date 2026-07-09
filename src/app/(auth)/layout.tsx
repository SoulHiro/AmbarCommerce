import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col p-8 lg:w-1/2">
        <span className="text-xl font-bold tracking-tight">WearCommerce</span>
        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          src="/images/authentication.webp"
          alt="Authentication"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-end p-12">
          <div className="max-w-xs text-right text-white">
            <p className="text-3xl font-semibold leading-snug">
              Sua loja favorita,<br />na palma da sua mão.
            </p>
            <p className="mt-3 text-sm opacity-75">
              Descubra moda que combina com você.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
