import { loadState } from '@/lib/localStorage';
import { configureStore } from '@reduxjs/toolkit';

import fsReducer from './fsSlice';
import { persistenceMiddleware } from './persistenceMiddleware';
import uiReducer from './uiSlice';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    fs: fsReducer,
    ui: uiReducer,
  },
  preloadedState: persistedState ? { fs: persistedState } : undefined,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
