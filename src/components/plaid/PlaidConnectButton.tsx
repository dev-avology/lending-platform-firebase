import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PlaidLinkComponent from './PlaidLinkComponent';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

// Define the response type from the backend
interface LinkTokenResponse {
  link_token: string;
}

interface ExchangeTokenResponse {
    access_token: string;
    item_id: string;
  }

const PlaidConnectButton: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { user, loading } = useAuth();

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
    
    console.log('Public Token:', publicToken);

    if (!user) return;
    try {
        const response = await fetch('https://exchangetokencent-wdlskx222a-uc.a.run.app', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicToken: publicToken, // Pass user_id in request body
                clientUserId: user.uid,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch exchange token');
          } 

        const data: ExchangeTokenResponse = await response.json();

        console.log(data);

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
