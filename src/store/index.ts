import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import promptReducer from './promptSlice';
import promptActReducer from './promptActSlice';
import optimizeTaskReducer from './optimizeTaskSlice';
import dailySummaryReducer from './dailySummarySlice';
import updateTaskStatusReducer from './updateTaskStatusSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    prompt: promptReducer,
    promptAct: promptActReducer,
    optimizeTask: optimizeTaskReducer,
    dailySummary: dailySummaryReducer,
    updateTaskStatus: updateTaskStatusReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
