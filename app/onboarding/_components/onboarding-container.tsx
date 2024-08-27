"use client";

import React from "react";

import { useForm } from "react-hook-form";

import type { Session } from "next-auth";

import type { AuthUser } from "~/lib/auth";

import { If } from "~/components/ui/if";
import { Stepper } from "~/components/ui/stepper";

import { CompleteOnboardingStep } from "./complete-onboarding-step";
import { ConnectWalletStep } from "./connect-wallet-step";
import { InfoStep } from "./info-step";

const STEPS: Array<string> = [
  "onboarding:info",
  "onboarding:wallet",
  "onboarding:complete",
];

export const OnboardingContainer: React.FC<{ session: Session }> = ({
  session,
}) => {
  const form = useForm<{
    data: Partial<AuthUser>;
    currentStep: number;
  }>({
    defaultValues: {
      data: session.user,
      currentStep: 0,
    },
  });

  const nextStep = React.useCallback(() => {
    form.setValue("currentStep", form.getValues("currentStep") + 1);
  }, [form]);

  const onInfoStepSubmitted = React.useCallback(
    (userInfo: Partial<AuthUser>) => {
      form.setValue("data", userInfo);
      nextStep();
    },
    [form, nextStep],
  );

  const onConnectWalletStepSubmitted = React.useCallback(() => {
    nextStep();
  }, [nextStep]);

  const currentStep = form.watch("currentStep");
  const formData = form.watch("data");

  const isStep = React.useCallback(
    (step: number) => currentStep === step,
    [currentStep],
  );

  return (
    <React.Fragment>
      <Stepper variant="default" currentStep={currentStep} steps={STEPS} />

      <If condition={isStep(0)}>
        <InfoStep onSubmit={onInfoStepSubmitted} />
      </If>

      <If condition={isStep(1)}>
        <ConnectWalletStep onSubmit={onConnectWalletStepSubmitted} />
      </If>

      <If condition={isStep(2)}>
        <CompleteOnboardingStep
          onSubmit={() => {
            // ...
          }}
        />
      </If>
    </React.Fragment>
  );
};
