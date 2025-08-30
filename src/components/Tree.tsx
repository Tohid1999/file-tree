import { FolderPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import NodeRow from '@components/NodeRow';
import { addFolder } from '@store/features/fs';
import { selectRootId } from '@store/features/fs/selectors';

const Tree = () => {
  const dispatch = useDispatch();
  const rootId = useSelector(selectRootId);

  const handleAddFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      dispatch(addFolder({ parentId: rootId, name: folderName }));
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center mb-2 w-full justify-between">
        <h2 className="text-xl font-semibold">File Tree</h2>
        <button
          type="button"
          onClick={handleAddFolder}
          className="ml-4 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center"
        >
          <FolderPlus size={16} className="mr-1" />
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
