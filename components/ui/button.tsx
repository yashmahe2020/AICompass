import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-black dark:focus-visible:ring-yellow-400",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-black hover:bg-yellow-500 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-500",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-900 dark:text-white dark:hover:bg-red-900/90",
        outline:
          "border border-yellow-400 bg-transparent text-yellow-400 hover:bg-yellow-400/10 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400/10",
        secondary:
          "bg-gray-800 text-white hover:bg-gray-800/80 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-800 hover:text-yellow-400 dark:hover:bg-gray-800 dark:hover:text-yellow-400",
        link: "text-yellow-400 underline-offset-4 hover:underline dark:text-yellow-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
