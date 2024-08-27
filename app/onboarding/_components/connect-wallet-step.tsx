import React from "react";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { Trans } from "~/components/ui/trans";

export const ConnectWalletStep: React.FCC<{
  onSubmit: EmptyCallback;
}> = ({ onSubmit }) => {
  const [isLinked, setIsLinked] = React.useState(false);

  return (
    <div className="flex w-full flex-1 flex-col space-y-12">
      <div className="flex flex-col space-y-2">
        <Heading type={1}>
          <Trans i18nKey="onboarding:connectWallet.title" />
        </Heading>

        <SubHeading className="text-base">
          <Trans i18nKey="onboarding:connectWallet.description" />
        </SubHeading>
      </div>

      <Button onClick={() => setIsLinked(true)}>
        <Trans i18nKey="onboarding:connectWallet.title" />
      </Button>

      <Button disabled={!isLinked} onClick={onSubmit}>
        <Trans i18nKey="common:continue" />
      </Button>
    </div>
  );
};
