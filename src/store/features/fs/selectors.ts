import type { RootState } from '../../index';

export const selectNodes = (state: RootState) => state.fs.nodes;
export const selectRootId = (state: RootState) => state.fs.rootId;
