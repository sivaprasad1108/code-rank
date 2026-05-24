import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  cloneElement,
  Children,
  isValidElement,
} from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Minimal Slot: renders its single child element, merging button classes/props onto it.
 * Used for `asChild` so <Button asChild><Link /></Button> renders a styled <Link>.
 */
function Slot({
  children,
  ...slotProps
}: {
  children: ReactElement
  [key: string]: unknown
}) {
  const child = Children.only(children) as ReactElement<Record<string, unknown>>
  return cloneElement(child, {
    ...slotProps,
    ...child.props,
    className: cn(
      (slotProps as { className?: string }).className,
      child.props.className as string | undefined,
    ),
  })
}

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-medium transition-all select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-white',
          'hover:bg-accent-hover',
          'shadow-glow-sm hover:shadow-glow',
          'active:scale-[0.97]',
        ],
        secondary: [
          'border border-accent text-accent',
          'hover:bg-accent/10',
          'active:scale-[0.97]',
        ],
        ghost: [
          'text-text-muted',
          'hover:text-text-primary hover:bg-white/5',
        ],
        danger: [
          'bg-red-500/20 text-red-400 border border-red-500/30',
          'hover:bg-red-500/30',
        ],
        outline: [
          'border border-border text-text-primary',
          'hover:bg-white/5 hover:border-border-accent',
        ],
      },
      size: {
        sm:        'h-8 px-3 text-xs rounded-md',
        md:        'h-10 px-4 text-sm rounded-lg',
        lg:        'h-12 px-6 text-base rounded-xl',
        icon:      'h-10 w-10 rounded-lg',
        'icon-sm': 'h-8 w-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  /** Render as child element instead of <button> — merges button classes onto child */
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, asChild = false, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className)

    if (asChild && isValidElement(children)) {
      return (
        <Slot {...props} className={classes}>
          {children as ReactElement}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
        )}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
