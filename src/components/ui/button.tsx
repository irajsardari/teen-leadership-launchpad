import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-tma-orange text-tma-white hover:bg-tma-orange/90 shadow-lg",
        secondary: "bg-tma-blue text-tma-white hover:bg-tma-blue/90 shadow-lg",
        hero: "bg-tma-orange text-tma-white hover:bg-tma-orange/90 shadow-xl",
        cta: "bg-tma-teal text-tma-white hover:bg-tma-teal/90 shadow-lg",
        "cta-teal": "bg-tma-teal text-tma-white hover:bg-tma-teal/90 shadow-lg",
        "cta-outline": "border-2 border-tma-teal text-tma-teal bg-tma-white hover:bg-tma-teal hover:text-tma-white",
        accent: "bg-tma-yellow text-tma-text hover:bg-tma-yellow/90",
        gold: "bg-tma-yellow text-tma-text hover:bg-tma-yellow/90 shadow-lg",
        continue: "bg-tma-teal text-tma-white hover:bg-tma-teal/90 shadow-lg min-h-[44px]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-tma-teal text-tma-teal bg-tma-white hover:bg-tma-teal hover:text-tma-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
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