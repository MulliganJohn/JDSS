const initialState = []; // Initial state for accounts array

const accountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_ACCOUNTS':
      return [...state, action.payload]; // Add an item to accounts array
    case 'REMOVE_FROM_ACCOUNTS':
      return state.filter(account => account.accountID !== action.payload); // Remove an item from accounts array
    default:
      return state;
  }
};

export default accountsReducer;