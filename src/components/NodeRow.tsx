import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { confirmDelete } from '@/config/delete';
import { validateNodeName } from '@/lib/validation';
import ConfirmDeleteModal from '@components/ConfirmDeleteModal';
import InlineEditInput from '@components/InlineEditInput';
import { addFile, deleteFile, deleteFolder, renameFile, renameNode } from '@store/fsSlice';
import type { AppDispatch, RootState } from '@store/store';
import type { NodeID } from '@store/types';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const { node, fsState, isRoot } = useSelector((state: RootState) => ({
    node: state.fs.nodes[nodeId],
    fsState: state.fs,
    isRoot: state.fs.rootId === nodeId,
  }));

  const handleAddFile = () => {
    const userInput = prompt('Enter file name (e.g., notes.txt):');
    if (!userInput) return;

    const parts = userInput.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';
    const name = parts.join('.');

    const error = validateNodeName(fsState, { parentId: nodeId, name, ext });
    if (error) {
      toast.error(error);
      return;
    }

    dispatch(addFile({ parentId: nodeId, name, ext }));
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
      const error = validateNodeName(fsState, {
        parentId: node.parentId!,
        name: newValue,
        nodeIdToIgnore: nodeId,
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
      const error = validateNodeName(fsState, {
        parentId: node.parentId!,
        name: newName,
        ext: newExt,
        nodeIdToIgnore: nodeId,
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

    const nodeType = node.type;
    if (confirmDelete[nodeType]) {
      setIsDeleteModalOpen(true);
    } else {
      if (nodeType === 'file') {
        dispatch(deleteFile(nodeId));
        toast.success(`File "${node.name}${node.ext}" deleted.`);
      } else if (nodeType === 'folder') {
        dispatch(deleteFolder(nodeId));
        toast.success(`Folder "${node.name}" deleted.`);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (node.type === 'file') {
      dispatch(deleteFile(nodeId));
      toast.success(`File "${node.name}${node.ext}" deleted.`);
    } else if (node.type === 'folder') {
      dispatch(deleteFolder(nodeId));
      toast.success(`Folder "${node.name}" deleted.`);
    }
    setIsDeleteModalOpen(false);
  };

  if (!node) {
    return null;
  }

  const buttonStyles = 'ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300';

  const initialRenameValue = node.type === 'file' ? `${node.name}${node.ext}` : node.name;
  const nodeDisplayName = node.type === 'file' ? `${node.name}${node.ext}` : node.name;

  return (
    <div className="ml-5 my-1">
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          nodeName={nodeDisplayName}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
      <div className="flex items-center p-1 rounded hover:bg-gray-100">
        <span className="w-6">{node.type === 'folder' ? '[F]' : '[f]'}</span>
        {isRenaming ? (
          <InlineEditInput
            value={initialRenameValue}
            onSave={handleRenameSave}
            onCancel={handleRenameCancel}
          />
        ) : (
          <span>
            {node.name}
            {node.type === 'file' && <span className="text-gray-500">{node.ext}</span>}
          </span>
        )}
        <div className="ml-auto">
          {node.type === 'folder' && (
            <button type="button" onClick={handleAddFile} className={buttonStyles}>
              Add File
            </button>
          )}
          {node.type === 'folder' && (
            <button type="button" className={buttonStyles}>
              Add Folder
            </button>
          )}
          <button type="button" onClick={handleStartRename} className={buttonStyles}>
            Rename
          </button>
          <button type="button" onClick={handleDelete} className={buttonStyles}>
            Delete
          </button>
        </div>
      </div>
      {node.type === 'folder' && (
        <div className="pl-5 border-l-2 border-gray-200">
          {node.children.map((childId) => (
            <NodeRow key={childId} nodeId={childId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeRow;
