import { Provider } from 'react-redux';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import fsReducer from '../store/features/fs';
import uiReducer from '../store/features/ui';
import { persistenceMiddleware } from '../store/middleware/persistence';

describe('File Tree App', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    const store = configureStore({
      reducer: {
        fs: fsReducer,
        ui: uiReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    return { store };
  };

  test('should add a new folder to the root', async () => {
    // Arrange
    const promptSpy = vi.spyOn(window, 'prompt');
    promptSpy.mockReturnValue('New Folder');
    renderApp();
    const user = userEvent.setup();

    // Act
    const addFolderButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderButton);

    // Assert
    expect(screen.getByText('New Folder')).toBeInTheDocument();
    expect(await screen.findByText(/folder "new folder" created/i)).toBeInTheDocument();
  });

  test('should show an error when adding a duplicate folder', async () => {
    // Arrange
    const promptSpy = vi.spyOn(window, 'prompt');
    promptSpy.mockReturnValue('Duplicate Folder');
    renderApp();
    const user = userEvent.setup();
    const addFolderButton = screen.getByRole('button', { name: /add folder to root/i });

    // Act
    await user.click(addFolderButton);
    await user.click(addFolderButton); // Try to add it again

    // Assert
    expect(await screen.findByText(/a folder with this name already exists/i)).toBeInTheDocument();
    expect(screen.getAllByText('Duplicate Folder')).toHaveLength(1);
  });

  test('should not show rename or delete buttons for the root node', () => {
    // Arrange
    renderApp();

    // Act
    const rootRow = screen.getByText('Root').closest('div[role="button"]');

    // Assert
    if (!(rootRow instanceof HTMLElement)) {
      throw new Error('Could not find root row or it is not an HTMLElement');
    }

    const renameButton = within(rootRow).queryByRole('button', { name: /rename/i });
    const deleteButton = within(rootRow).queryByRole('button', { name: /delete/i });
    expect(renameButton).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });
});
