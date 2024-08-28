"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Trans } from "~/components/ui/trans";
import { cn } from "~/lib/utils";

export const OAuthLogin: React.FC<{
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ disabled, setDisabled }) => {
  const [oauthLoading, setOauthLoading] = React.useState<"google">();

  const { t } = useTranslation();

  // const { status } = useSession();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  function signInToaster(promise: Promise<unknown>) {
    toast.promise(promise, {
      loading: t("auth:signingIn"),
      error: t("auth:signInError"),
      finally: () => {
        setOauthLoading(undefined);
        setDisabled(false);
      },
    });
  }

  async function googleSignInHandler() {
    setOauthLoading("google");
    setDisabled(true);

    try {
      signInToaster(
        signIn("google", {
          redirect: false,
          callbackUrl: from ?? "/",
        }),
      );
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
    }
  }

  return (
    <>
      <Button
        block
        disabled={disabled}
        loading={oauthLoading === "google"}
        onClick={googleSignInHandler}
        variant="outline"
      >
        <Icons.Google
          className={cn("mr-2 size-4", oauthLoading === "google" && "hidden")}
        />
        <Trans i18nKey="auth:google" />
      </Button>

      {/* {status === "authenticated" ?
        <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => passKeySignIn("passkey", { action: "register" })}
        >
          <Fingerprint className="mr-2 size-5" />{" "}
          <Trans i18nKey="auth:registerPasskey" />
        </Button>
      : status === "unauthenticated" ?
        <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => passKeySignIn("passkey")}
        >
          <Fingerprint className="mr-2 size-4" />{" "}
          <Trans i18nKey="auth:passkey" />
        </Button>
      : <Button block loading variant="outline">
          <Trans i18nKey="auth:passkeyIntermediate" />
        </Button>
      } */}
    </>
  );
};
