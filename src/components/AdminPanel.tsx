import React, { useState } from 'react';
import { useUserToken } from '../hooks/useUserToken';

export function AdminPanel() {
  const { loading, error, blacklistAddress, setPaused, setMaxSupply } = useUserToken();
  const [address, setAddress] = useState('');
  const [maxSupply, setMaxSupplyValue] = useState('');

  const handleBlacklist = async (blacklist: boolean) => {
    if (!address) return;
    await blacklistAddress(address, blacklist);
    setAddress('');
  };

  const handleSetMaxSupply = async () => {
    if (!maxSupply) return;
    await setMaxSupply(parseInt(maxSupply));
    setMaxSupplyValue('');
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Blacklist Management</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Address to blacklist/unblacklist"
          />
          <button
            onClick={() => handleBlacklist(true)}
            disabled={loading || !address}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Blacklist
          </button>
          <button
            onClick={() => handleBlacklist(false)}
            disabled={loading || !address}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Unblacklist
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Contract Controls</h3>
        <button
          onClick={() => setPaused(true)}
          disabled={loading}
          className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Pause Contract
        </button>
        <button
          onClick={() => setPaused(false)}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Unpause Contract
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
