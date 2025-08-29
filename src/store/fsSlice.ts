import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import { validateNodeName } from '@/lib/validation';
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
      const parent = state.nodes[parentId] as FolderNode;
      const siblings = parent.children.map((id) => state.nodes[id]);
      const error = validateNodeName(siblings, { name, isFolder: true });
      if (error) {
        toast.error(error);
        return;
      }

      const newFolderId = nanoid();
      state.nodes[newFolderId] = {
        id: newFolderId,
        parentId,
        name: name.trim(),
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
      const node = state.nodes[nodeId];
      if (node.parentId === null) {
        toast.error('Root cannot be modified.');
        return;
      }
      const parent = state.nodes[node.parentId] as FolderNode;
      const siblings = parent.children.map((id) => state.nodes[id]);
      const error = validateNodeName(siblings, {
        name: newName,
        nodeIdToIgnore: nodeId,
        isFolder: true,
      });
      if (error) {
        toast.error(error);
        return;
      }

      if (node.type === 'folder') {
        node.name = newName.trim();
        node.updatedAt = Date.now();
      }
    },
    renameFile: (
      state,
      action: PayloadAction<{ nodeId: NodeID; newName: string; newExt: string }>
    ) => {
      const { nodeId, newName, newExt } = action.payload;
      const node = state.nodes[nodeId];
      if (node.parentId === null) {
        toast.error('Root cannot be modified.');
        return;
      }

      const parent = state.nodes[node.parentId] as FolderNode;
      const siblings = parent.children.map((id) => state.nodes[id]);
      const error = validateNodeName(siblings, {
        name: newName,
        ext: newExt,
        nodeIdToIgnore: nodeId,
        isFolder: false,
      });
      if (error) {
        toast.error(error);
        return;
      }

      if (node.type === 'file') {
        node.name = newName.trim();
        node.ext = newExt.trim().startsWith('.') ? newExt.trim() : `.${newExt.trim()}`;
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
      const parent = state.nodes[parentId] as FolderNode;
      const siblings = parent.children.map((id) => state.nodes[id]);
      const error = validateNodeName(siblings, { name, ext, isFolder: false });
      if (error) {
        toast.error(error);
        return;
      }

      const newFileId = nanoid();
      state.nodes[newFileId] = {
        id: newFileId,
        parentId,
        name: name.trim(),
        type: 'file',
        ext: ext.trim().startsWith('.') ? ext.trim() : `.${ext.trim()}`,
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
