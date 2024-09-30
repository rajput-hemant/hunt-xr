import React, { useEffect, useState } from "react";

import { useConnect } from "@stacks/connect-react";
import { StacksTestnet } from "@stacks/network";
import {
  callReadOnlyFunction,
  contractPrincipalCV,
  uintCV,
} from "@stacks/transactions";

import type { IntCV } from "@stacks/transactions";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Trans } from "~/components/ui/trans";
import { userSession } from "~/lib/user-session";

const USER_TOKEN_CONTRACT =
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.user-token";

const contractAddress = USER_TOKEN_CONTRACT.split(".")[0]!;
const contractName = USER_TOKEN_CONTRACT.split(".")[1]!;

export function UserTokenManager() {
  const { doContractCall } = useConnect();

  const [balance, setBalance] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    void fetchBalance();
  }, []);

  const fetchBalance = async () => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const address = userData.profile.stxAddress.testnet as string;

      const network = new StacksTestnet();
      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-balance",
        functionArgs: [contractPrincipalCV(address, contractName)],
        network,
        senderAddress: address,
      });

      setBalance(Number((result as IntCV).value));
    }
  };

  const handleClaim = async () => {
    await doContractCall({
      contractAddress,
      contractName,
      functionName: "claim-tokens",
      functionArgs: [],
      onFinish: (data) => {
        console.log("Transaction finished:", data);
        void fetchBalance();
      },
      onCancel: () => {
        console.log("Transaction cancelled");
      },
    });
  };

  const handleTransfer = async () => {
    await doContractCall({
      contractAddress,
      contractName,
      functionName: "transfer",
      functionArgs: [
        uintCV(parseInt(amount)),
        contractPrincipalCV(recipient, contractName),
      ],
      onFinish: (data) => {
        console.log("Transaction finished:", data);
        void fetchBalance();
        setRecipient("");
        setAmount("");
      },
      onCancel: () => {
        console.log("Transaction cancelled");
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        <Trans i18nKey="userToken:title" />
      </h2>
      {balance !== null && (
        <p>
          <Trans i18nKey="userToken:balance" values={{ balance }} />
        </p>
      )}
      <Button onClick={handleClaim}>
        <Trans i18nKey="userToken:claim" />
      </Button>
      <div className="space-y-2">
        <Input
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleTransfer} disabled={!recipient || !amount}>
          <Trans i18nKey="userToken:transfer" />
        </Button>
      </div>
    </div>
  );
}
