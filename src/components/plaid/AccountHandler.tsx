import { useBankAccounts } from "@/contexts/BankAccountsContext";
import PlaidConnectButton from "./PlaidConnectButton";

const AccountsHandler: React.FC = () => {
    const { accounts, loading: accountLoading } = useBankAccounts();
  
    if (accountLoading) {
      return <div>Loading accounts...</div>; // Replace with your loading spinner or placeholder
    }
  
    return accounts.length === 0 ? (
      <PlaidConnectButton autoOpen={true} isVisible={false} />
    ) : (
      <></> // You can render other content here if needed
    );
  };
  
  export default AccountsHandler;