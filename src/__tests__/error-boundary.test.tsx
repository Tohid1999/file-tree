import { afterEach, describe, expect, test, vi } from 'vitest';

import ErrorBoundary from '@/components/ErrorBoundary';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ErrorBoundary', () => {
  // Mock console.error to prevent test output from being cluttered
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  // A component that always throws an error during render
  const ThrowingComponent = () => {
    throw new Error('Test Error');
  };

  // A component whose throwing behavior is controlled by a prop
  const ControlledThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test Error');
    }
    return <div>I am a normal component now.</div>;
  };

  afterEach(() => {
    consoleErrorSpy.mockClear();
    localStorage.clear();
  });

  test('should catch render error and show fallback UI', () => {
    // Arrange
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });

  test('should clear localStorage and recover UI on Reset button click', async () => {
    // Arrange
    localStorage.setItem('testKey', 'testValue'); // Set some data in localStorage
    const user = userEvent.setup();

    let shouldThrow = true; // Initial state for the prop

    const { rerender } = render(
      <ErrorBoundary storageKey="testKey">
        <ControlledThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );

    // Act
    // After the first render, tell it not to throw on subsequent renders
    shouldThrow = false; // Update the variable

    // Re-render the ErrorBoundary with the updated prop
    rerender(
      <ErrorBoundary storageKey="testKey">
        <ControlledThrowingComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Oops! Something went wrong.')).not.toBeInTheDocument();
    });

    expect(localStorage.getItem('testKey')).toBeNull(); // localStorage should be cleared
    expect(screen.getByText('I am a normal component now.')).toBeInTheDocument(); // Original component should be remounted
  });

  test('Reload button calls window.location.reload', async () => {
    // Arrange
    const user = userEvent.setup();
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadSpy },
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Act
    const reloadButton = screen.getByRole('button', { name: /reload/i });
    await user.click(reloadButton);

    // Assert
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  test('onError is called with error and component stack', () => {
    // Arrange
    const onErrorSpy = vi.fn();

    render(
      <ErrorBoundary onError={onErrorSpy}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Assert
    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    );
  });
});
