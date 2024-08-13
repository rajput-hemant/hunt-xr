"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import Button from "~/components/ui/button";

import { EmailLoginForm } from "./email-login-form";
import { OAuthLogin } from "./oauth-logins";
import { PhoneLoginForm } from "./phone-login-form";

enum AuthError {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  AlreadySignedIn = "AlreadySignedIn",
  Default = "Default",
}

const errorMap = {
  [AuthError.Configuration]:
    "There was a problem when trying to authenticate. Please contact us if this error persists.",
  [AuthError.AccessDenied]: "Access denied. Please try again.",
  [AuthError.Verification]: "Please verify your email address.",
  [AuthError.AlreadySignedIn]:
    "You are already signed in. Log out of all devices to sign in again.",
  [AuthError.Default]: "An error occurred while trying to authenticate.",
};

export function LoginForm() {
  const [isEmailMode, setIsEmailMode] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get("error") as AuthError | null;

  React.useEffect(() => {
    if (error) {
      toast.error("An error occurred while trying to authenticate.", {
        description: errorMap[error],
      });
    }
  }, [error]);

  return (
    <div className="grid gap-2">
      {isEmailMode ?
        <EmailLoginForm disabled={disabled} setDisabled={setDisabled} />
      : <PhoneLoginForm disabled={disabled} setDisabled={setDisabled} />}

      {isEmailMode ?
        <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => setIsEmailMode(false)}
        >
          <Phone className="mr-2 size-4" /> Use Phone Instead
        </Button>
      : <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => setIsEmailMode(true)}
        >
          <Mail className="mr-2 size-4" /> Use Email Instead
        </Button>
      }

      <div className="relative my-3">
        <span className="absolute inset-x-0 inset-y-1/2 border-t" />

        <span className="relative mx-auto flex w-fit bg-background px-2 text-xs uppercase text-muted-foreground transition-colors duration-0">
          Or continue with
        </span>
      </div>

      <OAuthLogin disabled={disabled} setDisabled={setDisabled} />
    </div>
  );
}
