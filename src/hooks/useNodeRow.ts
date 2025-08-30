import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { confirmDelete } from '@/config/delete';
import { validateNodeName } from '@/lib/validation';
import {
  addFile,
  addFolder,
  deleteFile,
  deleteFolder,
  renameFile,
  renameNode,
} from '@store/features/fs';
import { setSelection } from '@store/features/ui';
import type { AppDispatch, RootState } from '@store/index';
import { makeSelectNodeRowData } from '@store/selectors';
import type { NodeID } from '@store/types';

export const useNodeRow = (nodeId: NodeID) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const selectNodeRowData = useMemo(makeSelectNodeRowData, []);
  const { node, siblings, isRoot, isSelected } = useSelector((state: RootState) =>
    selectNodeRowData(state, nodeId)
  );

  if (!node) {
    return null;
  }

  const handleSelect = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    dispatch(setSelection(nodeId));
  };

  const handleFocus = (e: React.FocusEvent) => {
    e.stopPropagation();
    dispatch(setSelection(nodeId));
  };

  const handleAddFile = () => {
    const userInput = prompt('Enter file name (e.g., notes.txt):');
    if (!userInput) return;

    const parts = userInput.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';
    const name = parts.join('.');

    const error = validateNodeName(siblings, { name, ext, isFolder: false });
    if (error) {
      toast.error(error);
      return;
    }

    dispatch(addFile({ parentId: nodeId, name, ext }));
  };

  const handleAddFolder = () => {
    const userInput = prompt('Enter folder name:');
    if (!userInput) return;

    const error = validateNodeName(siblings, { name: userInput, isFolder: true });
    if (error) {
      toast.error(error);
      return;
    }

    dispatch(addFolder({ parentId: nodeId, name: userInput }));
  };

  const handleStartRename = () => {
    if (isRoot) {
      toast.error('Root cannot be modified.');
      return;
    }
    setIsRenaming(true);
  };

  const handleRenameSave = (newValue: string) => {
    if (node.type === 'folder') {
      const error = validateNodeName(siblings, {
        name: newValue,
        nodeIdToIgnore: nodeId,
        isFolder: true,
      });
      if (error) {
        toast.error(error);
        return;
      }
      dispatch(renameNode({ nodeId, newName: newValue }));
    } else {
      const parts = newValue.split('.');
      const newExt = parts.length > 1 ? `.${parts.pop()}` : '';
      const newName = parts.join('.');
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
      dispatch(renameFile({ nodeId, newName, newExt }));
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (isRoot) {
      toast.error('Root cannot be deleted.');
      return;
    }

    if (confirmDelete[node.type]) {
      setIsDeleteModalOpen(true);
    } else {
      if (node.type === 'file') {
        dispatch(deleteFile(nodeId));
        toast.success(`File "${node.name}${node.ext}" deleted.`);
      } else if (node.type === 'folder') {
        dispatch(deleteFolder(nodeId));
        toast.success(`Folder "${node.name}" deleted.`);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (node.type === 'file') {
      dispatch(deleteFile(nodeId));
      toast.success(`File "${node.name}${node.ext}" deleted.`);
    } else {
      dispatch(deleteFolder(nodeId));
      toast.success(`Folder "${node.name}" deleted.`);
    }
    setIsDeleteModalOpen(false);
  };

  const initialRenameValue = node.type === 'file' ? `${node.name}${node.ext}` : node.name;
  const nodeDisplayName = node.type === 'file' ? `${node.name}${node.ext}` : node.name;

  return {
    node,
    isRoot,
    selection: {
      isSelected,
      select: handleSelect,
      focus: handleFocus,
    },
    display: {
      name: nodeDisplayName,
      initialRenameValue,
    },
    rename: {
      isRenaming,
      start: handleStartRename,
      save: handleRenameSave,
      cancel: handleRenameCancel,
    },
    delete: {
      isModalOpen: isDeleteModalOpen,
      start: handleDelete,
      confirm: handleConfirmDelete,
      cancel: () => setIsDeleteModalOpen(false),
    },
    add: {
      file: handleAddFile,
      folder: handleAddFolder,
    },
  };
};
