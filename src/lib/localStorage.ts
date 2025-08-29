import type { FSState } from '@store/types';

export const storageKey = 'fsTree:v1';

export const loadState = (): FSState | undefined => {
  try {
    const serializedState = localStorage.getItem(storageKey);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as FSState;
  } catch (err) {
    console.error('Could not load state from localStorage', err);
    return undefined;
  }
};

export const saveState = (state: FSState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(storageKey, serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage', err);
  }
};
