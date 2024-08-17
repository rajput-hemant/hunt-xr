"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";

import Button from "../ui/button";

export function LogOutButton() {
  function logout() {
    toast.promise(
      signOut({
        callbackUrl: "/login",
        redirect: false,
      }),
      {
        loading: "Logging out...",
        success: "Logged out.",
        error: "Failed to log out.",
      },
    );
  }

  return (
    <Button round size="lg" onClick={logout}>
      Log Out
    </Button>
  );
}
