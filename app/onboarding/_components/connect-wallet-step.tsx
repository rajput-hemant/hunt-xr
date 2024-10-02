import React, { useState } from "react";

import { ConnectWallet } from "~/components/connect-wallet/connect-wallet";
import { Button } from "~/components/ui/button";
import { Trans } from "~/components/ui/trans";

export const ConnectWalletStep: React.FCC<{
  onSubmit: EmptyCallback;
}> = ({ onSubmit }) => {
  const [isLinked, setIsLinked] = useState(false);

  return (
    <div className="flex w-full flex-1 flex-col space-y-12">
      <ConnectWallet onWalletConnect={setIsLinked} />

      <Button disabled={!isLinked} onClick={onSubmit}>
        <Trans i18nKey="common:continue" />
      </Button>
    </div>
  );
};
