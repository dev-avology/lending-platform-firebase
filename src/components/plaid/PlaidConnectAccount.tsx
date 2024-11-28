/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Building } from 'lucide-react';
import { firebaseService } from '@/lib/firebaseService';

interface ConnectedBanks {
  id: string;
  persistent_id: string;
  name: string;
  bank_name: string;
  mask: string;
  access_token: string;
  item_id: string;
}

const PlaidConnectAccount: React.FC = () => {
  const [accounts, setAccounts] = useState<ConnectedBanks[]>([]); // Initialized as an empty array
  const { user, loading } = useAuth();

  useEffect(() => {
    // Fetch link token from your backend
    const fetchAccounts = async () => {
      if (!user) return;

      try {

        const banks = await firebaseService.getCollection(`users/${user.uid}/banks`);
        setAccounts(banks);
        console.log(banks);
        console.log(accounts);
    }catch{}
    }
    fetchAccounts();
}, [user]);


  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to connect your bank.</div>;

  return (
    <div>
      {accounts.length === 0 ? (
        <div>No connected bank accounts found.</div>
      ) : (
        accounts.map((account) => (
          <div
            key={account.id} // Added a unique key for each item
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>
                {account.bank_name} ({account.name} • ...{account.mask})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect(account.id)} // Disconnect handler
            >
              Disconnect
            </Button>
          </div>
        ))
      )}
    </div>
  );

  function handleDisconnect(id: string) {
    // TODO: Implement disconnect logic
    console.log(`Disconnect account with ID: ${id}`);
  }
};

export default PlaidConnectAccount;
