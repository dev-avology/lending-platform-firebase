/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Building } from 'lucide-react';
import { firebaseService } from '@/lib/firebaseService';
import { useBankAccounts } from '@/contexts/BankAccountsContext';
import { ConnectedBanks } from '@/types/user';



const PlaidConnectAccount: React.FC = () => {
  const { user, loading } = useAuth();
  const { accounts, setAccounts } = useBankAccounts();

  const fetchAccounts = async () => {
    if (!user) return;

    try {
      const banks: ConnectedBanks[] = await firebaseService.getCollection(`users/${user.uid}/banks`);
      setAccounts(banks);
    } catch {
      console.log('Unable to fetch account');
    }
  }

  useEffect(() => {
    // Fetch link token from your backend

    fetchAccounts();
  }, [user]);


  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to connect your bank.</div>;

  return (
    <>
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
                {account.bank_name} ({account.name} ...{account.mask})
              </span>
            </div>
            {account.status ? <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect(account.id)} // Disconnect handler
            >
              Disconnect
            </Button> : <Button
              variant="outline"
              size="sm"
              onClick={() => handleConnect(account.id)} // Disconnect handler
            >
              Connect
            </Button>}

          </div>
        ))
      )
      }
    </>
  );

  async function handleDisconnect(id: string) {
    // TODO: Implement disconnect logic
    if (!user) return;

    await firebaseService.update(`users/${user.uid}/banks`,id,{status:false});
    fetchAccounts();

    console.log(`Disconnect account with ID: ${id}`);
  }


  async function handleConnect(id: string) {
    // TODO: Implement disconnect logic
    if (!user) return;

     await firebaseService.update(`users/${user.uid}/banks`,id,{status:true});
     fetchAccounts();

    console.log(`Connect account with ID: ${id}`);
  }
};

export default PlaidConnectAccount;
