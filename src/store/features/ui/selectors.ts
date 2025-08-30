import type { RootState } from '../../index';

export const selectSelection = (state: RootState) => state.ui.selection;
