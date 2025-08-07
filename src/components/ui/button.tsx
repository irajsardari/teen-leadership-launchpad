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
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-tma-coral text-white hover:bg-tma-coral/90 transform hover:scale-105 shadow-[var(--shadow-button)]",
        accent: "bg-tma-teal text-white hover:bg-tma-teal-light transform hover:scale-105",
        gold: "bg-tma-gold text-tma-navy hover:bg-tma-gold/90 shadow-[var(--shadow-gold)]",
        lemon: "bg-tma-lemon text-tma-navy hover:bg-tma-lemon/90",
        "outline-hero": "border-2 border-tma-blue text-tma-blue bg-transparent hover:bg-tma-blue hover:text-white",
        "modern-primary": "btn-modern-primary text-white font-bold",
        "modern-accent": "btn-modern-accent text-white font-bold",
        "glass": "glass-card backdrop-blur-lg border-white/30 text-white hover:bg-white/20",
        // High contrast CTA variants for better accessibility
        "cta": "bg-[hsl(var(--cta-blue))] text-white hover:bg-[hsl(var(--cta-blue-dark))] focus:bg-[hsl(var(--cta-blue-dark))] active:bg-[hsl(var(--cta-blue-dark))] disabled:bg-[hsl(var(--cta-blue))]/50 disabled:text-white/70 shadow-[var(--shadow-cta-blue)] hover:shadow-[var(--shadow-cta-blue-hover)] transform hover:scale-105 transition-all duration-200 font-semibold",
        "cta-teal": "bg-[hsl(var(--cta-teal))] text-white hover:bg-[hsl(var(--cta-teal-dark))] focus:bg-[hsl(var(--cta-teal-dark))] active:bg-[hsl(var(--cta-teal-dark))] disabled:bg-[hsl(var(--cta-teal))]/50 disabled:text-white/70 shadow-[var(--shadow-cta-teal)] hover:shadow-[var(--shadow-cta-teal-hover)] transform hover:scale-105 transition-all duration-200 font-semibold",
        "cta-outline": "border-2 border-[hsl(var(--cta-blue))] text-[hsl(var(--cta-blue))] bg-white hover:bg-[hsl(var(--cta-blue))] hover:text-white focus:bg-[hsl(var(--cta-blue))] focus:text-white active:bg-[hsl(var(--cta-blue-dark))] active:text-white disabled:border-[hsl(var(--cta-blue))]/50 disabled:text-[hsl(var(--cta-blue))]/50 shadow-[var(--shadow-cta-blue)] hover:shadow-[var(--shadow-cta-blue-hover)] transform hover:scale-105 transition-all duration-200 font-semibold",
        "continue": "bg-[hsl(var(--cta-success))] text-white hover:bg-[hsl(var(--cta-success-dark))] focus:bg-[hsl(var(--cta-success-dark))] active:bg-[hsl(var(--cta-success-dark))] disabled:bg-[hsl(var(--cta-success))]/50 disabled:text-white/70 shadow-[0_4px_15px_-3px_hsl(var(--cta-success)/0.4)] hover:shadow-[0_8px_25px_-5px_hsl(var(--cta-success)/0.5)] transform hover:scale-105 transition-all duration-200 font-semibold min-h-[44px]",
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