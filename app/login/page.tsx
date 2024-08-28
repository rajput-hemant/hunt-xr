import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import type { Metadata } from "next";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Trans } from "~/components/ui/trans";
import { siteConfig } from "~/config/site";
import { auth } from "~/lib/auth";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

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
          <Trans i18nKey="common:goBack" />
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
            <Trans
              i18nKey="auth:authHeading"
              values={{ appName: siteConfig.name }}
              components={{ span: <span className="font-bold" /> }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            <Trans i18nKey="auth:authSubheading" />
          </p>
        </div>

        <React.Suspense>
          <LoginForm />
        </React.Suspense>

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Trans
            i18nKey="auth:authAgreement"
            components={{
              br: <br />,
              terms: (
                <Link
                  href="/terms"
                  className="hover:text-brand underline underline-offset-4"
                />
              ),
              privacy: (
                <Link
                  href="/privacy"
                  className="hover:text-brand underline underline-offset-4"
                />
              ),
            }}
          />
        </p>
      </div>
    </div>
  );
}
