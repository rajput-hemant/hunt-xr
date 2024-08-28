"use client";

import React from "react";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { AuthUser } from "~/lib/auth";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Spinner } from "~/components/ui/spinner";
import { Trans } from "~/components/ui/trans";
import { updateUser } from "~/lib/actions/user";

export const CompleteOnboardingStep: React.FC<{ data: Partial<AuthUser> }> = ({
  data,
}) => {
  const { t } = useTranslation();

  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!submitted) {
      toast.promise(updateUser(data), {
        loading: t("onboarding:settingAccount"),
        success: t("onboarding:successStepHeading"),
        error: t("onboarding:errorSettingAccount "),
        finally: () => setSubmitted(true),
      });
    }
  }, [submitted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (submitted) {
    return <SuccessState returnUrl="/onboarding/create-token" />;
  }

  return (
    <div className="flex flex-1 flex-col items-center space-y-8 duration-1000 ease-out animate-in fade-in zoom-in-90 slide-in-from-bottom-8">
      <span>
        <Spinner className="size-12" />
      </span>

      <span>
        <Trans i18nKey="onboarding:settingAccount" />
      </span>
    </div>
  );
};

function SuccessState({ returnUrl }: { returnUrl: string }) {
  return (
    <section className="mx-auto rounded-xl bg-background duration-1000 ease-out animate-in fade-in zoom-in-95 slide-in-from-bottom-16 lg:p-16">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <CheckIcon className="size-16 rounded-full bg-green-500 p-4 text-white ring-8 ring-green-500/30 dark:ring-green-500/50" />

        <Heading type={3}>
          <span className="mr-4 font-semibold">
            <Trans i18nKey="onboarding:successStepHeading" />
          </span>
          🎉
        </Heading>

        <Button href={returnUrl} variant="outline">
          <span className="flex items-center space-x-2.5">
            <span>
              <Trans i18nKey="onboarding:continue" />
            </span>

            <ChevronRightIcon className="h-4" />
          </span>
        </Button>
      </div>
    </section>
  );
}
