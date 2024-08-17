"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { Fingerprint } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { signIn as passKeySignIn } from "next-auth/webauthn";
import { toast } from "sonner";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const OAuthLogin: React.FC<{
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ disabled, setDisabled }) => {
  const [oauthLoading, setOauthLoading] = React.useState<"google">();

  const { status } = useSession();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  function signInToaster(promise: Promise<unknown>) {
    toast.promise(promise, {
      loading: "Signing in...",
      success: "You have been signed in.",
      error: "Something went wrong.",
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
        Sign in with Google
      </Button>

      {status === "authenticated" ?
        <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => passKeySignIn("passkey", { action: "register" })}
        >
          <Fingerprint className="mr-2 size-5" /> Register new Passkey
        </Button>
      : status === "unauthenticated" ?
        <Button
          block
          disabled={disabled}
          variant="outline"
          onClick={() => passKeySignIn("passkey")}
        >
          <Fingerprint className="mr-2 size-4" /> Sign in with Passkey
        </Button>
      : <Button block loading variant="outline">
          Checking Passkey status
        </Button>
      }
    </>
  );
};
