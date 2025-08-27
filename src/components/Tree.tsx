import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { addFolder } from '../store/fsSlice';
import NodeRow from './NodeRow';

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
    <div>
      <h2>File Tree</h2>
      <button type="button" onClick={handleAddFolder}>
        Add Folder to Root
      </button>
      <NodeRow nodeId={rootId} />
    </div>
  );
};

export default Tree;
