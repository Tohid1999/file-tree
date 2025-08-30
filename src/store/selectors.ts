import { createSelector } from '@reduxjs/toolkit';

import { selectNodes, selectRootId } from './features/fs/selectors';
import { selectSelection } from './features/ui/selectors';
import type { RootState } from './index';
import type { FolderNode, FSNode, NodeID } from './types';

const selectNodeId = (_state: RootState, nodeId: NodeID) => nodeId;

export const makeSelectNodeRowData = () =>
  createSelector(
    [selectNodes, selectRootId, selectSelection, selectNodeId],
    (nodes, rootId, selection, nodeId) => {
      const node = nodes[nodeId];
      if (!node) {
        return {
          node: null,
          siblings: [],
          isRoot: false,
          isSelected: false,
        };
      }

      const parent = node.parentId ? (nodes[node.parentId] as FolderNode) : null;
      const siblings: FSNode[] = parent ? parent.children.map((id) => nodes[id]) : [];

      return {
        node,
        siblings,
        isRoot: rootId === nodeId,
        isSelected: selection === nodeId,
      };
    }
  );
