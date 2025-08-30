import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { NodeID, UIState } from '../../types';

const initialState: UIState = {
  expanded: {},
  selection: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<NodeID | null>) => {
      state.selection = action.payload;
    },
  },
});

export const { setSelection } = uiSlice.actions;
export default uiSlice.reducer;
