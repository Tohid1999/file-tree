import { describe, expect, test } from 'vitest';

import { screen, within } from '@testing-library/react';

import { renderApp } from './utils/test-utils';

describe('UI & Initial State', () => {
  test('Initial render shows only the Root node with correct actions', () => {
    // Arrange
    renderApp();

    // Assert
    const rootNode = screen.getByText('Root');
    expect(rootNode).toBeInTheDocument();

    // Check for actions within the root node's row
    const rootRow = rootNode.closest('div[role="button"]');
    if (!(rootRow instanceof HTMLElement)) {
      throw new Error('Could not find root row');
    }

    // Assert that Add actions are present
    expect(within(rootRow).getByRole('button', { name: /add file/i })).toBeInTheDocument();
    expect(within(rootRow).getByRole('button', { name: /add folder/i })).toBeInTheDocument();

    // Assert that Rename and Delete actions are not present
    expect(within(rootRow).queryByRole('button', { name: /rename/i })).not.toBeInTheDocument();
    expect(within(rootRow).queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
