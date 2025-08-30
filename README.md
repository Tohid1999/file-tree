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

- Node.js (v20.19+ or higher recommended)
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
