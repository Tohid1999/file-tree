import { loadState, saveState } from '@/lib/localStorage';
import { throttle } from '@/lib/throttle';
import { configureStore } from '@reduxjs/toolkit';

import fsReducer from './fsSlice';
import uiReducer from './uiSlice';

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    fs: fsReducer,
    ui: uiReducer,
  },
  preloadedState: persistedState ? { fs: persistedState } : undefined,
});

store.subscribe(
  throttle(() => {
    saveState(store.getState().fs);
  }, 250)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
