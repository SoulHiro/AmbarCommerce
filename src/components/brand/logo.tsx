import { LogoIcon } from "./logo-icon"
import { LogoText } from "./logo-text"

interface LogoProps {
  className?: string
  iconHeight?: number
}

export function Logo({ className, iconHeight = 32 }: LogoProps) {
  const iconWidth = Math.round(iconHeight * (232 / 360))
  const textWidth = Math.round(iconHeight * (529 / 184) * 0.55)
  const textHeight = Math.round(iconHeight * 0.55)

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoIcon width={iconWidth} height={iconHeight} />
      <LogoText width={textWidth} height={textHeight} />
    </div>
  )
}
