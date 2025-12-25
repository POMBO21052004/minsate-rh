# Minsante-RH

Modern React application powered by Vite and Tailwind CSS v4.

Contents
- Overview
- Requirements
- Getting Started
- Available Scripts
- Tech Stack
- Tailwind CSS v4 Notes
- Contributing (Branches, Commit prefixes, PRs)

Overview
This repository contains the frontend for the MINSATE RH portal. It uses Vite for fast dev/build, React 19, and Tailwind CSS v4 with the official @tailwindcss/vite plugin.

Requirements
- Node.js >= 18
- npm >= 9

Getting Started
1) Install dependencies
   npm install

2) Start the dev server
   npm run dev
   The app will be available at http://localhost:5173/

3) Production build
   npm run build

4) Preview the production build locally
   npm run preview

Available Scripts
- dev: Start Vite in development mode
- build: Create a production build
- preview: Preview the production build
- lint: Run ESLint

Tech Stack
- React 19
- Vite 7
- Tailwind CSS 4 with @tailwindcss/vite
- ESLint 9

Tailwind CSS v4 Notes
- Tailwind v4 uses the @tailwindcss/vite plugin and works without a tailwind.config.js file.
- Global CSS includes Tailwind via:
  @import "tailwindcss";
- Design tokens are defined via CSS variables (e.g., in src/index.css) and can be mapped with @theme inline.

Contributing
- Branching strategy
  - feature work: feat/...
  - refactoring: refactor/...
  - fixes: fix/...
  - chores and docs: chore/...
  - hotfixes: hotfix/...

- Commit message prefixes (required)
  - chore(scope): description
  - fix(scope): description
  - feat(scope): description
  - hotfix(scope): description
  - refactor(scope): description

- Pull Requests
  - Open PRs against the develop branch.
  - Default remote is origin (not upstream).

Notes
- If you add environment variables, document them here (e.g. .env, VITE_API_URL, etc.).
