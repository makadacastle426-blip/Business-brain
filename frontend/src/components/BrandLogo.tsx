import type { ImgHTMLAttributes } from 'react'
import businessBrainLogo from '../assets/business-brain-logo.png'

type LogoSize = 'sm' | 'md' | 'lg' | 'hero'

const sizeClass: Record<LogoSize, string> = {
  sm: 'h-10 w-auto',
  md: 'h-14 w-auto',
  lg: 'h-24 w-auto',
  hero: 'h-36 w-auto sm:h-44',
}

type BrandLogoProps = {
  size?: LogoSize
  className?: string
  decorative?: boolean
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>

/** Official Business Brain brand mark — never replace with Lucide Brain. */
export function BrandLogo({
  size = 'md',
  className = '',
  decorative = false,
  ...rest
}: BrandLogoProps) {
  return (
    <img
      src={businessBrainLogo}
      alt={decorative ? '' : 'Business Brain'}
      aria-hidden={decorative || undefined}
      className={`${sizeClass[size]} object-contain ${className}`}
      draggable={false}
      {...rest}
    />
  )
}

type BrandLockupProps = {
  size?: LogoSize
  showTagline?: boolean
  align?: 'left' | 'center'
  className?: string
  compact?: boolean
}

export function BrandLockup({
  size = 'md',
  showTagline = true,
  align = 'left',
  className = '',
  compact = false,
}: BrandLockupProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`flex flex-col gap-2 ${alignment} ${className}`}>
      <BrandLogo size={size} />
      {compact ? (
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-ink">
            BUSINESS BRAIN
          </p>
          {showTagline && (
            <p className="text-xs text-muted">Your AI Business Team</p>
          )}
        </div>
      ) : (
        showTagline && (
          <p className="max-w-xs text-sm font-medium tracking-wide text-muted">
            Your AI Business Team
          </p>
        )
      )}
    </div>
  )
}

export { businessBrainLogo }
