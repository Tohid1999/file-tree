import { useNodeRow } from '@/hooks/useNodeRow';
import ConfirmDeleteModal from '@components/ConfirmDeleteModal';
import InlineEditInput from '@components/InlineEditInput';
import type { NodeID } from '@store/types';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const hookResult = useNodeRow(nodeId);

  if (!hookResult) {
    return null;
  }

  const { node, display, rename, delete: deleteProps, add } = hookResult;

  const buttonStyles = 'ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300';

  return (
    <div className="ml-5 my-1">
      {deleteProps.isModalOpen && (
        <ConfirmDeleteModal
          nodeName={display.name}
          onConfirm={deleteProps.confirm}
          onCancel={deleteProps.cancel}
        />
      )}
      <div className="flex items-center p-1 rounded hover:bg-gray-100">
        <span className="w-6">{node.type === 'folder' ? '[F]' : '[f]'}</span>
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
        <div className="ml-auto">
          {node.type === 'folder' && (
            <button type="button" onClick={add.file} className={buttonStyles}>
              Add File
            </button>
          )}
          {node.type === 'folder' && (
            <button type="button" onClick={add.folder} className={buttonStyles}>
              Add Folder
            </button>
          )}
          <button type="button" onClick={rename.start} className={buttonStyles}>
            Rename
          </button>
          <button type="button" onClick={deleteProps.start} className={buttonStyles}>
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
