import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { NodeID } from '@store/types';

import type { UIState } from './types';

const initialState: UIState = {
  expanded: {},
  selection: null,
  renameEditingId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startRename: (state, action: PayloadAction<NodeID>) => {
      state.renameEditingId = action.payload;
    },
    stopRename: (state) => {
      state.renameEditingId = null;
    },
  },
});

export const { startRename, stopRename } = uiSlice.actions;
export default uiSlice.reducer;
