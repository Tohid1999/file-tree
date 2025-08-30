import clsx from 'clsx';
import { File, FilePlus, Folder, FolderPlus, Pencil, Trash2 } from 'lucide-react';

import ConfirmDeleteModal from '@components/ConfirmDeleteModal';
import InlineEditInput from '@components/InlineEditInput';
import { useNodeRow } from '@hooks/useNodeRow';
import type { NodeID } from '@store/types';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const hookResult = useNodeRow(nodeId);

  if (!hookResult) {
    return null;
  }

  const { node, isRoot, display, rename, delete: deleteProps, add, selection } = hookResult;

  const buttonStyles =
    'ml-2 p-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 flex items-center';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === ' ') {
      selection.select(e);
    }
  };

  return (
    <div
      className="ml-5 my-1 rounded-md focus:outline-none"
      onClick={(e) => selection.select(e)}
      onKeyDown={handleKeyDown}
      onFocus={(e) => selection.focus(e)}
      role="button"
      tabIndex={0}
    >
      {deleteProps.isModalOpen && (
        <ConfirmDeleteModal
          nodeName={display.name}
          onConfirm={deleteProps.confirm}
          onCancel={deleteProps.cancel}
        />
      )}
      <div
        className={clsx(
          'flex flex-col sm:flex-row sm:items-center p-1 rounded-md',
          selection.isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
        )}
      >
        <div className="flex items-center">
          <span className="w-6">
            {node.type === 'folder' ? (
              <Folder size={16} className="text-blue-500" />
            ) : (
              <File size={16} className="text-gray-500" />
            )}
          </span>
          {rename.isRenaming ? (
            <InlineEditInput
              value={display.initialRenameValue}
              onSave={rename.save}
              onCancel={rename.cancel}
            />
          ) : (
            <span>
              {node.name}
              {node.type === 'file' && <span className="text-gray-500">{node.ext}</span>}
            </span>
          )}
        </div>
        <div className="w-full sm:w-auto sm:ml-auto flex items-center flex-wrap justify-end mt-2 sm:mt-0">
          {node.type === 'folder' && (
            <button type="button" onClick={add.file} className={buttonStyles}>
              <FilePlus size={14} className="mr-1" /> Add File
            </button>
          )}
          {node.type === 'folder' && (
            <button type="button" onClick={add.folder} className={buttonStyles}>
              <FolderPlus size={14} className="mr-1" /> Add Folder
            </button>
          )}
          {!isRoot && (
            <button type="button" onClick={rename.start} className={buttonStyles}>
              <Pencil size={14} className="mr-1" /> Rename
            </button>
          )}
          {!isRoot && (
            <button type="button" onClick={deleteProps.start} className={buttonStyles}>
              <Trash2 size={14} className="mr-1" /> Delete
            </button>
          )}
        </div>
      </div>
      {node.type === 'folder' && (
        <div className="pl-5 border-l-2 border-gray-200">
          {node.children.map((childId: NodeID) => (
            <NodeRow key={childId} nodeId={childId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeRow;
