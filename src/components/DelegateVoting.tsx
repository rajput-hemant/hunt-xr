import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { 
  callReadOnlyFunction, 
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  boolCV
} from '@stacks/transactions';
import { userSession } from '../auth';

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'delegate-vote';

interface Proposal {
  title: string;
  description: string;
  creator: string;
  expiresAt: number;
  yesVotes: number;
  noVotes: number;
  status: string;
}

export const DelegateVoting: React.FC = () => {
  const { doContractCall } = useConnect();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    duration: '144'
  });
  const [delegateAddress, setDelegateAddress] = useState('');

  const fetchProposals = async () => {
    try {
      const count = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'proposal-count',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS,
      });

      const proposalPromises = Array.from({ length: count.value }, (_, i) =>
        callReadOnlyFunction({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CONTRACT_NAME,
          functionName: 'get-proposal',
          functionArgs: [uintCV(i)],
          senderAddress: CONTRACT_ADDRESS,
        })
      );

      const proposalResults = await Promise.all(proposalPromises);
      setProposals(proposalResults.map(p => p.value));
    } catch (e) {
      console.error('Error fetching proposals:', e);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleCreateProposal = async () => {
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-proposal',
      functionArgs: [
        stringAsciiCV(newProposal.title),
        stringAsciiCV(newProposal.description),
        uintCV(parseInt(newProposal.duration))
      ],
      onFinish: (data) => {
        console.log('Proposal created:', data);
        fetchProposals();
        setNewProposal({ title: '', description: '', duration: '144' });
      },
      onCancel: () => {
        console.log('Proposal creation cancelled');
      }
    });
  };

  const handleVote = async (proposalId: number, vote: boolean) => {
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'vote',
      functionArgs: [uintCV(proposalId), boolCV(vote)],
      onFinish: (data) => {
        console.log('Vote cast:', data);
        fetchProposals();
      },
      onCancel: () => {
        console.log('Vote cancelled');
      }
    });
  };

  const handleDelegate = async () => {
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'delegate-to',
      functionArgs: [standardPrincipalCV(delegateAddress)],
      onFinish: (data) => {
        console.log('Delegation successful:', data);
        setDelegateAddress('');
      },
      onCancel: () => {
        console.log('Delegation cancelled');
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Decentralized Voting System</h1>

      {/* Create Proposal Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Proposal</h2>
        <input
          type="text"
          placeholder="Proposal Title"
          value={newProposal.title}
          onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Proposal Description"
          value={newProposal.description}
          onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="number"
          placeholder="Duration (in blocks)"
          value={newProposal.duration}
          onChange={(e) => setNewProposal({...newProposal, duration: e.target.value})}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleCreateProposal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Proposal
        </button>
      </div>

      {/* Delegate Voting Power */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Delegate Your Vote</h2>
        <input
          type="text"
          placeholder="Delegate Address"
          value={delegateAddress}
          onChange={(e) => setDelegateAddress(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleDelegate}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Delegate
        </button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Active Proposals</h2>
        {proposals.map((proposal, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{proposal.title}</h3>
            <p className="text-gray-600 mb-4">{proposal.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="mr-4">Yes: {proposal.yesVotes}</span>
                <span>No: {proposal.noVotes}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleVote(index, true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Vote Yes
                </button>
                <button
                  onClick={() => handleVote(index, false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Vote No
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 