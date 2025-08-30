import { saveState } from '@/lib/localStorage';
import type { Middleware } from '@reduxjs/toolkit';

import type { FSState } from './types';

const actionsToPersist = [
  'fs/addFolder',
  'fs/addFile',
  'fs/renameNode',
  'fs/renameFile',
  'fs/deleteFile',
  'fs/deleteFolder',
];

// Define a minimal state type for the middleware to avoid circular dependencies
interface PersistableState {
  fs: FSState;
}

export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Type guard to ensure action is a plain object with a string type
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    typeof action.type === 'string'
  ) {
    if (actionsToPersist.includes(action.type)) {
      const state = store.getState() as PersistableState;
      saveState(state.fs);
    }
  }

  return result;
};
