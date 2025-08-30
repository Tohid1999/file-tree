import { describe, expect, test, vi } from 'vitest';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp } from './utils/test-utils';

describe('Rename Operations', () => {
  test('should rename a file', async () => {
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

    // 2. Find the file and the rename button
    const fileRow = await screen.findByText('notes');
    const fileRowContainer = fileRow.closest('div[role="button"]');
    if (!(fileRowContainer instanceof HTMLElement)) throw new Error('File row not found');
    const renameButton = within(fileRowContainer).getByRole('button', { name: /rename/i });

    // Act
    await user.click(renameButton);
    const input = screen.getByDisplayValue('notes.txt');
    await user.clear(input);
    await user.type(input, 'meeting-notes.txt');
    await user.keyboard('{enter}');

    // Assert
    const newFileRow = screen.getByText('meeting-notes');
    expect(newFileRow).toBeInTheDocument();
    expect(newFileRow.parentElement).toHaveTextContent('meeting-notes.txt');
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
  });

  test('should rename a folder', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(window, 'prompt').mockReturnValue('Work');
    renderApp();

    // 1. Create a folder
    const addFolderToRootButton = screen.getByRole('button', { name: /add folder to root/i });
    await user.click(addFolderToRootButton);

    // 2. Find the folder and the rename button
    const folderRow = await screen.findByText('Work');
    const folderRowContainer = folderRow.closest('div[role="button"]');
    if (!(folderRowContainer instanceof HTMLElement)) throw new Error('Folder row not found');
    const renameButton = within(folderRowContainer).getByRole('button', { name: /rename/i });

    // Act
    await user.click(renameButton);
    const input = screen.getByDisplayValue('Work');
    await user.clear(input);
    await user.type(input, 'Office');
    await user.keyboard('{enter}');

    // Assert
    expect(screen.getByText('Office')).toBeInTheDocument();
    expect(screen.queryByText('Work')).not.toBeInTheDocument();
  });
});
