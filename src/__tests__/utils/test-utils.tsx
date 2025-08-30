import { Provider } from 'react-redux';

import App from '@/App';
import { loadState } from '@/lib/localStorage';
import fsReducer from '@/store/features/fs';
import uiReducer from '@/store/features/ui';
import { persistenceMiddleware } from '@/store/middleware/persistence';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';

export const renderApp = () => {
  const preloadedState = loadState();

  const store = configureStore({
    reducer: {
      fs: fsReducer,
      ui: uiReducer,
    },
    preloadedState: preloadedState ? { fs: preloadedState } : undefined,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
  });

  const renderResult = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  return { store, ...renderResult };
};
