import { Configuration, PlaidApi, PlaidEnvironments,CountryCode,Products, DepositoryAccountSubtype } from 'plaid';

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
 * @param linkItemToken - The link token from Plaid Link.
 * @returns The link token 
 */
export const linkItemToken = async (userid: string, clientName: string) => {
  try {

  // Get current date
  const currentDate = new Date();
  // Calculate start_date (first day of three months ago)
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
  const formattedStartDate = startDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  // Calculate end_date (last day of the previous month)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const formattedEndDate = endDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const redirectUri = "https://niche-capital.web.app/redirect.html";


    // Define configuration object
    const configs = {
      user: {
        client_user_id: userid,
      },
      client_name: clientName,
      products: [
        Products.Auth,
        Products.Assets,
        Products.Transactions,
      ],
      required_if_supported_products: [Products.Statements],
      statements: {
        start_date: formattedStartDate, // ISO-8601 format
        end_date: formattedEndDate,
      },
      redirect_uri: redirectUri,
      country_codes: [CountryCode.Us], // Use uppercase enum for CountryCode
      language: "en",
      account_filters: {
        depository: {
          account_subtypes: [
            DepositoryAccountSubtype.Checking,
            DepositoryAccountSubtype.Savings,
          ],
        },
      },
    };

    // Create link token
    const response = await plaidClient.linkTokenCreate(configs);

    // Return link token
    return { linkToken: response.data.link_token };
  } catch (error) {
    console.error('Error creating link token:', error);
    throw new Error('Failed to create link token');
  }
};



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

  

  export const getStatementList = async (accessToken: string) => {
    try{
      const response = await plaidClient.statementsList({access_token:accessToken});
      return { accounts: response.data.accounts};
    }catch(error){
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  }

  export { plaidClient };