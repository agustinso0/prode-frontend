# Prode Frontend

Professional portfolio-grade frontend foundation for Prode, a reusable tournament prediction platform for private leagues.

## Stack

- Vite + React + TypeScript
- React Router for routing
- TanStack Query for server state
- Zustand for local UI state
- React Hook Form + Zod for forms and validation
- Tailwind CSS for custom styling
- Vitest + React Testing Library for tests
- ESLint, Prettier, lint-staged, Husky, and commitlint for quality gates

## Commands

This project uses `pnpm`. If `pnpm` is not available globally, enable it with Corepack or run commands through `npx pnpm`.

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm dev
```

Run quality checks:

```bash
npx pnpm lint
npx pnpm typecheck
npx pnpm test
npx pnpm build
```

Format files:

```bash
npx pnpm format
npx pnpm format:check
```

## Git Hooks

Husky hooks run `lint-staged` before commits and commitlint for commit messages.

## Architecture Docs

- `docs/frontend-architecture.md` defines the frontend structure and dependency rules.
- `docs/frontend-routing-auth.md` defines the route map and authentication flow.
- `docs/frontend-design-system.md` defines the visual foundation and component design conventions.
- `docs/frontend-api-env.md` defines the API client, environment, DTO, and TanStack Query conventions.
- `docs/frontend-testing-quality.md` defines the testing strategy, quality gates, and coverage stance.
