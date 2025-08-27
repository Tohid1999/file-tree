import { useSelector } from 'react-redux';

import type { RootState } from '@store/store';
import type { NodeID } from '@store/types';

interface NodeRowProps {
  nodeId: NodeID;
}

const NodeRow = ({ nodeId }: NodeRowProps) => {
  const node = useSelector((state: RootState) => state.fs.nodes[nodeId]);

  if (!node) {
    return null;
  }

  return (
    <div className="ml-5">
      <div>
        <span>{node.type === 'folder' ? '[F]' : '[f]'}</span>
        <span>{node.name}</span>
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
