import { Toaster } from 'react-hot-toast';

import ErrorBoundary from '@components/ErrorBoundary';
import Tree from '@components/Tree';
import { storageKey } from '@config/files';

function App() {
  return (
    <main className="bg-gray-100 min-h-screen p-4 font-sans">
      <Toaster />
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">File Tree Manager</h1>
        <ErrorBoundary storageKey={storageKey}>
          <Tree />
        </ErrorBoundary>
      </div>
    </main>
  );
}

export default App;
