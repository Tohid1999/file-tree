# File Tree Manager

A React + TypeScript project that simulates a file explorer with support for creating, renaming, and deleting files/folders, along with persistence in localStorage.

🚀 **Live Demo**: [tohid-file-tree.vercel.app](https://tohid-file-tree.vercel.app/)

## Features

- Create, rename, and delete files and folders.
- State persists in `localStorage`.
- Client-side validation for names and extensions.
- A clean, modern UI with icons and keyboard navigation.

## Development Setup

### Prerequisites

- Node.js (v20.19.0 or higher recommended)
- pnpm (v9.0.0 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tohid1999/file-tree
   cd file-tree
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Configuration

The following configurations can be adjusted:

- **Allowed File Extensions:** Modify the `allowedExtensions` array in `src/config/files.ts`.
- **Delete Confirmation:** Toggle confirmation dialogs for file and folder deletion in `src/config/delete.ts`.

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `pnpm build`

Builds the app for production to the `dist` folder.

### `pnpm test`

Launches the test runner in interactive watch mode.

### `pnpm lint`

Lints the codebase for potential errors and style issues.

### `pnpm format`

Formats the code with Prettier.

### `pnpm check:ts`

Runs the TypeScript compiler to check for type errors.

## Performance Strategy

To ensure a smooth and responsive user experience, the application employs the following performance optimizations:

- **Memoized Selectors (Reselect):** Redux selectors are memoized using `reselect`. This prevents unnecessary re-renders of React components by ensuring that selectors only re-calculate their output when the specific pieces of state they depend on actually change.
- **Efficient State Persistence:** A custom Redux middleware handles state saving to `localStorage`. This middleware is designed to save the application's state only when critical modifications to the file tree occur, avoiding excessive and potentially performance-impacting writes.

## Architecture & Decisions (Short)

This project is structured to promote maintainability, scalability, and clear separation of concerns:

- **Redux Store Structure:** The Redux store is organized using a feature-based folder pattern (`src/store/features/fs`, `src/store/features/ui`, `src/store/middleware`). This co-locates all Redux logic (slices, actions, selectors) related to a specific feature, making the codebase easier to navigate and scale.
- **Custom Hooks for Logic Encapsulation:** Complex component logic is extracted into custom React hooks (e.g., `useNodeRow`, `useAddNode`). This keeps components lean and focused on rendering, while centralizing business logic in reusable and testable hooks.
- **Two-Phase Validation Strategy:** User input validation is performed in two phases:
  1.  **Client-side (in hooks):** Provides immediate user feedback and improves UX by preventing invalid actions before dispatching.
  2.  **Store-side (in reducers):** Acts as a final safeguard to ensure data integrity, preventing any invalid state from entering the Redux store. The core validation logic is centralized in a single utility function (`src/lib/validation.ts`) to avoid duplication.
- **Responsive UI Design:** The user interface is designed to be responsive, adapting gracefully to different screen sizes. Key elements like action buttons in tree nodes reflow or stack vertically on smaller screens to ensure usability without horizontal scrolling.
- **Integration Testing:** The application utilizes `react-testing-library` and `vitest` for integration tests. Tests are organized by feature (`src/__tests__/feature.test.tsx`) to ensure comprehensive coverage and easy identification of failing scenarios.
