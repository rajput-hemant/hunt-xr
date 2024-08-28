"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Trans } from "~/components/ui/trans";

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

export function LoginForm() {
  const { t } = useTranslation();

  const [isEmailMode, setIsEmailMode] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get("error") as AuthError | null;

  React.useEffect(() => {
    const errorMap = {
      [AuthError.Configuration]: t("auth:configurationError"),
      [AuthError.AccessDenied]: t("auth:accessDeniedError"),
      [AuthError.Verification]: t("auth:verificationError"),
      [AuthError.AlreadySignedIn]: t("auth:alreadySignedInError"),
      [AuthError.Default]: t("auth:defaultError"),
    };

    if (error) {
      toast.error(t("auth:error"), {
        description: errorMap[error],
      });
    }
  }, [error, t]);

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
          <Phone className="mr-2 size-4" /> <Trans i18nKey="auth:usePhone" />
        </Button>
      : <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => setIsEmailMode(true)}
        >
          <Mail className="mr-2 size-4" /> <Trans i18nKey="auth:useEmail" />
        </Button>
      }

      <div className="relative my-3">
        <span className="absolute inset-x-0 inset-y-1/2 border-t" />

        <span className="relative mx-auto flex w-fit bg-background px-2 text-xs uppercase text-muted-foreground transition-colors duration-0">
          <Trans i18nKey="auth:orContinueWith" />
        </span>
      </div>

      <OAuthLogin disabled={disabled} setDisabled={setDisabled} />
    </div>
  );
}
