import { configureStore } from '@reduxjs/toolkit';
import fsReducer from './fsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    fs: fsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
