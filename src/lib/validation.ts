import { allowedExtensions } from '@config/files';
import type { FSNode } from '@store/types';

export const hasForbiddenChars = (s: string) => /[/:*?"<>|,;]/.test(s);

export const isAllowedExt = (ext: string, allow: readonly string[]) => {
  const norm = (ext.startsWith('.') ? ext : `.${ext}`).toLowerCase();
  return allow.map((e) => e.toLowerCase()).includes(norm);
};

export const validateNodeName = (
  siblings: FSNode[],
  {
    name,
    ext,
    nodeIdToIgnore,
    isFolder,
  }: {
    name: string;
    ext?: string;
    nodeIdToIgnore?: string;
    isFolder: boolean;
  }
): string | null => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 'Name cannot be empty.';
  }
  if (hasForbiddenChars(trimmedName)) {
    return 'Name contains forbidden characters.';
  }

  if (isFolder) {
    const isDuplicate = siblings.some(
      (sibling) =>
        sibling.id !== nodeIdToIgnore && sibling.type === 'folder' && sibling.name === trimmedName
    );
    if (isDuplicate) {
      return 'A folder with this name already exists.';
    }
  } else {
    const trimmedExt = (ext || '').trim();
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
  }

  return null; // No error
};
