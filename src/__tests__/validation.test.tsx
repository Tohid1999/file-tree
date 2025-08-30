import { describe, expect, test, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp } from './utils/test-utils';

describe('Validation Rules', () => {
  test('should show an error when adding a folder with an empty name', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(window, 'prompt').mockReturnValue('   '); // Empty name with spaces
    renderApp();

    // Act
    const addFolderButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderButton);

    // Assert
    expect(await screen.findByText('Name cannot be empty.')).toBeInTheDocument();
  });

  test('should show an error when adding a folder with forbidden characters', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(window, 'prompt').mockReturnValue('a/b:c*d?e"f<g>h|i');
    renderApp();

    // Act
    const addFolderButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderButton);

    // Assert
    expect(await screen.findByText('Name contains forbidden characters.')).toBeInTheDocument();
  });
});
