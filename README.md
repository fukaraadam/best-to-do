# Best To Do

A To-Do application to keep track of your list.

## Usage

Run `npm install` from root directory. This will install all dependencies for all workspaces. Run all these commands from root directory.

### Core Development

Core application is a static website.

- `npm run dev` - Start website in development mode.
- `npm run build` - Build for production.
- `npm run utility:icon-generator` - Update all icons and logos.
- `npm run lint` - Run lint for all files.
- `npm run prettier` - Run prettier for all files.

## Structure

Git lfs is used for storing binary files. VS Code is used for development. Prettier is used for auto code formatting with Prettier VS Code extension.

### Folder Structure

- core: Next.js app for UI and static website.
- utility-scripts: Utility scripts to be used manually.

### Naming Convention

- kebab-case: used for css class names, file and folder names.
- PascalCase: used for React component names.
- camelCase: used for variable and function names.

### Tag Convention

Todos and Warnings will be specified respectively inside code with `<ToDo>`, `<Warning>` tags and inside README.md files of each package with `ToDos`, `Warnings` sections.
