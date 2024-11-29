'use client';
import { ConnectedBanks } from '@/types/user';
import React, { createContext, useContext, useState, ReactNode } from 'react';



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
