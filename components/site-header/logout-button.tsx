"use client";

import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Trans } from "../ui/trans";

export function LogOutButton() {
  const { t } = useTranslation();

  function logout() {
    toast.promise(
      signOut({
        callbackUrl: "/login",
      }),
      {
        loading: t("auth:signingOut"),
        success: t("auth:signedOut"),
        error: t("auth:signOutError"),
      },
    );
  }

  return (
    <Button round size="lg" onClick={logout}>
      <Trans i18nKey="auth:signOut" />
    </Button>
  );
}
