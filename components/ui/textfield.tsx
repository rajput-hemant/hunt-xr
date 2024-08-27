"use client";

import React from "react";

import { cn } from "~/lib/utils";

type Props = React.InputHTMLAttributes<unknown>;

const Hint: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <span
      className={`block pl-1 text-xs font-normal leading-tight text-gray-500 dark:text-gray-400`}
    >
      {children}
    </span>
  );
};

const Input = React.forwardRef<React.ElementRef<"input">, Props>(
  function TextFieldInputComponent({ className, children, ...props }, ref) {
    return (
      <input
        {...props}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
      />
    );
  },
);

type LabelProps = React.LabelHTMLAttributes<unknown> & {
  as?: string;
};

const Label: React.FCC<LabelProps> = ({
  children,
  className,
  as,
  ...props
}) => {
  const tag = as ?? `label`;

  return React.createElement(
    tag,
    {
      className: cn(
        `w-full text-sm font-medium text-gray-500 dark:text-gray-400 [&>*]:mt-[0.35rem]`,
        className,
      ),
      ...props,
    },
    children,
  );
};

type TextFieldComponent = React.FC<
  React.PropsWithChildren<{
    className?: string;
  }>
> & {
  Label: typeof Label;
  Hint: typeof Hint;
  Input: typeof Input;
  Error: typeof ErrorMessage;
};

const TextField: TextFieldComponent = ({ children, className }) => {
  return (
    <div className={cn(`flex flex-col space-y-1`, className)}>{children}</div>
  );
};

const ErrorMessage: React.FC<
  { error: Maybe<string> } & React.HTMLAttributes<unknown>
> = ({ error, ...props }) => {
  const shouldDisplay = !!error;

  if (!shouldDisplay) {
    return null;
  }

  return (
    <Hint>
      <span {...props} className="py-0.5 text-red-700 dark:text-red-500">
        {error}
      </span>
    </Hint>
  );
};

TextField.Hint = Hint;
TextField.Label = Label;
TextField.Input = Input;
TextField.Error = ErrorMessage;

export {
  TextField,
  Hint as TextFieldHint,
  Label as TextFieldLabel,
  Input as TextFieldInput,
  ErrorMessage as TextFieldError,
};
