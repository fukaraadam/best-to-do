# Core App

Next.js is used for website and Flux design will be followed with Redux.

## Prisma Usage

Add dotenv to beginning like `npx dotenv -e .env.local -- prisma migrate dev`

- `npx prisma init --datasource-provider sqlite` to initialize prisma
- `npx prisma migrate dev --name init` to create a migration
  - This also runs `prisma generate`
- `npx prisma studio` to open the prisma studio
- `npx prisma migrate reset` to reset the database

## Structure

Created by `npx create-next-app@latest` command. Typescript, EsLint, Tailwind CSS, src/ directory, App Router added by this command.

### Folder Structure

- public: static files to be served directly.
- src: source files for both client and server side. More info: [`Next.js folder structure`][Next.js Folder].
  - app: app related files, layouts, pages etc.
  - assets: Images, fonts, etc.
  - components: components to use in client side. Module css files, React components, etc.
  - data: static data files to be used in general. ts, JSON, CSV etc.
  - lib: Non-component functions to use. Utility functions, models, redux store, etc.

## ToDos

- [ ] Add next-seo
- [ ] Add logging mechanism
- [ ] Add sentry: `./src/lib/redux/middleware/logger.ts` will logs redux actions to console. It can be used to log errors to sentry.

**Through Development:**

- [ ] Edit pages in `./src/app/sitemap.ts` to include all pages and maybe edit `./src/app/robots.ts`.

## Warnings

- DaisyUI theme is using "oklch" css function which is not supported by old browsers (e.g. chrome v111). It will fallback to light theme in these browsers. So check for light theme too.

<!-- Links Used through document -->

[Next.js Folder]: https://nextjs.org/docs/getting-started/project-structure
