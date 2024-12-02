/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PlaidLinkComponent from './PlaidLinkComponent';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { apiClient } from '@/lib/apiClient';
import { firebaseService } from '@/lib/firebaseService';
import { useBankAccounts } from '@/contexts/BankAccountsContext';
import { ConnectedBanks } from '@/types/user';

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

  interface PlaidConnectButtonProps {
    autoOpen?: boolean; // Optional prop to enable automatic opening
    isVisible?: boolean; // Optional prop to control button visibility
}

const PlaidConnectButton: React.FC<PlaidConnectButtonProps> = ({ autoOpen = false, isVisible = true,
}) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { setAccounts } = useBankAccounts();

  useEffect(() => {
    // Fetch link token from your backend
    const fetchLinkToken = async () => {

      try {
        if (!user) return;

        const data: LinkTokenResponse =  await apiClient.post('https://createlinktokencent-wdlskx222a-uc.a.run.app', {userId: user.uid,clientName:`Loan App`});
       // const data: LinkTokenResponse =  await apiClient.post('/api/plaid/createLinkToken', {userId: user.uid,clientName:`Loan Local App`});

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
    
    if (!user) return;
    try {

      const response: ExchangeTokenResponse = await apiClient.post('https://exchangetokencent-wdlskx222a-uc.a.run.app', { publicToken:publicToken,clientUserId:user.uid});
      //const response: ExchangeTokenResponse = await apiClient.post('/api/plaid/itemExchangeToken', { publicToken:publicToken});

        const response1: AccountResponse = await apiClient.post('/api/plaid/getAccountDetails', { accessToken:response.access_token,itemId:response.item_id,userId:user.uid});


        if (response1.accounts.length) {
          // Prepare the bulk data for Firestore
          const accounts = response1.accounts;

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
          
          await firebaseService.bulkCreate(`users/${user.uid}/banks`, bulkData,'persistent_id');

          const banks: ConnectedBanks[] = await firebaseService.getCollection(`users/${user.uid}/banks`);
          setAccounts(banks);

      }

      } catch (error) {
        console.log('Failed to fetch exchange token:', error);
      }

  };

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in to connect your bank.</div>;
  
  if (!linkToken) return <div>Loading...</div>;

  return <PlaidLinkComponent linkToken={linkToken} onSuccess={handleSuccess} autoOpen={autoOpen} isVisible={isVisible} />;
};

export default PlaidConnectButton;
