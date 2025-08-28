import { nanoid } from 'nanoid';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FolderNode, FSState, NodeID } from './types';

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
    renameNode: (state, action: PayloadAction<{ nodeId: NodeID; newName: string }>) => {
      const { nodeId, newName } = action.payload;
      const trimmedName = newName.trim();

      if (!trimmedName) {
        console.error('Name cannot be empty.');
        return;
      }

      const node = state.nodes[nodeId];
      if (node.type === 'folder') {
        node.name = trimmedName;
        node.updatedAt = Date.now();
      }
    },
    renameFile: (
      state,
      action: PayloadAction<{ nodeId: NodeID; newName: string; newExt: string }>
    ) => {
      const { nodeId, newName, newExt } = action.payload;
      const trimmedName = newName.trim();

      if (!trimmedName || !newExt) {
        console.error('File name and extension cannot be empty.');
        return;
      }

      const node = state.nodes[nodeId];
      if (node.type === 'file') {
        node.name = trimmedName;
        node.ext = newExt;
        node.updatedAt = Date.now();
      }
    },
    deleteFile: (state, action: PayloadAction<NodeID>) => {
      const nodeId = action.payload;
      const node = state.nodes[nodeId];

      if (node?.type === 'file' && node.parentId) {
        const parent = state.nodes[node.parentId] as FolderNode;
        parent.children = parent.children.filter((id) => id !== nodeId);
        delete state.nodes[nodeId];
      }
    },
    deleteFolder: (state, action: PayloadAction<NodeID>) => {
      const folderId = action.payload;

      if (folderId === state.rootId) {
        console.error('Cannot delete the root folder.');
        return;
      }

      const folder = state.nodes[folderId];
      if (!folder || folder.type !== 'folder') return;

      const parent = state.nodes[folder.parentId!] as FolderNode;
      parent.children = parent.children.filter((id) => id !== folderId);

      const deleteQueue: NodeID[] = [folderId];
      while (deleteQueue.length > 0) {
        const currentId = deleteQueue.shift()!;
        const currentNode = state.nodes[currentId];

        if (currentNode.type === 'folder') {
          deleteQueue.push(...currentNode.children);
        }
        delete state.nodes[currentId];
      }
    },
    addFile: (state, action: PayloadAction<{ parentId: NodeID; name: string; ext: string }>) => {
      const { parentId, name, ext } = action.payload;
      const trimmedName = name.trim();

      if (!trimmedName || !ext) {
        console.error('File name and extension cannot be empty.');
        return;
      }

      const parent = state.nodes[parentId];
      if (parent.type !== 'folder') {
        console.error('Cannot add items under a file.');
        return;
      }

      const newFileId = nanoid();
      state.nodes[newFileId] = {
        id: newFileId,
        parentId,
        name: trimmedName,
        type: 'file',
        ext,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      parent.children.push(newFileId);
      parent.updatedAt = Date.now();
    },
  },
});

export const { addFolder, addFile, renameNode, renameFile, deleteFile, deleteFolder } =
  fsSlice.actions;
export default fsSlice.reducer;
