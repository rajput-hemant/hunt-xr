import React, { useState } from 'react';
import { useUserToken } from '../hooks/useUserToken';

export function TransferForm() {
  const { transfer, loading, error } = useUserToken();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    try {
      await transfer(recipient, parseInt(amount));
      setRecipient('');
      setAmount('');
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Transfer Tokens</h2>

      <div className="mb-4">
        <label className="block mb-2">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ST..."
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !recipient || !amount}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Transfer'}
      </button>
    </form>
  );
}
