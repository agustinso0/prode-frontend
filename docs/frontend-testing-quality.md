# Frontend Testing And Quality Gates

This document defines the Prode frontend testing strategy and quality gates before product feature implementation. The goal is to keep tests confidence-focused, maintainable, and aligned with the current Vite + React stack without adding end-to-end tooling before the product needs it.

## Summary

| Area          | Decision                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Philosophy    | Test user-visible behavior, domain rules, and integration boundaries instead of implementation details.                      |
| MVP layers    | Use unit, component, and feature integration tests. Defer browser end-to-end tests.                                          |
| Test runner   | Vitest with React Testing Library and jsdom.                                                                                 |
| API mocking   | Mock at the smallest boundary that proves behavior; do not add global product endpoint mocks before backend contracts exist. |
| Query testing | Use a fresh TanStack Query client per test render when server state is involved.                                             |
| Coverage      | Track coverage now; enforce targeted coverage for critical logic before enforcing a global threshold.                        |
| Quality gates | Run lint, typecheck, tests, build, and format checks before review-worthy changes.                                           |

## Quick Path

1. Put the test next to the code it verifies using `*.test.ts` or `*.test.tsx`.
2. Prefer user interactions and accessible queries through React Testing Library.
3. Use `src/test/renderWithProviders.tsx` when a component needs routing or TanStack Query context.
4. Mock API transport or feature API functions locally; do not create global product endpoint mocks yet.
5. Run the relevant fast check while developing, then run the full quality gate before handoff.

## Testing Philosophy

Tests should protect behavior users and maintainers care about.

Rules:

- Test behavior over implementation details.
- Prefer confidence over line count.
- Avoid brittle tests tied to class names, internal state, hook call order, or component structure.
- Test contracts at boundaries: schemas, API normalization, route guards, form validation, and important UI states.
- Keep tests easy to read. If a test needs too much setup, improve the seam before adding more assertions.
- Do not write tests for placeholders, empty folders, or scaffolding with no behavior.

## MVP Test Layers

| Layer               | Scope                                                                            | Examples                                                                                 | Owner                                             |
| ------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Unit                | Pure functions, schemas, mappers, query key factories, stores with domain rules. | Zod schema accepts/rejects payloads; ranking mapper handles tie states.                  | Same folder as subject.                           |
| Component           | A component rendered with realistic providers and user interactions.             | Form shows validation errors; dialog focus path works; button disables while submitting. | Feature or shared UI folder.                      |
| Feature integration | A feature page or route-level slice with mocked API boundary and real providers. | League page renders loading, empty, forbidden, and success states.                       | Owning feature folder.                            |
| End-to-end          | Real browser flows across routes and backend-like behavior.                      | Login-to-prediction flow, admin result update flow.                                      | Deferred until Playwright entry criteria are met. |

End-to-end tests are intentionally out of MVP scaffolding. Do not install Playwright during the current foundation phase.

## Test Location And Naming

Tests live next to the subject they verify.

Conventions:

- `ComponentName.test.tsx` for React components and pages.
- `functionName.test.ts` for pure TypeScript modules.
- `schemaName.test.ts` for Zod schemas.
- `queryKeys.test.ts` for query key factories when keys encode non-trivial scope.
- `src/test` is only for global setup and generic test helpers.

Examples:

```text
src/features/leagues/components/LeagueCard.test.tsx
src/features/predictions/schemas/predictionFormSchema.test.ts
src/features/rankings/api/rankingMappers.test.ts
src/routes/guards/authGuard.test.tsx
src/shared/ui/Button.test.tsx
```

Avoid central `tests/` folders for product behavior. Keeping tests near the code preserves ownership and reduces review friction.

## React Testing Library Conventions

Use React Testing Library as a user-observation tool, not as a component inspection tool.

Rules:

