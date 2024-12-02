import React from 'react';
import { Connect } from '@stacks/connect-react';
import { TokenDashboard } from './components/TokenDashboard';
import { TransferForm } from './components/TransferForm';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'User Token',
          icon: '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
      }}
    >
      <div className="container mx-auto p-4">
        <TokenDashboard />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <TransferForm />
          <AdminPanel />
        </div>
      </div>
    </Connect>
  );
}

export default App;
