# Frontend Architecture

This document defines the frontend structure for Prode before product feature implementation. The goal is to keep routing, application bootstrapping, reusable code, and product domains separated from the start.

## Summary

| Area          | Decision                                                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture  | Feature/domain-oriented structure.                                                                                                                                                                  |
| Routing       | Routes are centralized in `src/routes`; routed screens live inside `src/features`.                                                                                                                  |
| App bootstrap | `src/app` owns React bootstrap composition, providers, and global shell concerns.                                                                                                                   |
| Server state  | TanStack Query owns remote/server state.                                                                                                                                                            |
| UI state      | Zustand owns cross-screen client UI state only when local React state is not enough.                                                                                                                |
| API boundary  | API transport and base adapters live in `src/lib`; features consume domain-facing helpers, not raw transport details. API and environment conventions are documented in `docs/frontend-api-env.md`. |
| Auth boundary | Authentication integration lives in `src/lib/auth`; auth screens and flows live in `src/features/auth`.                                                                                             |
| Design system | Visual foundations and UI component tiers are documented in `docs/frontend-design-system.md`.                                                                                                       |
| Testing       | Testing strategy, quality gates, and coverage stance are documented in `docs/frontend-testing-quality.md`.                                                                                          |

## Source Layout

```text
src/
  app/        App composition, providers, global shell concerns.
  routes/     Central route tree, guards, and route-level layouts.
  features/   Product domains and their pages, components, state, schemas, and tests.
  shared/     Reusable non-domain UI, hooks, utilities, and types.
  lib/        Base integrations and adapters.
  test/       Test setup and test-only utilities.
```

The initial product domains are:

| Domain        | Responsibility                                                                      |
| ------------- | ----------------------------------------------------------------------------------- |
| `landing`     | Public landing experience before authentication.                                    |
| `auth`        | Sign-in, sign-out, session-facing screens, and auth flow UI.                        |
| `leagues`     | League creation, membership, invitations, and league administration.                |
| `tournaments` | Tournament catalog, activation, fixtures, rules, and historical tournament context. |
| `predictions` | Match predictions, extra predictions, locking, and prediction visibility.           |
| `rankings`    | League-scoped current and historical rankings.                                      |
| `profile`     | User profile display and editing.                                                   |
| `admin`       | System administration for tournaments, fixtures, results, and corrections.          |

## Dependency Direction

Dependencies must point inward toward reusable infrastructure, never sideways into another feature.

```text
app -> routes -> features -> shared
app -> routes -> features -> lib
shared -> lib only when the utility is integration-agnostic enough to remain shared
lib -> no app, routes, or feature imports
```

Rules:

- `app` may import `routes`, `shared`, and `lib`.
- `routes` may import feature pages, route guards, route layouts, and app-level route helpers.
- A feature may import `shared` and `lib`.
- A feature must not import another feature directly.
- `shared` must not import from `app`, `routes`, or `features`.
- `lib` must not import from `app`, `routes`, `features`, or `shared` unless the dependency is a pure type or utility with no UI/domain coupling.

If two features need the same concept, move the non-domain part to `shared` or expose it through a backend/API boundary. Do not create hidden feature-to-feature coupling.

## Routes And Pages

The route map and authentication flow are documented in `docs/frontend-routing-auth.md`.

`src/routes` owns the route tree and route-level decisions:

- URL paths.
- Route guards.
- Route-level layouts.
- Lazy loading boundaries when they are introduced.
- Mapping routes to feature pages.

Pages and screens live in `src/features/<domain>/pages`. A route imports a page from its owning feature and composes it into the central route tree.

Features do not register routes by themselves. This keeps navigation visible in one place and prevents routes from becoming scattered across domains.

## State Management

Use the smallest state owner that fits the problem:

| State                                     | Owner                                      |
| ----------------------------------------- | ------------------------------------------ |
| Remote data, loading, cache, invalidation | TanStack Query                             |
| Form state                                | React Hook Form                            |
| URL state                                 | React Router search params and path params |
| Local component interaction               | React state                                |
| Cross-screen client UI state              | Zustand                                    |

