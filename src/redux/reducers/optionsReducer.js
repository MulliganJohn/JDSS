const initialState = {
    timeoffset: {start: -500, stop: 500},
    importing: false,
    accountTxtPath: '',
  };
  
const optionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_OPTIONS':
      // Update the single object with the payload

      return {
        ...state,
        timeoffset: action.payload.timeoffset,
        importing: action.payload.importing,
        accountTxtPath: action.payload.accountTxtPath
      };
    default:
      return state;
  }
};

export default optionsReducer;