import Image from 'next/image'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 32,
  md: 64,
  lg: 88,
  xl: 128,
} as const

type LogoSize = keyof typeof SIZES

export function Logo({
  size = 'md',
  className,
  priority = false,
}: {
  size?: LogoSize
  className?: string
  priority?: boolean
}) {
  const px = SIZES[size]
  return (
    <span
      className={cn(
        'relative inline-block overflow-hidden rounded-full',
        'shadow-[0_0_40px_rgba(212,175,55,0.25),0_0_0_1px_rgba(212,175,55,0.45)]',
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src="/brand/logo.png"
        alt="MARSYS-JIS"
        width={px}
        height={px}
        priority={priority}
        className="block h-full w-full object-cover"
      />
    </span>
  )
}
