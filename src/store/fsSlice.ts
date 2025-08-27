import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { FSState } from './types';

const rootId = nanoid();

const initialState: FSState = {
  rootId,
  nodes: {
    [rootId]: {
      id: rootId,
      parentId: null,
      name: 'Root',
      type: 'folder',
      children: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
};

const fsSlice = createSlice({
  name: 'fs',
  initialState,
  reducers: {},
});

export default fsSlice.reducer;
