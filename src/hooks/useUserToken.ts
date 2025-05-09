import { useCallback, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import {
  callReadOnlyFunction,
  contractPrincipalCV,
  uintCV,
  standardPrincipalCV,
  trueCV,
  falseCV,
  PostConditionMode,
} from '@stacks/transactions';
import { TokenInfo, AllowanceInfo } from '../types/token.types';

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'user-token';

export function useUserToken() {
  const { doContractCall } = useConnect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTokenInfo = useCallback(async (userAddress: string): Promise<TokenInfo> => {
    try {
      const [name, symbol, decimals, totalSupply, balance, isBlacklisted] = await Promise.all([
        callReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-name',
          senderAddress: userAddress,
        }),
        // Repeat for other token info functions...
      ]);

      return {
        name: name.value.value,
        symbol: symbol.value.value,
        decimals: decimals.value.value,
        totalSupply: totalSupply.value.value,
        balance: balance.value.value,
        isBlacklisted: isBlacklisted.value.value,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const claimTokens = useCallback(async () => {
    setLoading(true);
    try {
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'claim-tokens',
        functionArgs: [],
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Claim successful:', data);
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [doContractCall]);

  const transfer = useCallback(async (recipient: string, amount: number) => {
    setLoading(true);
    try {
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'transfer',
        functionArgs: [
          uintCV(amount),
          standardPrincipalCV(recipient),
        ],
        postConditionMode: PostConditionMode.Deny,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [doContractCall]);

  // Add other contract interactions...

  return {
    loading,
    error,
    getTokenInfo,
    claimTokens,
    transfer,
  };
}
