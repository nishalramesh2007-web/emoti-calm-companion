import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_hsl(260_55%_65%_/_0.1)] hover:shadow-[0_8px_30px_hsl(260_55%_65%_/_0.08)] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_4px_20px_hsl(260_55%_65%_/_0.1)]",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        calm: "bg-[hsl(260_60%_92%)] text-[hsl(260_55%_65%)] border border-[hsl(260_55%_65%_/_0.2)] hover:bg-[hsl(260_55%_65%)] hover:text-[hsl(0_0%_100%)] shadow-[0_4px_20px_hsl(260_55%_65%_/_0.1)]",
        emotion: "bg-card border-2 border-border hover:border-primary/40 hover:shadow-[0_8px_30px_hsl(260_55%_65%_/_0.08)] active:scale-[0.97] transition-all duration-300",
        hero: "bg-gradient-to-r from-[hsl(260_55%_65%)] to-[hsl(200_50%_75%)] text-[hsl(0_0%_100%)] shadow-[0_0_40px_hsl(260_55%_65%_/_0.2)] hover:shadow-[0_8px_30px_hsl(260_55%_65%_/_0.08)] hover:opacity-95 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-14 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
