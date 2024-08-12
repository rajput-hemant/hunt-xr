import { cva } from "class-variance-authority";

const large = `*:py-2.5 *:px-6 h-14 text-lg`;
const small = `*:py-2 *:px-3 text-xs`;

export const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:*:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outlinePrimary: `border-2 border-primary bg-background hover:border-primary/80`,
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        transparent: "hover:bg-accent hover:text-accent-foreground",
        flat: "bg-primary/5 text-primary hover:bg-primary/10",
        custom: "",
      },
      size: {
        default: `h-10 text-sm *:px-4 *:py-2`,
        sm: small,
        lg: large,
        icon: "size-10",
        custom: ``,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
