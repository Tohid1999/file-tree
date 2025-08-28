import { allowedExtensions } from '@/config/files';
import type { FolderNode, FSState, NodeID } from '@store/types';

export const hasForbiddenChars = (s: string) => /[/:*?"<>|,;]/.test(s);

export const isAllowedExt = (ext: string, allow: readonly string[]) => {
  const norm = (ext.startsWith('.') ? ext : `.${ext}`).toLowerCase();
  return allow.map((e) => e.toLowerCase()).includes(norm);
};

export const validateNodeName = (
  state: FSState,
  {
    parentId,
    name,
    ext,
    nodeIdToIgnore,
  }: {
    parentId: NodeID;
    name: string;
    ext?: string;
    nodeIdToIgnore?: NodeID;
  }
): string | null => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'Name cannot be empty.';
  }
  if (hasForbiddenChars(trimmedName)) {
    return 'Name contains forbidden characters.';
  }

  const parent = state.nodes[parentId] as FolderNode;
  if (!parent || parent.type !== 'folder') {
    return 'Cannot add items under a file.';
  }

  const siblings = parent.children.map((id) => state.nodes[id]);

  if (ext !== undefined) {
    // It's a file
    const trimmedExt = ext.trim();
    if (!isAllowedExt(trimmedExt, allowedExtensions)) {
      return 'Extension is not allowed.';
    }
    const isDuplicate = siblings.some(
      (sibling) =>
        sibling.id !== nodeIdToIgnore &&
        sibling.type === 'file' &&
        sibling.name === trimmedName &&
        isAllowedExt(sibling.ext, [trimmedExt])
    );
    if (isDuplicate) {
      return 'A file with this name already exists.';
    }
  } else {
    // It's a folder
    const isDuplicate = siblings.some(
      (sibling) =>
        sibling.id !== nodeIdToIgnore && sibling.type === 'folder' && sibling.name === trimmedName
    );
    if (isDuplicate) {
      return 'A folder with this name already exists.';
    }
  }

  return null; // No error
};
