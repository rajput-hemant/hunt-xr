"use client";

import { forwardRef } from "react";
import Link from "next/link";

import type { VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

import { buttonVariants } from "./button-variants";
import If from "./if";
import Spinner from "./spinner";

type Size = "default" | "sm" | "lg" | "custom";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  block?: boolean;
  round?: boolean;
  loading?: boolean;
  href?: Maybe<string>;
}

const defaultSize: Size = `default`;
const defaultVariant = `default`;

const Button: React.FCC<ButtonProps> = forwardRef<
  React.ElementRef<"button">,
  ButtonProps
>(function ButtonComponent(
  { children, size, variant, block, loading, href, round, ...props },
  ref,
) {
  const className = cn(
    buttonVariants({
      variant: variant ?? defaultVariant,
      size: size ?? defaultSize,
    }),
    block ? `w-full` : ``,
    loading ? `opacity-80` : ``,
    round ? "rounded-full" : "",
    props.className,
  );

  return (
    <button
      {...props}
      tabIndex={href ? -1 : 0}
      ref={ref}
      className={className}
      disabled={loading ?? props.disabled}
    >
      <InnerButtonContainerElement href={href} disabled={props.disabled}>
        <span className={cn(`flex w-full flex-1 items-center justify-center`)}>
          <If condition={loading}>
            <Animation />
          </If>

          {children}
        </span>
      </InnerButtonContainerElement>
    </button>
  );
});

function Animation() {
  return (
    <span className={"mx-2"}>
      <Spinner className={"mx-auto !h-4 !w-4 fill-white dark:fill-white"} />
    </span>
  );
}

function InnerButtonContainerElement({
  children,
  href,
  disabled,
}: React.PropsWithChildren<{
  href: Maybe<string>;
  disabled?: boolean;
}>) {
  const className = `flex w-full h-full items-center transition-transform duration-500 ease-out`;

  if (href && !disabled) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}

export default Button;

export { Button };