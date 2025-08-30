import { loadState } from '@lib/localStorage';
import { configureStore } from '@reduxjs/toolkit';

import fsReducer from './features/fs';
import uiReducer from './features/ui';
import { persistenceMiddleware } from './middleware/persistence';

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
