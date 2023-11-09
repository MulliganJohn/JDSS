  export const addToAccounts = (accountDTO) => {
    return {
      type: 'ADD_TO_ACCOUNTS',
      payload: accountDTO
    };
  };
  
  export const removeFromAccounts = (accountID) => {
    return {
      type: 'REMOVE_FROM_ACCOUNTS',
      payload: accountID
    };
  };