import { describe, expect, test, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp } from './utils/test-utils';

describe('Persistence', () => {
  test('should initialize with only the Root node when localStorage is empty', () => {
    // Arrange
    localStorage.clear();

    // Act
    renderApp();

    // Assert
    const rootNode = screen.getByText('Root');
    expect(rootNode).toBeInTheDocument();
    expect(screen.queryByText('Documents')).not.toBeInTheDocument(); // Check that no other nodes are present
  });

  test('should save and restore the file tree state', async () => {
    // Arrange
    const user = userEvent.setup();
    const { unmount } = renderApp();

    // 1. Create a folder
    vi.spyOn(window, 'prompt').mockReturnValue('My Documents');
    const addFolderButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderButton);
    await screen.findByText('My Documents'); // Wait for the folder to appear

    // 2. Unmount the component (simulates closing the tab)
    unmount();

    // Act: Re-render the app
    renderApp();

    // Assert: The previously created folder should be there
    expect(screen.getByText('My Documents')).toBeInTheDocument();
  });
});
