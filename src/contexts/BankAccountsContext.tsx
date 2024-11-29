'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConnectedBanks {
  id: string;
  persistent_id: string;
  name: string;
  bank_name: string;
  mask: string;
  access_token: string;
  item_id: string;
  status: boolean;
}

interface BankAccountsContextProps {
  accounts: ConnectedBanks[];
  setAccounts: React.Dispatch<React.SetStateAction<ConnectedBanks[]>>;
}

const BankAccountsContext = createContext<BankAccountsContextProps | undefined>(undefined);

export const BankAccountsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<ConnectedBanks[]>([]);

  return (
    <BankAccountsContext.Provider value={{ accounts, setAccounts }}>
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
