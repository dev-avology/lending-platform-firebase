/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PlaidLinkComponent from './PlaidLinkComponent';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { apiClient } from '@/lib/apiClient';
import { firebaseService } from '@/lib/firebaseService';
import { useBankAccounts } from '@/contexts/BankAccountsContext';

// Define the response type from the backend
interface LinkTokenResponse {
  link_token: string;
}

interface ExchangeTokenResponse {
    access_token: string;
    item_id: string;
  }

  interface AccountResponse {
    accounts: any;
  }

const PlaidConnectButton: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { setAccounts } = useBankAccounts();

  useEffect(() => {
    // Fetch link token from your backend
    const fetchLinkToken = async () => {
      if (!user) return;

      try {
        const response = await fetch('https://createlinktokencent-wdlskx222a-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.uid, // Pass user_id in request body
                clientName:`Loan App`,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch link token');
          } 

        const data: LinkTokenResponse = await response.json();
        setLinkToken(data.link_token);

      } catch (error) {
        console.log('Failed to fetch link token:', error);
      }
    };

    fetchLinkToken();
  }, [user]);

  // Define the success handler
  const handleSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    const institutionName = metadata.institution?.name || 'Unknown Institution';
    
    console.log('Bank Linked:', institutionName);
    console.log('Bank Linked:', metadata);

    console.log('Public Token:', publicToken);

    if (!user) return;
    try {

        const response: ExchangeTokenResponse = await apiClient.post('https://exchangetokencent-wdlskx222a-uc.a.run.app', { publicToken:publicToken,clientUserId:user.uid});

        console.log('Exchange Data:',response);


        const response1: AccountResponse = await apiClient.post('/api/plaid/getAccountDetails', { accessToken:response.access_token,itemId:response.item_id,userId:user.uid});

        console.log('Exchange Data:',response1);

        if (response1.accounts.length) {
          // Prepare the bulk data for Firestore
          const accounts = response1.accounts;
          console.log('accounts',accounts);

          const bulkData = accounts.map((account: {account_id:string, persistent_account_id:string, name: string; mask: string; }) => ({
              id:account.account_id,
              persistent_id:account.persistent_account_id,
              name: account.name,
              bank_name:institutionName,
              mask: account.mask,
              access_token:response.access_token,
              item_id:response.item_id,
              status:true
          }));
          
          console.log(bulkData);

          await firebaseService.bulkCreate(`users/${user.uid}/banks`, bulkData,'persistent_id');

          setAccounts((prevAccounts) => [...prevAccounts, ...bulkData]);

      }

      } catch (error) {
        console.log('Failed to fetch exchange token:', error);
      }

  };

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to connect your bank.</div>;
  
  if (!linkToken) return <div>Loading...</div>;

  return <PlaidLinkComponent linkToken={linkToken} onSuccess={handleSuccess} />;
};

export default PlaidConnectButton;
