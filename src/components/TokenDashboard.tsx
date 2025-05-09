import React, { useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { useUserToken } from '../hooks/useUserToken';
import { TokenInfo } from '../types/token.types';

export function TokenDashboard() {
  const { userSession } = useConnect();
  const { getTokenInfo, claimTokens, loading, error } = useUserToken();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.mainnet;
      getTokenInfo(userAddress).then(setTokenInfo);
    }
  }, [userSession, getTokenInfo]);

  if (!userSession.isUserSignedIn()) {
    return <div>Please connect your wallet</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tokenInfo) return <div>No token info available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tokenInfo.name} Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Token Info</h2>
          <p>Symbol: {tokenInfo.symbol}</p>
          <p>Decimals: {tokenInfo.decimals}</p>
          <p>Total Supply: {tokenInfo.totalSupply}</p>
          <p>Your Balance: {tokenInfo.balance}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Status</h2>
          <p>Blacklisted: {tokenInfo.isBlacklisted ? 'Yes' : 'No'}</p>
          <p>Contract Paused: {tokenInfo.isPaused ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={claimTokens}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Claim Tokens
        </button>
      </div>
    </div>
  );
}
