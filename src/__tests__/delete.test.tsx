import { describe, expect, test, vi } from 'vitest';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp } from './utils/test-utils';

describe('Delete Operations', () => {
  test('should delete a file immediately', async () => {
    // Arrange
    const user = userEvent.setup();
    const promptSpy = vi.spyOn(window, 'prompt');
    renderApp();

    // 1. Create a folder and a file
    promptSpy.mockReturnValue('Documents');
    const addFolderToRootButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderToRootButton);
    const documentsRow = await screen.findByText('Documents');
    const documentsRowContainer = documentsRow.closest('div[role="button"]');
    if (!(documentsRowContainer instanceof HTMLElement)) throw new Error('Documents row not found');
    const addFileButton = within(documentsRowContainer).getByRole('button', { name: /add file/i });
    promptSpy.mockReturnValue('notes.txt');
    await user.click(addFileButton);

    // 2. Find the file and the delete button
    const fileRow = await screen.findByText('notes');
    const fileRowContainer = fileRow.closest('div[role="button"]');
    if (!(fileRowContainer instanceof HTMLElement)) throw new Error('File row not found');
    const deleteButton = within(fileRowContainer).getByRole('button', { name: /delete/i });

    // Act
    await user.click(deleteButton);

    // Assert
    expect(screen.queryByText('notes')).not.toBeInTheDocument();
    expect(await screen.findByText(/file "notes.txt" deleted/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // No confirmation dialog
  });

  test('should delete a folder after confirmation', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(window, 'prompt').mockReturnValue('Projects');
    renderApp();

    // 1. Create a folder
    const addFolderToRootButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderToRootButton);

    // 2. Find the folder and the delete button
    const folderRow = await screen.findByText('Projects');
    const folderRowContainer = folderRow.closest('div[role="button"]');
    if (!(folderRowContainer instanceof HTMLElement)) throw new Error('Folder row not found');
    const deleteButton = within(folderRowContainer).getByRole('button', { name: /delete/i });

    // Act
    await user.click(deleteButton);

    // 3. Confirm deletion in the modal
    const modal = await screen.findByRole('dialog');
    const confirmButton = within(modal).getByRole('button', { name: /delete/i });
    await user.click(confirmButton);

    // Assert
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    expect(await screen.findByText(/folder "Projects" deleted/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
