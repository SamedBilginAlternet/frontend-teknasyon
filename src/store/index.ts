import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import promptReducer from './promptSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    prompts: promptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
