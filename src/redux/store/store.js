import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from '../reducers/accountsReducer';
import tasksReducer from '../reducers/tasksReducer';
import optionsReducer from '../reducers/optionsReducer';

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    tasks: tasksReducer,
    options: optionsReducer
  },
});

export default store;