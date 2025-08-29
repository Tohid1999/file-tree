import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';
import type { FolderNode, FSNode, NodeID } from './types';

const selectFs = (state: RootState) => state.fs;
const selectNodeId = (_state: RootState, nodeId: NodeID) => nodeId;

export const makeSelectNodeRowData = () =>
  createSelector([selectFs, selectNodeId], (fs, nodeId) => {
    const node = fs.nodes[nodeId];
    if (!node) {
      return {
        node: null,
        siblings: [],
        isRoot: false,
        fsState: fs,
      };
    }

    const parent = node.parentId ? (fs.nodes[node.parentId] as FolderNode) : null;
    const siblings: FSNode[] = parent ? parent.children.map((id) => fs.nodes[id]) : [];

    return {
      node,
      siblings,
      isRoot: fs.rootId === nodeId,
      fsState: fs,
    };
  });
