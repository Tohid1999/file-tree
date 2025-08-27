import { useDispatch, useSelector } from 'react-redux';

import NodeRow from '@components/NodeRow';
import { addFolder } from '@store/fsSlice';
import type { RootState } from '@store/store';

const Tree = () => {
  const dispatch = useDispatch();
  const rootId = useSelector((state: RootState) => state.fs.rootId);

  const handleAddFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      dispatch(addFolder({ parentId: rootId, name: folderName }));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-semibold">File Tree</h2>
        <button
          type="button"
          onClick={handleAddFolder}
          className="ml-4 px-2 py-1 bg-primary text-white rounded hover:bg-primary-hover"
        >
          Add Folder to Root
        </button>
      </div>
      <div className="border rounded p-2">
        <NodeRow nodeId={rootId} />
      </div>
    </div>
  );
};

export default Tree;
