import { createSlice } from '@reduxjs/toolkit';

import type { UIState } from './types';

const initialState: UIState = {
  expanded: {},
  selection: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {},
});

export default uiSlice.reducer;