- Query by role, label text, placeholder text, visible text, or accessible name first.
- Use `userEvent` for real interactions instead of low-level event dispatch unless the lower-level event is the behavior being tested.
- Assert visible states, accessible errors, navigation outcomes, and callback effects that represent user behavior.
- Avoid querying by CSS class, DOM depth, implementation-only test IDs, or internal state.
- Use `data-testid` only when no accessible query can represent the behavior.
- Keep one behavior per test when possible; do not create broad snapshot-style tests.

## TanStack Query Testing

TanStack Query owns server state. Tests that involve query behavior must avoid shared cache leakage.

Conventions:

- Use a fresh test query client per test render.
- Disable retries in tests unless retry behavior is the subject under test.
- Prefer explicit query states over arbitrary timers.
- Pass query cancellation signals through feature API functions when testing cancellation-sensitive behavior.
- Test invalidation when a mutation changes visible cached data or route-level state.
- Do not test TanStack Query internals; test the feature behavior produced by query states.

Use `createTestQueryClient` from `src/test/renderWithProviders.tsx` for generic component and feature integration tests.

## API Mocking Before Backend Exists

The frontend should build and test without a running backend.

Rules:

- Unit test `src/lib/api` with injected `fetchImpl`.
- Feature API tests may mock transport responses at the feature API edge.
- Component and page tests should mock feature API functions or query functions locally.
- Keep DTO fixtures close to the feature that owns the schema.
- Do not add global mocks for product endpoints before endpoint contracts exist.
- Do not add a mock server dependency until request-level integration tests prove it is useful.

This avoids locking the frontend to invented endpoints and keeps backend contract changes cheap.

## Fixtures And Builders

Fixtures should make valid domain objects easy to create while keeping test intent visible.

Conventions:

- Use small builder functions for domain objects with meaningful defaults.
- Override only the fields relevant to the test.
- Keep builders near the feature tests they support until reuse across features is proven.
- Name builders by domain concept, such as `buildLeague`, `buildFixture`, or `buildRankingRow`.
- Do not put product fixtures in `src/test` unless they are truly cross-cutting and domain-neutral.

Example shape:

```ts
function buildLeague(overrides: Partial<League> = {}): League {
  return {
    id: 'league-1',
    name: 'Friends League',
    role: 'member',
    ...overrides,
  };
}
```

## Form Validation Testing

Forms use React Hook Form for form state and Zod for validation.

Test at two useful levels:

- Schema tests verify boundary cases, required fields, transforms, and cross-field validation.
- Component tests verify user-visible validation messages, field associations, focus behavior, disabled states, and successful submit payloads.

Rules:

- Do not duplicate every schema assertion in component tests.
- Ensure error messages are reachable through accessible descriptions or alerts.
- Submit forms through user actions, not direct calls to implementation handlers.
- Test async submission states when they affect disabled controls, pending labels, or error recovery.

## Route Guard And Auth Flow Testing

Real auth SDK integration is not present yet. Guard tests should verify routing behavior through provider-agnostic auth states.

Conventions:

- Model auth states from `docs/frontend-routing-auth.md`: `unauthenticated`, `authenticating`, `authenticated`, `onboardingRequired`, and `forbidden`.
- Test guards with `MemoryRouter` so redirects and preserved destinations are observable.
- Mock the auth adapter boundary, not Google SDK behavior.
- Verify protected content never flashes while auth or membership checks are unresolved.
- Verify intended destinations are preserved for unauthenticated redirects.
- Verify league-admin and system-admin access separately; league admin does not imply system admin.

When the real auth SDK is introduced, keep SDK-specific tests inside `src/lib/auth` and keep route guard tests provider-agnostic.

## Accessibility Checks In Component Tests

Accessibility is part of correctness, especially for forms, navigation, dialogs, and data-dense UI.

Component tests should check:

- Interactive elements have correct roles and accessible names.
- Inputs are associated with labels.
- Validation errors are announced or associated with fields.
- Focus moves predictably for dialogs, menus, and error recovery paths.
- Keyboard paths exist for non-pointer interactions.
- Loading states communicate blocked interaction when relevant.
- Status is not represented by color alone.

Automated component tests do not replace manual accessibility review, but they should catch regressions in semantics and interaction paths.

## What Not To Test

