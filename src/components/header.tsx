import { Logo } from "./brand/logo"

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Logo iconHeight={36} />
    </header>
  )
}