Do not copy server data into Zustand. If data comes from the API, TanStack Query owns it.

## API Client Boundary

The full API and environment strategy is documented in `docs/frontend-api-env.md`.

`src/lib/api` is the transport boundary. It owns base URL handling, request creation, response parsing, and transport-level errors.

Features should not call `fetch` directly. Feature data access should go through small feature-local query or mutation helpers that delegate to `src/lib/api`.

This keeps transport concerns out of product screens and makes backend contract changes easier to isolate.

## Auth Boundary

`src/lib/auth` owns provider integration and session adapter concerns. `src/features/auth` owns user-facing auth screens and auth flow UI.

Route guards belong in `src/routes` because they decide navigation access. Guards may depend on auth adapter state, but auth screens should not own global route protection.

## Forms And Validation

Use React Hook Form for form state and Zod for validation schemas.

Conventions:

- Form schemas live near the feature form that owns them.
- Shared schemas only belong in `shared` when they are truly reused across unrelated domains.
- API response validation belongs near the API/domain boundary, not inside presentational components.
- UI-only form constraints should still be represented in schemas when they affect valid submission.

## Component Organization

The design system foundation, Tailwind conventions, and UI component tiers are documented in `docs/frontend-design-system.md`.

Inside a feature, use folders by role only when the feature needs them:

```text
src/features/<domain>/
  pages/       Route-targeted screens.
  components/  Domain-specific components.
  hooks/       Domain-specific hooks.
  api/         Feature query and mutation helpers.
  schemas/     Zod schemas.
  store/       Feature-local Zustand stores when justified.
```

Do not create every folder up front. Add folders when real code needs them.

`src/shared/ui` is for reusable primitives or composed UI with no product-domain meaning. If a component mentions leagues, tournaments, predictions, rankings, profiles, auth, or admin behavior, it belongs in the owning feature.

## What Not To Put In Shared

Do not put these in `src/shared`:

- Domain components such as league cards, prediction forms, ranking tables, or admin panels.
- Domain hooks such as `useLeague`, `usePredictionLock`, or `useTournamentRules`.
- Business rules that depend on Prode concepts.
- API endpoint helpers tied to a product domain.
- One-off code used by only one feature.

Shared code must earn its place by being reused and domain-neutral.

## Testing Conventions

The full testing strategy and quality gates are documented in `docs/frontend-testing-quality.md`. Use Vitest and React Testing Library.

Conventions:

- Test behavior instead of implementation details.
- Keep tests near the code they verify using `*.test.ts` or `*.test.tsx`.
- Feature tests should render feature pages/components through realistic providers when behavior depends on routing or query state.
- Use `src/test` for global setup and test-only helpers.
- Do not test placeholder exports or folder structure. Test user-visible behavior and domain rules.

## Naming Conventions

Use names that reveal responsibility:

| Thing              | Convention                        | Example                   |
| ------------------ | --------------------------------- | ------------------------- |
| React component    | PascalCase                        | `LeagueCard`              |
| Page/screen        | PascalCase with `Page` suffix     | `LeagueDetailPage`        |
| Hook               | `use` prefix                      | `useLeagueInvitations`    |
| Zustand store hook | `use` prefix and `Store` suffix   | `usePredictionDraftStore` |
| Zod schema         | camelCase with `Schema` suffix    | `predictionFormSchema`    |
| Query key factory  | camelCase with `QueryKeys` suffix | `leagueQueryKeys`         |
| Test file          | Same subject with `.test`         | `LeagueCard.test.tsx`     |

Avoid vague names such as `helpers`, `common`, `utils`, or `types` unless the file content is genuinely broad and small. Prefer names tied to the concept being modeled.

## Implementation Guardrails

- Do not implement product features before their domain behavior is specified.
- Do not add compatibility layers without a real compatibility requirement.
- Do not create barrel files that export nothing or hide unclear ownership.
- Do not introduce feature-to-feature imports.
- Keep route ownership centralized even when feature folders grow.
- Document important architecture decisions in repository docs when they are made.
