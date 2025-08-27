import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { nanoid } from 'nanoid';
import type { FSState, NodeID } from './types';

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
  reducers: {
    addFolder: (state, action: PayloadAction<{ parentId: NodeID; name: string }>) => {
      const { parentId, name } = action.payload;
      const trimmedName = name.trim();

      if (!trimmedName) {
        console.error('Folder name cannot be empty.');
        return;
      }

      const parent = state.nodes[parentId];
      if (parent.type !== 'folder') {
        console.error('Cannot add items under a file.');
        return;
      }

      const newFolderId = nanoid();
      state.nodes[newFolderId] = {
        id: newFolderId,
        parentId,
        name: trimmedName,
        type: 'folder',
        children: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      parent.children.push(newFolderId);
      parent.updatedAt = Date.now();
    },
  },
});

export const { addFolder } = fsSlice.actions;
export default fsSlice.reducer;
