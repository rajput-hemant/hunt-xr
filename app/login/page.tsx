import React from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import type { Metadata } from "next";

import Button from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { siteConfig } from "~/config/site";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-dvh w-full flex-col items-center justify-center">
      <Button
        href="/"
        size="sm"
        variant="outline"
        className="absolute left-4 top-4 md:left-8 md:top-8"
      >
        <span className="inline-flex items-center">
          <ChevronLeft className="mr-2 size-4" />
          Back
        </span>
      </Button>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="relative mx-auto size-16 overflow-hidden rounded-full border border-foreground drop-shadow-md">
            <Image
              src="/logo-sm.png"
              width={100}
              height={100}
              alt={`${siteConfig.name} logo`}
              className="scale-110"
            />

            <Skeleton className="-z-10 size-full" />
          </div>

          <div className="text-2xl font-semibold tracking-tight">
            <span>Welcome to</span>{" "}
            <span className="font-bold">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your details to sign in to your account
          </p>
        </div>

        <React.Suspense>
          <LoginForm />
        </React.Suspense>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our
          <br />
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
