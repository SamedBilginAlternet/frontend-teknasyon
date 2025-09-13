import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import promptReducer from './promptSlice';
import promptActReducer from './promptActSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    prompts: promptReducer,
      promptAct: promptActReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
