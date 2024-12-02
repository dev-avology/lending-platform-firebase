'use client';
import { ConnectedBanks } from '@/types/user';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { firebaseService } from '@/lib/firebaseService';



interface BankAccountsContextProps {
  accounts: ConnectedBanks[];
  loading:boolean,
  setAccounts: React.Dispatch<React.SetStateAction<ConnectedBanks[]>>;
}

const BankAccountsContext = createContext<BankAccountsContextProps | undefined>(undefined);

export const BankAccountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [accounts, setAccounts] = useState<ConnectedBanks[]>([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAccountData = async () => {
      if (!user) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      try {
        const banks: ConnectedBanks[] = await firebaseService.getCollection(`users/${user.uid}/banks`);
        setAccounts(banks);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchAccountData();
  }, [user, authLoading]);

  return (
    <BankAccountsContext.Provider value={{ accounts,loading, setAccounts }}>
      {children}
    </BankAccountsContext.Provider>
  );
};

export const useBankAccounts = () => {
  const context = useContext(BankAccountsContext);
  if (!context) {
    throw new Error('useBankAccounts must be used within a BankAccountsProvider');
  }
  return context;
};
