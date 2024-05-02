# Best To Do

A To-Do application to keep track of your list.

## Features

- For user authentication, magic link and oauth2 is used as example. next-auth library used
- Although next-auth has its own session management, custom session management is implemented with jsonwebtoken since it is asked in the requirements.
- For database, postgresql is used with prisma as ORM.
- For design, tailwindcss with daisyui is used.
- Both todo tasks and files can only be accessed by the user who created them.
- For image, upload control is added for both client and server side.
- Image and attachment files has different tables from todo with foreign key relationship. This way, we don't leave any unused file in filesystem and database. Also, it can be extended to add multiple files to a single todo.
- Add, edit, delete (multiple selection available) tasks.
- Todos can be filtered by tag or by search

## Usage

Run `npm install` from root directory. This will install all dependencies for all workspaces. Run all these commands from root directory.

### Core Development

- `npm run dev` - Start website in development mode.
- `npm run build` - Build for production.
- `npm run start` - Start website in production mode.
- `npm run utility:icon-generator` - Update all icons and logos.
- `npm run lint` - Run lint for all files.
- `npm run prettier` - Run prettier for all files.

## Structure

Git lfs is used for storing binary files. VS Code is used for development. Prettier is used for auto code formatting with Prettier VS Code extension.

### Folder Structure

- core: Next.js app.
- utility-scripts: Utility scripts to be used manually.

### Naming Convention

- kebab-case: used for css class names, file and folder names.
- PascalCase: used for React component names.
- camelCase: used for variable and function names.

### Tag Convention

Todos and Warnings will be specified respectively inside code with `<ToDo>`, `<Warning>` tags and inside README.md files of each package with `ToDos`, `Warnings` sections.
