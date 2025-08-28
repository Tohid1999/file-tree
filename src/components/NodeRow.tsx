import { useDispatch, useSelector } from 'react-redux';

import InlineEditInput from '@components/InlineEditInput';
import { addFile, renameNode } from '@store/fsSlice';
import type { RootState } from '@store/store';
import type { NodeID } from '@store/types';
import { startRename, stopRename } from '@store/uiSlice';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => state.fs.nodes[nodeId]);
  const isRenaming = useSelector((state: RootState) => state.ui.renameEditingId === nodeId);

  const handleAddFile = () => {
    const fileName = prompt('Enter file name (e.g., notes.txt):');
    if (!fileName) return;

    const parts = fileName.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';
    const name = parts.join('.');

    dispatch(addFile({ parentId: nodeId, name, ext }));
  };

  const handleStartRename = () => {
    dispatch(startRename(nodeId));
  };

  const handleRenameSave = (newName: string) => {
    dispatch(renameNode({ nodeId, newName }));
    dispatch(stopRename());
  };

  const handleRenameCancel = () => {
    dispatch(stopRename());
  };

  if (!node) {
    return null;
  }

  const buttonStyles = 'ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300';

  return (
    <div className="ml-5 my-1">
      <div className="flex items-center p-1 rounded hover:bg-gray-100">
        <span className="w-6">{node.type === 'folder' ? '[F]' : '[f]'}</span>
        {isRenaming ? (
          <InlineEditInput
            value={node.name}
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
          <button type="button" className={buttonStyles}>
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
