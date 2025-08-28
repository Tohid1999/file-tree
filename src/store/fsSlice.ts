import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import { allowedExtensions } from '@/config/files';
import { hasForbiddenChars, isAllowedExt } from '@/lib/validation';
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
        toast.error('Folder name cannot be empty.');
        return;
      }
      if (hasForbiddenChars(trimmedName)) {
        toast.error('Name contains forbidden characters.');
        return;
      }

      const parent = state.nodes[parentId];
      if (parent.type !== 'folder') {
        toast.error('Cannot add items under a file.');
        return;
      }

      const isDuplicate = parent.children.some((childId) => {
        const child = state.nodes[childId];
        return child.type === 'folder' && child.name === trimmedName;
      });

      if (isDuplicate) {
        toast.error('A folder with this name already exists.');
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
        toast.error('Name cannot be empty.');
        return;
      }
      if (hasForbiddenChars(trimmedName)) {
        toast.error('Name contains forbidden characters.');
        return;
      }

      const node = state.nodes[nodeId];
      if (node.parentId === null) {
        toast.error('Root cannot be modified.');
        return;
      }

      const parent = state.nodes[node.parentId] as FolderNode;

      if (node.type === 'folder') {
        const isDuplicate = parent.children.some((childId) => {
          const child = state.nodes[childId];
          return child.id !== nodeId && child.type === 'folder' && child.name === trimmedName;
        });

        if (isDuplicate) {
          toast.error('A folder with this name already exists.');
          return;
        }
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
      const trimmedExt = newExt.trim();

      if (!trimmedName) {
        toast.error('File name cannot be empty.');
        return;
      }
      if (hasForbiddenChars(trimmedName)) {
        toast.error('Name contains forbidden characters.');
        return;
      }
      if (!isAllowedExt(trimmedExt, allowedExtensions)) {
        toast.error('Extension is not allowed.');
        return;
      }

      const node = state.nodes[nodeId];
      if (node.parentId === null) {
        toast.error('Root cannot be modified.');
        return;
      }

      const parent = state.nodes[node.parentId] as FolderNode;

      if (node.type === 'file') {
        const isDuplicate = parent.children.some((childId) => {
          const child = state.nodes[childId];
          return (
            child.id !== nodeId &&
            child.type === 'file' &&
            child.name === trimmedName &&
            isAllowedExt(child.ext, [trimmedExt])
          );
        });

        if (isDuplicate) {
          toast.error('A file with this name already exists.');
          return;
        }

        node.name = trimmedName;
        node.ext = trimmedExt.startsWith('.') ? trimmedExt : `.${trimmedExt}`;
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
        toast.error('Cannot delete the root folder.');
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
      const trimmedExt = ext.trim();

      if (!trimmedName || !trimmedExt) {
        toast.error('File name and Extension cannot be empty.');
        return;
      }
      if (hasForbiddenChars(trimmedName)) {
        toast.error('Name contains forbidden characters.');
        return;
      }
      if (!isAllowedExt(trimmedExt, allowedExtensions)) {
        toast.error('Extension is not allowed.');
        return;
      }

      const parent = state.nodes[parentId];
      if (parent.type !== 'folder') {
        toast.error('Cannot add items under a file.');
        return;
      }

      const isDuplicate = parent.children.some((childId) => {
        const child = state.nodes[childId];
        return (
          child.type === 'file' &&
          child.name === trimmedName &&
          isAllowedExt(child.ext, [trimmedExt])
        );
      });

      if (isDuplicate) {
        toast.error('A file with this name already exists.');
        return;
      }

      const newFileId = nanoid();
      state.nodes[newFileId] = {
        id: newFileId,
        parentId,
        name: trimmedName,
        type: 'file',
        ext: trimmedExt.startsWith('.') ? trimmedExt : `.${trimmedExt}`,
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
