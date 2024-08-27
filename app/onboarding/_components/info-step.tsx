"use client";

import React from "react";

import type { FormEvent } from "react";

import type { AuthUser } from "~/lib/auth";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { TextField } from "~/components/ui/textfield";
import { Trans } from "~/components/ui/trans";

export type InfoStepData = Partial<AuthUser>;

export const InfoStep: React.FCC<{
  onSubmit: (data: InfoStepData) => void;
}> = ({ onSubmit }) => {
  const handleFormSubmit = React.useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const phoneNumber = data.get("phoneNumber") as string;

      onSubmit({
        name,
        email,
        phoneNumber,
      });
    },
    [onSubmit],
  );

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex w-full flex-1 flex-col space-y-12"
    >
      <div className="flex flex-col space-y-2">
        <Heading type={1}>
          <Trans i18nKey="onboarding:setupAccount.title" />
        </Heading>

        <SubHeading className="text-base">
          <Trans i18nKey="onboarding:setupAccount.description" />
        </SubHeading>
      </div>

      <div className="flex flex-1 flex-col space-y-2">
        <TextField>
          <TextField.Label>
            Enter your name
            <TextField.Input
              required
              name="name"
              autoComplete="name"
              placeholder="John Doe"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            Enter your email
            <TextField.Input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="john@acme.corp"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            Enter your Phone Number
            <TextField.Input
              required
              type="tel"
              name="phoneNumber"
              autoComplete="tel"
              placeholder="+1 123 456 7890"
            />
          </TextField.Label>
        </TextField>
      </div>

      <Button type="submit">
        <Trans i18nKey="common:continue" />
      </Button>
    </form>
  );
};
