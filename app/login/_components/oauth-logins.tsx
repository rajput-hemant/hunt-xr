"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

export const OAuthLogin: React.FC<{
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ disabled, setDisabled }) => {
  const [oauthLoading, setOauthLoading] = React.useState<"google">();

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
    <Button
      disabled={disabled}
      loading={oauthLoading === "google"}
      onClick={googleSignInHandler}
      variant="outline"
      className="w-full"
    >
      <Icons.Google className="mr-2 size-4" /> Sign in with Google
    </Button>
  );
};
