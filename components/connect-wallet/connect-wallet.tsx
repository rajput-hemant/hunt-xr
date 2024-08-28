/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from "react";

import { showConnect } from "@stacks/connect";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { SubHeading } from "~/components/ui/subheading";
import { Trans } from "~/components/ui/trans";
import { userSession } from "~/hooks/user-session";

export const ConnectWallet: React.FC<{
  onWalletConnect: (connected: boolean) => void;
}> = ({ onWalletConnect }) => {
  const [isLinked, setIsLinked] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    updateWalletStatus();
  }, []);

  const updateWalletStatus = () => {
    const isSignedIn = userSession.isUserSignedIn();
    setIsLinked(isSignedIn);
    onWalletConnect(isSignedIn);
    if (isSignedIn) {
      const userData = userSession.loadUserData();
      setWalletAddress(userData.profile.stxAddress.testnet);
    }
  };

  const handleConnect = () => {
    const myAppName = "Hunt XR";
    const myAppIcon = window.location.origin + "/logo.png";

    showConnect({
      userSession,
      appDetails: {
        name: myAppName,
        icon: myAppIcon,
      },
      onFinish: () => {
        updateWalletStatus();
      },
      onCancel: () => {
        console.log("Wallet connection cancelled");
      },
    });
  };

  return (
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
  );
};
