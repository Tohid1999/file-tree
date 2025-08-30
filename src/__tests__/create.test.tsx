import { describe, expect, test, vi } from 'vitest';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderApp } from './utils/test-utils';

describe('Create Operations', () => {
  test('should create a new folder under the root', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.spyOn(window, 'prompt').mockReturnValue('Documents');
    renderApp();

    // Act
    const rootRow = screen.getByText('Root').closest('div[role="button"]');
    if (!(rootRow instanceof HTMLElement)) throw new Error('Root row not found');

    const addFolderButton = within(rootRow).getByRole('button', { name: /add folder/i });
    await user.click(addFolderButton);

    // Assert
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(await screen.findByText('Folder "Documents" created.')).toBeInTheDocument();
  });

  test('should create a new file under a folder', async () => {
    // Arrange
    const user = userEvent.setup();
    const promptSpy = vi.spyOn(window, 'prompt');
    renderApp();

    // 1. Create the parent folder first
    promptSpy.mockReturnValue('Documents');
    const rootRow = screen.getByText('Root').closest('div[role="button"]');
    if (!(rootRow instanceof HTMLElement)) throw new Error('Root row not found');
    const addFolderButton = within(rootRow).getByRole('button', { name: /add folder/i });
    await user.click(addFolderButton);

    // 2. Now, add the file to the new folder
    promptSpy.mockReturnValue('notes.txt');
    const documentsRow = await screen.findByText('Documents');
    const documentsRowContainer = documentsRow.closest('div[role="button"]');
    if (!(documentsRowContainer instanceof HTMLElement)) throw new Error('Documents row not found');

    const addFileButton = within(documentsRowContainer).getByRole('button', { name: /add file/i });

    // Act
    await user.click(addFileButton);

    // Assert
    const fileRow = screen.getByText('notes');
    expect(fileRow).toBeInTheDocument();
    expect(fileRow.parentElement).toHaveTextContent('notes.txt');
    expect(await screen.findByText('File "notes" created.')).toBeInTheDocument();
  });
});
