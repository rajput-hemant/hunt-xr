import React, { useCallback, useEffect, useState } from "react";

import { showConnect } from "@stacks/connect";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { Trans } from "~/components/ui/trans";
import { siteConfig } from "~/config/site";
import { userSession } from "~/lib/user-session";

import { StxConnect } from "../stx/stx-connect";

export const ConnectWallet: React.FC<{
  onWalletConnect: (connected: boolean) => void;
}> = ({ onWalletConnect }) => {
  const [isLinked, setIsLinked] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    updateWalletStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateWalletStatus = useCallback(() => {
    const isSignedIn = userSession.isUserSignedIn();
    setIsLinked(isSignedIn);
    onWalletConnect(isSignedIn);
    if (isSignedIn) {
      const userData = userSession.loadUserData();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setWalletAddress(userData.profile.stxAddress.testnet as string);
    }
  }, [onWalletConnect]);

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: siteConfig.name,
        icon: siteConfig.url + "/logo.png",
      },
      onFinish: () => {
        updateWalletStatus();
      },
      onCancel: () => {
        console.log("Wallet connection cancelled");
      },
      userSession,
    });
  };

  return (
    <StxConnect>
      <div className="flex w-full flex-1 flex-col space-y-12">
        {isLinked ?
          <div className="flex flex-col space-y-2">
            <p>Hello: {walletAddress}</p>
            <p>Welcome to Hunt XR</p>
            <Button
              onClick={() => {
                userSession.signUserOut();
                updateWalletStatus();
              }}
            >
              Disconnect
            </Button>
          </div>
        : <>
            <div>
              <Heading type={1}>
                <Trans i18nKey="onboarding:connectWallet.title" />
              </Heading>

              <SubHeading className="text-base">
                <Trans i18nKey="onboarding:connectWallet.description" />
              </SubHeading>
            </div>
            <Button onClick={handleConnect}>
              <Trans i18nKey="onboarding:connectWallet.title" />
            </Button>
          </>
        }
      </div>
    </StxConnect>
  );
};
