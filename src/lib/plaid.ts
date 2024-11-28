import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_CLIENT_SECRET,
        'Plaid-Version': "2020-09-14",
      },
    },
  });

 const plaidClient = new PlaidApi(configuration);


/**
 * Exchanges a public token for an access token.
 * @param publicToken - The public token from Plaid Link.
 * @returns The access token and item id.
 */
export const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await plaidClient.itemPublicTokenExchange({public_token: publicToken });
      return { accessToken: response.data.access_token, itemId: response.data.item_id };
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  };
  
  /**
   * Retrieves accounts associated with an access token.
   * @param accessToken - The access token from Plaid.
   * @returns List of accounts.
   */
  export const getAccounts = async (accessToken: string) => {
    try {
      const response = await plaidClient.accountsGet({ access_token: accessToken });
      return response.data.accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  };


  export { plaidClient };