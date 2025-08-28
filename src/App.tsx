import { Toaster } from 'react-hot-toast';

import Tree from '@components/Tree';

function App() {
  return (
    <main className="bg-gray-100 min-h-screen p-4 font-sans">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">File Tree Manager</h1>
        <Tree />
      </div>
    </main>
  );
}

export default App;
