import { useDispatch, useSelector } from 'react-redux';

import { addFile } from '@store/fsSlice';
import type { RootState } from '@store/store';
import type { NodeID } from '@store/types';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => state.fs.nodes[nodeId]);

  const handleAddFile = () => {
    const fileName = prompt('Enter file name (e.g., notes.txt):');
    if (!fileName) return;

    const parts = fileName.split('.');
    const ext = parts.length > 1 ? `.${parts.pop()}` : '';
    const name = parts.join('.');

    dispatch(addFile({ parentId: nodeId, name, ext }));
  };

  if (!node) {
    return null;
  }

  return (
    <div className="ml-5">
      <div>
        <span>{node.type === 'folder' ? '[F]' : '[f]'}</span>
        <span>
          {node.name}
          {node.type === 'file' && <span>{node.ext}</span>}
        </span>
        {node.type === 'folder' && (
          <button type="button" onClick={handleAddFile}>
            Add File
          </button>
        )}
        {node.type === 'folder' && <button type="button">Add Folder</button>}
        <button type="button">Rename</button>
        <button type="button">Delete</button>
      </div>
      {node.type === 'folder' &&
        node.children.map((childId) => <NodeRow key={childId} nodeId={childId} />)}
    </div>
  );
};

export default NodeRow;