Do not spend test effort on low-confidence or brittle targets.

Avoid testing:

- Implementation details such as hook order, private state, internal component names, or CSS class ordering.
- Third-party library behavior from React Router, TanStack Query, React Hook Form, Zod, or React Testing Library.
- Placeholder pages with no product behavior.
- Folder structure or empty exports.
- Static copy unless the copy is required for accessibility, navigation, legal meaning, or a product-critical state.
- Snapshots of large DOM trees.
- Pixel-perfect visual output in unit or component tests.

## Quality Commands

Run commands through `npx pnpm` when `pnpm` is not available globally.

| Command                  | When to run                                                | Purpose                                                        |
| ------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------- |
| `npx pnpm lint`          | During development and before handoff.                     | Enforces ESLint, React Hooks, and TypeScript-aware lint rules. |
| `npx pnpm typecheck`     | Before handoff and after type-heavy changes.               | Runs `tsc -b --noEmit` under strict TypeScript.                |
| `npx pnpm test`          | During development and before handoff.                     | Runs the Vitest suite once.                                    |
| `npx pnpm test:watch`    | While writing or debugging tests.                          | Runs Vitest in watch mode.                                     |
| `npx pnpm test:coverage` | Before raising coverage gates or reviewing critical logic. | Generates V8 coverage reports.                                 |
| `npx pnpm build`         | Before handoff and deployment-facing changes.              | Verifies TypeScript build and Vite production bundle.          |
| `npx pnpm format:check`  | Before handoff.                                            | Verifies Prettier formatting.                                  |
| `npx pnpm format`        | When formatting check fails.                               | Formats repository files.                                      |

Full quality gate before review-worthy changes:

```bash
npx pnpm lint
npx pnpm typecheck
npx pnpm test
npx pnpm build
npx pnpm format:check
```

## Git Hook Behavior

Quality tooling already exists and should remain lightweight.

| Hook/tool          | Behavior                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Husky `pre-commit` | Runs `npx pnpm lint-staged`.                                                                      |
| lint-staged        | Runs ESLint and Prettier on staged source files; runs Prettier on staged JSON, CSS, and Markdown. |
| Husky `commit-msg` | Runs `npx pnpm commitlint --edit "$1"`.                                                           |
| commitlint         | Enforces conventional commit message shape.                                                       |

Hooks are a safety net, not the whole quality strategy. Run the full quality gate before handing work off.

## Coverage Stance

Coverage is a signal, not the goal.

Current stance:

- Track coverage with `npx pnpm test:coverage`.
- Do not enforce a global numeric threshold during scaffolding.
- Require meaningful tests for new critical logic as it is introduced.
- Treat untested validation, guard, API normalization, and scoring/prediction rules as review blockers once those areas exist.

Threshold to enforce later:

- Add a global threshold only after the MVP has enough real feature code for the number to be meaningful.
- Start with targeted thresholds for critical modules before broad repository-wide enforcement.
- Candidate critical areas: Zod schemas, route guards, API normalization, prediction locking, scoring/ranking logic, and admin correction flows.

## Future Playwright Entry Criteria

Install and configure Playwright only when end-to-end tests can verify real product value.

Entry criteria:

- Stable route map exists for at least one full product flow.
- Auth strategy is implemented or has a reliable test adapter.
- Backend contract or mock server strategy is stable enough to avoid fake endpoint churn.
- At least one critical flow crosses multiple screens and cannot be covered confidently by component or feature integration tests.
- CI can run browser tests within an acceptable time budget.

Likely first end-to-end flows:

- Public landing to login intent preservation.
- League invite acceptance flow.
- Prediction submission before lock time.
- League admin tournament activation.
- System admin fixture/result update.

## Related Docs

- `docs/frontend-architecture.md` defines source ownership and dependency direction.
- `docs/frontend-routing-auth.md` defines route guards and auth flow boundaries.
- `docs/frontend-api-env.md` defines API, environment, DTO, and TanStack Query conventions.
- `docs/frontend-design-system.md` defines UI, accessibility, and component conventions.
