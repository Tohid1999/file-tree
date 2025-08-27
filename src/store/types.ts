export type NodeID = string;

export type BaseNode = {
  id: NodeID;
  parentId: NodeID | null;
  name: string;
  createdAt: number;
  updatedAt: number;
};

export type FolderNode = BaseNode & {
  type: 'folder';
  children: NodeID[];
};

export type FileNode = BaseNode & {
  type: 'file';
  ext: string;
};

export type FSNode = FolderNode | FileNode;

export type FSState = {
  rootId: NodeID;
  nodes: Record<NodeID, FSNode>;
};

export type UIState = {
  expanded: Record<NodeID, boolean>;
  selection: NodeID | null;
  renameEditingId: NodeID | null;
};
