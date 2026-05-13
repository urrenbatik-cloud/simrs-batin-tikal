import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

type LinkProps = React.ComponentProps<typeof Link>

interface LinkButtonProps
  extends Omit<LinkProps, "className">,
    VariantProps<typeof buttonVariants> {
  className?: string
}

/**
 * Link styled as a Button. Replaces the `<Button asChild>` pattern (Radix)
 * since shadcn v3 + base-ui uses the `render` prop instead of asChild.
 */
export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
